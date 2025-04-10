import './Storage.css';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useDownloadFile from "../../Other/useDownloadFile"
import useRequest from "../../Other/useRequest"
import fileSize from "../../Other/fileSize"
import FilesUpload from "./FilesUpload/FilesUpload"
import moment from 'moment';
import 'moment/locale/ru';

function Storage() {
  const { isAdmin, storage_id, csrftoken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { storage } = useParams();
  const [ statusField, setStatusField ]=useState({status_edit: false, field_edit: ''});
  const [ files, setFiles ] = useState(false);
  const [ user, setUser ] = useState(false);
  const { downloadFile }= useDownloadFile();
  const { request }= useRequest();

  useEffect(() => {
    if(storage_id !== Number(storage) && !isAdmin) {
      navigate(`/panel/storage/${storage_id}`)
      return;
    } 
    (async() => {
      const response = await request('GET', process.env.REACT_APP_SERVER_HOST + `/api/storage/${storage}/`)
      setFiles(response.files)
      setUser(response.user)
    })()
  },[storage])

  const fileEdit = (async(file_id) => {
    navigate(`/panel/storage/${storage}/${file_id}`)
  })

  const fileDownload = (async(file_id) => {
    await downloadFile(file_id)
  })

  const fileDelete = (async(file_id) => {
    if (await request('DELETE', process.env.REACT_APP_SERVER_HOST + `/api/storage/${storage}/${file_id}/`, false, csrftoken))
      setFiles((await request('GET', process.env.REACT_APP_SERVER_HOST + `/api/storage/${storage}/`)).files)
  })

  const changeField = (e) => {
    setStatusField(() => ({...statusField, 'status_edit': true, 'field_edit': e.target.getAttribute('name')}))
  }

  return (
    <div className='storage'>
      <div className={`storage-title${storage_id === Number(storage) ? '' : ' other'}`}>{storage_id === Number(storage) ? 'Мое хранилище' : user ? `Хранилище пользователя ${user.username} (ID: ${user.id})` : ''}</div>
      {files ?
      <table className="table table-files">
        <tbody>
          <tr>
            <th>№</th>
            <th>Имя файла</th>
            <th>Размер</th>
            <th>Комментарий</th>
            <th>Дата загрузки</th>
            <th>Скачивался</th>
            <th>www</th>
            <th>Действия</th>
          </tr>
          {files.map((file, i) => {
            return (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{decodeURI(file.name_origin)}</td>
              <td>{fileSize(Number(file.size))}</td>
              <td>{file.comment === null ? '-' : file.comment }</td>
              <td>{moment(file.date_load).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>{file.date_download === null ? '-' : moment(file.date_download).format("YYYY-MM-DD HH:mm:ss")}</td>
              <td>{file.public_url === null ? '-' : <FontAwesomeIcon icon="earth" />}</td>
              <td><span className="icon-edit" onClick={() => fileEdit(file.id)}>{'\u{270f}'}</span>&nbsp;
              <span className="icon-download" onClick={() => fileDownload(file.id)}><FontAwesomeIcon icon="download" /></span>&nbsp;
              {<span className="icon-delete" onClick={() => fileDelete(file.id)}>&#10060;</span>}</td>
            </tr>)
          })}
        </tbody>
      </table>
      : ''}
    <FilesUpload files={files} setFiles={setFiles} />
    </div>
  )
}

export default Storage;

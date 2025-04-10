import './File.css';
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import { useSelector } from "react-redux";
import useRequest from "../../../Other/useRequest"
import FieldInput from "../../FieldInput/FieldInput"
import fileSize from "../../../Other/fileSize"
import Share from "./Share/Share"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import 'moment/locale/ru';

function File() {
  const[ file, setFile ]=useState(false);
  const { storage, file_id } = useParams();
  const[ statusField, setStatusField ]=useState({status_edit: false, field_edit: ''});
  const { storage_id, isAdmin, csrftoken } = useSelector((state) => state.user);
  const { request }= useRequest();

  useEffect(() => {
    (async() => {
      const f = await request('GET', process.env.REACT_APP_SERVER_HOST + `/api/storage/${storage}/${file_id}`)
      setFile(f.file)
    })()
  },[])

  const changeField = (e) => {
    setStatusField(() => ({...statusField, 'status_edit': true, 'field_edit': e.target.getAttribute('name')}))
  }

  const saveFile = () => {
    (async() => {
      await request('PATCH', process.env.REACT_APP_SERVER_HOST + `/api/storage/${storage}/${file_id}/`, file, csrftoken)
      const f = await request('GET', process.env.REACT_APP_SERVER_HOST + `/api/storage/${storage}/${file_id}`)
      setFile(f.file)
    })()
  }

  return (
    <>{Number(storage) === storage_id || isAdmin ? 
      <div className='file'>
        {file ?
          <><div className="file-information">
            <table className="table table-file">
              <tbody>
              <tr>
                <th>Имя файла</th>
                <td className='td-pointer' name="name_origin" onClick={changeField}>{statusField.field_edit === "name_origin" && statusField.status_edit ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={file} setObject={setFile} /> : file.name_origin}</td>
              </tr>
              <tr>
                <th>Размер</th>
                <td>{fileSize(Number(file.size))}</td>
              </tr>        
              <tr>
                <th>Комментарий</th>
                <td className='td-pointer' name="comment" onClick={changeField}>{statusField.field_edit === "comment" && statusField.status_edit ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={file} setObject={setFile} /> : file.comment}</td>
              </tr>
              <tr>
                <th>Дата загрузки</th>
                <td>{moment(file.date_load).format("YYYY-MM-DD HH:mm:ss")}</td>
              </tr>   
              <tr>
                <th>Последнее скачивание</th>
                <td>{file.date_download ? moment(file.date_download).format("YYYY-MM-DD HH:mm:ss") : ''}</td>
              </tr>   
              <tr>
                <th>Публичный доступ</th>
                <td>{file.public_url === null ? '-' : <FontAwesomeIcon icon="earth" />}</td>
              </tr>   
              </tbody>
            </table>
            <input type='button' className="file-btn-save" value="Сохранить" onClick={saveFile} />
        </div> 
        <Share file={file} setFile={setFile} /></>
        : ''}
      </div>
    : <Navigate to='/panel/storage' replace />}</>
  )
}

export default File;
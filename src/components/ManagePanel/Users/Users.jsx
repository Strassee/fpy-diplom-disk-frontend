import './Users.css';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useRequest from "../../Other/useRequest"
import fileSize from "../../Other/fileSize"
import moment from 'moment';
import 'moment/locale/ru';

function Users() {
  const { csrftoken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const[ users, setUsers ]=useState(false);
  const { request }= useRequest();

  useEffect(() => {
    (async() => setUsers(await request('GET', process.env.REACT_APP_SERVER_HOST + '/api/users/')))()
  },[])

  const userDelete = (async(id) => {
    if (await request('DELETE', process.env.REACT_APP_SERVER_HOST + `/api/user/${id}/`, false, csrftoken))
      setUsers(await request('GET', process.env.REACT_APP_SERVER_HOST + '/api/users/'))
  })

  const userEdit = (async(id) => {
    navigate(`/panel/user/${id}`)
  })

  return (
    <div className="users">
      {users ?
      <table className="table table-users">
        <tbody>
          <tr>
            <th>id</th>
            <th>username</th>
            <th>admin</th>
            <th>staff</th>
            <th>active</th>
            <th>Кол-во файлов</th>
            <th>Размер файлов</th>
            <th>Дата обновления</th>
            <th>Хранилище</th>
            <th>actions</th>
          </tr>
          {users.map((user, i) => {
            console.log(user)
            return (
            <tr key={i}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.is_superuser ? '\u{2713}' : '-'}</td>
              <td>{user.is_staff ? '\u{2713}' : '-'}</td>
              <td>{user.is_active ? '\u{2713}' : '-'}</td>
              <td>{user.storage.count_files}</td>
              <td>{fileSize(Number(user.storage.total_files_size))}</td>
              <td>{moment(user.storage.last_update).format("YYYY-MM-DD HH:mm:ss")}</td>
              {/* <td><a className="tag-a" href={process.env.REACT_APP_HOST + `/panel/storage/${user.storage.id}`}>Перейти</a></td> */}
              <td><span className="span-pointer" onClick={() => navigate(`/panel/storage/${user.storage.id}`)}>Перейти</span></td>
              <td>
                <span className="icon-edit" onClick={() => userEdit(user.id)}>{user.id !== 1 ? '\u{270f}' : '\u{1F50E}'}</span>&nbsp;
                {user.id !== 1 ? <span className="icon-delete" onClick={() => userDelete(user.id)}>&#10060;</span> : ''}
              </td>
            </tr>)
          })}
        </tbody>
      </table>
      : ''}
    </div>
  )
}

export default Users;
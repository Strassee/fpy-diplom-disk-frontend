import './User.css';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router';
import { useNavigate } from "react-router";
import useRequest from "../../Other/useRequest"
import FieldInput from "../FieldInput/FieldInput"
import fileSize from "../../Other/fileSize"

import moment from 'moment';
import 'moment/locale/ru';

function User() {
  const { isAdmin, user_id, csrftoken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const[ user, setUser ]=useState(false);
  const[ statusField, setStatusField ]=useState({status_edit: false, field_edit: ''});
  const[ statusBooleanField, setStatusBooleanField ]=useState({is_superuser: '', is_staff : '', is_active: ''});
  const { id_user } = useParams();
  const { request }= useRequest();

  useEffect(() => {
    if(user_id !== Number(id_user) && !isAdmin) {
      navigate(`/panel/user/${user_id}`)
      return;
    } 
    (async() => setUser(await request('GET', process.env.REACT_APP_SERVER_HOST + `/api/user/${id_user}/`)))()
  },[id_user])

  useEffect(() => {
    setStatusBooleanField(() => ({...statusBooleanField, 'is_superuser': user.is_superuser ? '\u{2713}' : '-', 'is_staff': user.is_staff ? '\u{2713}' : '-', 'is_active': user.is_active ? '\u{2713}' : '-',}))
  },[user])

  const changeBool = (e) => {
    if(user.id !== 1 && isAdmin) {
      const name = e.target.getAttribute('name')
      setUser(() => ({...user, [name]: !user[name]}))
    }
  }

  const changeField = (e) => {
    const field_edit = e.target.getAttribute('name')
    if (field_edit !== 'email' || isAdmin) {
      setStatusField(() => ({...statusField, 'status_edit': true, 'field_edit': field_edit}))
    }
  }

  const saveUser = () => {
    (async() => {
      await request('PATCH', process.env.REACT_APP_SERVER_HOST + `/api/user/${id_user}/`, user, csrftoken)
      setUser(await request('GET', process.env.REACT_APP_SERVER_HOST + `/api/user/${id_user}/`))
    })()
  }

  return (
    <div className="user">
      { user ?
      <><table className="table table-user">
        <tbody>
        <tr>
          <th>id</th>
          <td>{user.id}</td>
        </tr>
        <tr>
          <th>Логин</th>
          <td>{user.username}</td>
        </tr>        
        <tr>
          <th>Имя</th>
          <td className='td-pointer' name="first_name" onClick={changeField}>{statusField.field_edit === "first_name" && statusField.status_edit ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} /> : user.first_name}</td>
        </tr>
        <tr>
          <th>Фамилия</th>
          <td className='td-pointer' name="last_name" onClick={changeField}>{statusField.field_edit === "last_name" && statusField.status_edit ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} /> : user.last_name}</td>
        </tr>    
        <tr>
          <th>E-mail</th>
          <td className={isAdmin ? 'td-pointer' : ''} name="email" onClick={changeField}>{statusField.field_edit === "email" && statusField.status_edit ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} /> : user.email}</td>
        </tr>  
        <tr>
          <th>Пароль</th>
          <td className='td-pointer' name="password" onClick={changeField}>{statusField.field_edit === "password" && statusField.status_edit ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} /> : 'Изменить'}</td>
        </tr>         
        <tr>
          <th>Администратор</th>
          <td className={isAdmin && id_user !== '1' ? 'td-pointer' : ''} name="is_superuser" onClick={changeBool}>{statusBooleanField.is_superuser}</td>
        </tr>   
        <tr>
          <th>Сотрудник</th>
          <td className={isAdmin && id_user !== '1' ? 'td-pointer' : ''} name="is_staff" onClick={changeBool}>{statusBooleanField.is_staff}</td>
        </tr>   
        <tr>
          <th>Активный</th>
          <td className={isAdmin && id_user !== '1' ? 'td-pointer' : ''} name="is_active" onClick={changeBool}>{statusBooleanField.is_active}</td>
        </tr>   
        <tr>
          <th>Последний вход</th>
          <td>{moment(user.last_login).format("YYYY-MM-DD HH:mm:ss")}</td>
        </tr>   
        <tr>
          <th>Добавлен</th>
          <td>{moment(user.date_joined).format("YYYY-MM-DD HH:mm:ss")}</td>
        </tr>
        <tr>
          <th>Количество файлов</th>
          <td>{user.storage.count_files}</td>
        </tr>
        <tr>
          <th>Общий размер файлов</th>
          <td>{fileSize(Number(user.storage.total_files_size))}</td>
        </tr>
        <tr>
          <th>Дата обновления хранилища</th>
          <td>{moment(user.storage.last_update).format("YYYY-MM-DD HH:mm:ss")}</td>
        </tr>
        <tr>
          <th>Ссылка на хранилище</th>
          {/* <td>{moment(user.date_joined).format("YYYY-MM-DD HH:mm:ss")}</td> */}
          <td><span className="span-pointer" onClick={() => navigate(`/panel/storage/${user.storage.id}`)}>Перейти</span></td>
        </tr>
        <tr>
          <th>Группы</th>
          <td>{user.groups}</td>
        </tr>   
        <tr>
          <th>Разрешения</th>
          <td>{user.user_permissions}</td>
        </tr>                       
          {/* {Object.entries(user).map((item, i) => {
            return (
            <tr key={i}>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
            </tr>)
          })} */}
        </tbody>
      </table>
      <div className="user-save">
        <input type='button' className="user-btn-save" value="Сохранить" onClick={saveUser} />
      </div></>      
      : '' }
    </div>
  )
}

export default User;
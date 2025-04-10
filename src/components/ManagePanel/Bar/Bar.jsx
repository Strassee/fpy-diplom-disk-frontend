import './Bar.css';
import { useSelector } from "react-redux";
import { NavLink } from "react-router";
import useRequest from "../../Other/useRequest";
import useDispatching from "../../Other/useDispatching";

function Bar() {
  const { isAdmin, user_id, storage_id } = useSelector((state) => state.user);
  const { request }= useRequest();
  const { dispatching }= useDispatching();

  const logout = async() => {
    if(await request('GET', process.env.REACT_APP_SERVER_HOST + '/api/user/logout/')) {
      dispatching(false, false, false, false, false)
    };
  }
  console.log(window.location.pathname)
  return ( 
    <div className="bar">
      <nav>
        <ul className="bar-ul">
          {isAdmin ? 
          <NavLink to="/panel/users"className={({ isActive }) => (isActive ? 'li-nav li-nav-active' : 'li-nav')}><li>Пользователи</li></NavLink>
          : ''}
          <NavLink to={`/panel/user/${user_id}`} className={({ isActive }) => (isActive ? 'li-nav li-nav-active' : 'li-nav')}><li>Профиль</li></NavLink>
          <NavLink to={`/panel/storage/${storage_id}`} className={({ isActive }) => (isActive ? 'li-nav li-nav-active' : 'li-nav')}><li>Хранилище</li></NavLink>
          <li onClick={logout}>Выйти</li>
        </ul>
      </nav>
    </div>
  )
}

export default Bar;
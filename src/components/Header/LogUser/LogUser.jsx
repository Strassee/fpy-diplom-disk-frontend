import './LogUser.css';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import useRequest from "../../Other/useRequest";
import useDispatching from "../../Other/useDispatching";

function LogUser() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { request }= useRequest();
  const { dispatching }= useDispatching();

  const logout = async() => {
    if(await request('GET', process.env.REACT_APP_SERVER_HOST + '/api/user/logout/')) {
      dispatching(false, false, false, false, false)
    };
  }

  return (
  <div className="sign-block">
     {isLoggedIn ? <input type='button' className="btn-signout" value="Выйти" onClick={logout} /> :
      <><input type='button' className="btn-signin" value="Войти" onClick={() => navigate("/login")} />
      <input type='button' className="btn-signup" value="Регистрация" onClick={() => navigate("/reg")}/></>
    }
  </div>

  )
}

export default LogUser;
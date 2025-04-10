import './Main.css';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function Main( {url} ) {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
      <div className="main">
        <div  className="main-title">Добро пожаловать в облачное хранилище Disk</div>
        {isLoggedIn ?
        <input type='button' className="btn-to-panel" value="Панель управления" onClick={() => navigate("/panel")} />
        : '' }
      </div>
  )
}

export default Main;
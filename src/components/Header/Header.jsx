import './Header.css';
import { Link } from "react-router";
import LogUser from "./LogUser/LogUser"

function Header() {

  return (
    <div className="header">
      <div  className="header-title"><Link to={'/'} className="to-home">Home for your files</Link></div>
      <LogUser />
    </div>
  )
}

export default Header;
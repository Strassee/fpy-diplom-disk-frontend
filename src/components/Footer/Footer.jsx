import './Footer.css';
import moment from 'moment';
import 'moment/locale/ru';

function Footer() {

  return (
      <div className="footer">
        <div className="footer-sign">
          {moment(new Date()).format("YYYY")}@Developed by Evgeniy Filkin <br />
          jeka_krsk@mail.ru
        </div>
      </div>
  )
}

export default Footer;
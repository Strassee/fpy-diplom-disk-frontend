import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router';
import { useSelector } from "react-redux";
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import ManagePanel from './components/ManagePanel/ManagePanel';
import ProtectedRoute from './components/Other/ProtectedRoute'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash, faDownload, faEarth } from '@fortawesome/free-solid-svg-icons'

function App() {
  const { isLoggedIn } = useSelector((state) => state.user);
  library.add(faEye, faEyeSlash, faDownload, faEarth)

  return (
    <div className="App">
      <BrowserRouter>
        <div className="mainpage">
            <Header />
            <div className="content">
              <Routes>
                {/* <Route path="/*" exact element={!isLoggedIn ? <Main /> : <ManagePanel />} /> */}
                <Route path="/" exact element={ <Main />} />
                <Route exact element={<ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/panel" />}>
                  <Route exact element={<Login />} path="/login"/>
                  <Route exact element={<Registration />} path="/reg"/>
                </Route>
                <Route exact element={<ProtectedRoute isAllowed={isLoggedIn} />}>
                  <Route exact element={<ManagePanel />} path="/panel/*"/>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

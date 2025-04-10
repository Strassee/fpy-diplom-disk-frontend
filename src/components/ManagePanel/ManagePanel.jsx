import './ManagePanel.css';
import {Routes, Route} from 'react-router';
import { useSelector } from "react-redux";
import Bar from './Bar/Bar'
import Users from './Users/Users'
import User from './User/User'
import Storage from './Storage/Storage'
import File from './Storage/File/File'
import ProtectedRoute from '../Other/ProtectedRoute'

function ManagePanel() {
  const { isLoggedIn, isAdmin} = useSelector((state) => state.user);
  return (
    <div className="manage-panel">
      <Bar />
      <div className="panel">
        <Routes>
          <Route exact element={<ProtectedRoute isAllowed={isLoggedIn && isAdmin} />}>
            <Route exact element={<Users />} path="/users"/>
          </Route>
          <Route exact element={<ProtectedRoute isAllowed={isLoggedIn} />}>
            <Route exact element={<User />} path="/user/:id_user"/>
            <Route exact element={<Storage />} path="/storage/:storage"/>
            <Route exact element={<File />} path="/storage/:storage/:file_id"/>
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default ManagePanel;
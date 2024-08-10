import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import View from './sites/View';
import Add from './sites/Add';
import Home from './sites/Home';
import Register from './sites/Register';
import Login from './sites/Login';
import PageNotFound from './sites/PageNotFound';
import Logout from './sites/Logout';

import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/add" element={<PrivateRoute><Add/></PrivateRoute>}/>
        <Route path="/view/:id" element={<View/>}/>

        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Logout/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </Router>
  );
}

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const isAuthenticated = !!Cookies.get("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;

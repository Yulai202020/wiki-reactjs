import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("token");
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;

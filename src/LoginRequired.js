import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    let navigate = useNavigate();
    let token = localStorage.getItem('access_token');

    useEffect(() => {
      let setnew = /^api\/password_reset\/confirm\/email\//;
      if (!token && window.location.pathname !== '/signup' && window.location.pathname !== '/reset' && setnew.test(window.location.pathname)) { 
        navigate('/login');
      }
    }, [token, navigate]);

    return <WrappedComponent {...props} />;
  }
}

export default withAuth;
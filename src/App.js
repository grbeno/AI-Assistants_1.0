import React, {useEffect, useRef, useState, useContext} from 'react';
import { useNavigate  } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './Style/App.css';
import {expirationTime} from './utils';
import AuthContext from './Auth/AuthContext';
import axiosInstance from './axios';
import withAuth from './LoginRequired';
import LangImage from './images/computer-4.png';
import CodeImage from './images/computer-1.png';
import ChatImage from './images/screen.png';


const App = () => {

  const {deleteUser} = useContext(AuthContext);
  
  // token
  var token = localStorage.getItem('access_token');
  const user = token ? jwtDecode(token) : '';
  const expirationTimeRefAccess = useRef(expirationTime('access_token'));
  const expirationTimeRefRefresh = useRef(expirationTime('refresh_token'));

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    
    const userConfirmation = window.confirm("Are you sure? This action cannot be undone. The user will be deleted.");
    
    if (!userConfirmation) {
        return; // If the user clicks "Cancel", stop the function
    }
    
    try {
        await deleteUser((errorMessage) => {
            setError(errorMessage);
        }, user.user_id);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete axiosInstance.defaults.headers['Authorization'];
    } catch (error) {
        console.error(error);
    }
  }

  // useEffect for tokens
  useEffect(() => {
    let validToken = token
    console.log(expirationTimeRefAccess);
    console.log(expirationTimeRefRefresh);
    if (!validToken && window.location.pathname === '/') {
      navigate('/login');
    }
  } , [expirationTimeRefAccess, expirationTimeRefRefresh, navigate, token]);

  token = true;

  return (
    <>
    {token && window.location.pathname === '/' &&
      <div className="App">
      
      <div className="d-flex m-3 mt-0 justify-content-center">
        <div className="d-flex p-3 col-12 col-xl-6 border-bottom justify-content-between">
          <h3 className="float-left text-light">
            <span className="h5 text-secondary">
              <i className="d-none d-md-inline-block fa-solid fa-user mr-2" style={{transform: "translateY(-12%)"}}></i>
            </span>
             Hello, {user.username}</h3>
          <div></div>
          <div>
            <a href="/change"><span className="h5 text-info" data-toggle="tooltip" title="change password"><i className="fa-solid fa-key mx-2"></i></span></a>
            <button onClick={handleDeleteUser} className='bg-transparent border-0'><span className="h5 text-danger" data-toggle="tooltip" title="delete user"><i className="fa-solid fa-user-xmark mx-2"></i></span></button>
          </div>
        </div>
      </div>
      
      {/* You should delete this */}
      <div className="d-flex justify-content-center">
        {/* <div className="card col-12 col-xl-6 text-light" style={{background: '#17592f'}}> */}
        <div className="col-12 col-xl-6 bg-transparent text-light">
        <div className="content-list card p-3 m-0 m-xl-3 bg-transparent border border-0">
            <div>Access Token Expiration Time: {expirationTimeRefAccess.current}</div>
            <div>Refresh Token Expiration Time: {expirationTimeRefRefresh.current}</div>
        </div>
        {/* </div> */}
         
        </div>
      </div>

      <div className="d-flex m-3 justify-content-center">
        <div className="d-flex p-3 col-12 col-xl-6 border-bottom justify-content-between">
          <h3 className="float-left text-light">Content</h3>
        </div>
      </div>

     <div className="grid-container">
        <div className="grid">
          <button className="grid-item" onClick={() => window.location.href='/lang-assistant'}>
            <div className="image-container">
              <img src={LangImage} alt="Language" />
            </div>
            <span className="grid-text">AI-Assistant for languages</span>
          </button>
          <button className="grid-item" onClick={() => window.location.href='/lang-assistant'}>
            <div className="image-container">
              <img src={ChatImage} alt="Text-editing" />
            </div>
            <span className="grid-text">Real Time AI-Chat</span>
          </button>
          <button className="grid-item" onClick={() => window.location.href='/coder-assistant'}>
            <div className="image-container">
              <img src={CodeImage} alt="Coding" />
            </div>
            <span className="grid-text">AI-Assistant for coding</span>
          </button>
        
        {/*  <button className="grid-item" onClick={() => window.location.href='/'}>
            <div className="image-container">
              <img src="/images/language-icon.png" alt="AI-4" />
            </div>
            <span className="grid-text">AI-Assistant for </span>
          </button>
          <button className="grid-item" onClick={() => window.location.href='/'}>
            <div className="image-container">
              <img src="/images/coding-icon.png" alt="AI-5" />
            </div>
            <span className="grid-text">AI-Assistant for </span>
          </button>
          <button className="grid-item" onClick={() => window.location.href='/'}>
            <div className="image-container">
              <img src="/images/editing-icon.png" alt="AI-6" />
            </div>
            <span className="grid-text">AI-Assistant for </span>
          </button>  */}
        
        </div>
      </div>

    </div>  
    }
    {error && 
      <div className="d-flex mt-3 justify-content-center">
        <h5 className="p-4 text-danger rounded" style={{backgroundColor: '#f4c0c0'}}>
            <i className="sign-icon fa-solid fa-triangle-exclamation mx-3"></i>
            {error}
        </h5>
      </div>
    }
    </>
  );
}

export default withAuth(App);  // App;

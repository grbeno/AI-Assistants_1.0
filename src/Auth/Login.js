import React, {useContext, useEffect, useState} from 'react'
import AuthContext from "./AuthContext";
import {Icon} from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {unlock} from 'react-icons-kit/feather/unlock';


const Login = () => {

    const {login} = useContext(AuthContext);
    const token = localStorage.getItem('access_token');
    const [error, setError] = useState("");
    const [icon, setIcon] = useState(eyeOff);
    const [password, setPassword] = useState("");
    const [type, setType] = useState('password');

    const handleLogin = (e) => {
        e.preventDefault();
        login(e,
            (errorMessage) => {
            setError(errorMessage);
        });
    };

    // show-hide password
    const handleShowPassword = () => {
        if (type === 'password') {
            setType('text');
            setIcon(eye);
        } else {
            setType('password');
            setIcon(eyeOff);
        }
    }

    useEffect(() => {
        if (token) {
            window.location.href = '/';
        }   
      }, [token]); 

    return (
        <>
        {!token &&
            <div className="container d-flex mt-4 justify-content-center">
                <form className='auth-form' onSubmit={handleLogin}>
                <fieldset>
                    <legend>Login
                        <span className='text-light mx-2'>
                            <Icon style={{transform: "translateY(-5%)"}} icon={unlock} size={20}/>
                        </span>
                    </legend>
                    <hr className='bg-light'/>
                    <div className='pb-3'>
                        <input className='p-2 text-center rounded form-control' type="text" name="username" placeholder="username"/>
                    </div>
                    <div className='position-relative'>
                        <input className='p-2 text-center rounded form-control' type={type} onChange={(e) => setPassword(e.target.value)} value={password} name="password" placeholder="password"/>
                        <span className="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={handleShowPassword}>
                            <Icon icon={icon} size={13}/>
                        </span>
                    </div>
                    <div className='d-flex p-2 pt-4 pb-4 justify-content-center'>
                        <input className='p-2 px-3 bg-primary text-light border-0 rounded' type="submit" value="Login"/>
                    </div>
                    <div className='d-flex pb-4 justify-content-center'>
                        <div className='d-block text-light'>
                        <hr className='bg-light'/> 
                            <h6>Not signed up yet?<a href="/signup" className='text-warning'> Signup</a></h6>
                            <h6>Forgotten password?<a href="/reset" className='text-warning'> Reset</a></h6>
                        </div>
                    </div>
                </fieldset>
                </form>  
            </div>
        }
        {error && 
            <div className="d-flex mt-3 justify-content-center">
                <h6 className="error-message">
                    <i className="sign-icon fa-solid fa-triangle-exclamation h5 mx-2" style={{transform: "translateY(16%)"}}></i>
                    {error}
                </h6>
            </div>
        }
        </>
    );
}

export default Login
import React, {useContext, useState} from 'react'
import AuthContext from "./AuthContext";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import {unlock} from 'react-icons-kit/feather/unlock'
import {info} from 'react-icons-kit/feather/info'

const Signup = () => {

    const {signup} = useContext(AuthContext);
    const token = localStorage.getItem('access_token');
    const [error, setError] = useState("");
    const [icon, setIcon] = useState(eyeOff);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [type, setType] = useState('password');

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

    const handleSignup = (e) => {
        e.preventDefault();
        signup(e, (errorMessage) => {
            setError(errorMessage);
        });
    };

    return (
        <>
        {!token &&
            <div className="container d-flex mt-4 justify-content-center">
                <form className="auth-form" onSubmit={handleSignup}>
                <fieldset>
                    <legend>Sign up 
                        <span className='text-light mx-2'>
                            <Icon style={{transform: "translateY(-5%)"}} icon={unlock} size={20}/>
                        </span>
                        <span className='text-warning' data-toggle="tooltip" title="Your password must contain at least 8 characters, at least one number, at least one uppercase letter and only alphanumeric characters.">
                            <Icon style={{transform: "translateY(-5%)"}} icon={info} size={20}/>
                        </span>
                    </legend>
                    <hr className='bg-light'/>
                    <div className='p-2'>
                        <input className='p-2 text-center rounded form-control' type="text" name="username" placeholder="username"/>
                    </div>
                    <div className='p-2'>
                        <input className='p-2 text-center rounded form-control' type="text" name="email" placeholder="email"/>
                    </div>
                    <div className='p-2 position-relative'>
                        <input className='p-2 text-center rounded form-control' type={type} onChange={(e) => setPassword(e.target.value)} value={password} name="password" placeholder="password"/>
                        <span className="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={handleShowPassword}>
                            <Icon icon={icon} size={13}/>
                        </span>
                    </div>
                    <div className='p-2 position-relative'>
                        <input className='p-2 text-center rounded form-control' type={type} onChange={(e) => setPassword2(e.target.value)} value={password2} name="password2" placeholder="password again"/>
                    </div>
                    <div className='d-flex p-2 pt-4 justify-content-center'>
                        <input className='p-2 px-3 bg-primary text-light border-0 rounded' type="submit" value="Signup"/>
                    </div>
                </fieldset>
                </form>
            </div>
        }
        {error && 
            <div className="d-flex mt-3 justify-content-center">
                <h6 className="error-message">
                    <i className="h5 sign-icon fa-solid fa-triangle-exclamation mx-2" style={{transform: "translateY(16%)"}}></i>
                    {error}
                </h6>
            </div>
        }
        </>
    );
}

export default Signup
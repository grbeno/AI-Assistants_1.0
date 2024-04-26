import React, {useContext, useState} from 'react'
import AuthContext from "./AuthContext";
import {Icon} from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {unlock} from 'react-icons-kit/feather/unlock';
import {info} from 'react-icons-kit/feather/info';


const Signup = () => {

    const {signup} = useContext(AuthContext);
    const token = localStorage.getItem('access_token');
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [isLoading, setIsLoading] = useState(false);

   // Initialize state for each input field
    const [passwordType, setPasswordType] = useState({
        password1: 'password',
        password2: 'password',
    });

    // for all input fields
    const handleShowPassword = (field) => {
        setPasswordType({
            ...passwordType,
            [field]: passwordType[field] === 'password' ? 'text' : 'password'
        });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        setIsLoading(true);
        signup(e, (errorMessage) => {
            setError(errorMessage);
            setIsLoading(false);
        });
    };

    return (
        <>
        {!token &&
            <div className="container d-flex mt-4 justify-content-center">
                <form className="auth-form" onSubmit={handleSignup}>
                <fieldset>
                    <legend>Sign up 
                        <span className='mx-2 text-light'>
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
                        <input className='p-2 text-center rounded form-control' type={passwordType.password1} onChange={(e) => setPassword(e.target.value)} value={password} name="password" placeholder="password"/>
                        <span className="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={() => handleShowPassword('password1')}>
                            <Icon icon={passwordType.password1 === 'password' ? eyeOff : eye} size={13}/>
                        </span>
                    </div>
                    <div className='p-2 position-relative'>
                        <input className='p-2 text-center rounded form-control' type={passwordType.password2} onChange={(e) => setPassword2(e.target.value)} value={password2} name="password2" placeholder="confirm password"/>
                        <span className="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={() => handleShowPassword('password2')}>
                            <Icon icon={passwordType.password2 === 'password' ? eyeOff : eye} size={13}/>
                        </span>
                    </div>
                    <div className='d-flex p-2 pt-4 justify-content-center'>
                        <input className='p-2 px-3 bg-primary text-light border-0 rounded' type="submit" value="Signup"/>
                    </div>
                </fieldset>
                </form>
            </div>
        }
        {isLoading ? <div className='d-flex mt-4 justify-content-center'><div className='spinner'></div></div> : '' }
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

export default Signup
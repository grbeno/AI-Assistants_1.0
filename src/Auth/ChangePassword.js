import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import {info} from 'react-icons-kit/feather/info';

const ChangePassword = () => {
    
    const {change} = useContext(AuthContext);
    const [error, setError] = useState('');
    const [icon, setIcon] = useState(eyeOff);
    const [type, setType] = useState('password');
    const [old_password, setOldPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [new_password2, setNewPassword2] = useState('');

    const handleChange = (e) => {
        e.preventDefault();
        change(e, (errorMessage) => {
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
    };

    return (
        <>
        <div className="container d-flex mt-3 justify-content-center">
            <form className='auth-form' onSubmit={handleChange}>
            <fieldset>
                <legend>Change password
                    <span className='text-warning mx-2' data-toggle="tooltip" title="Your password must contain at least 8 characters, at least one number, at least one uppercase letter and only alphanumeric characters.">
                        <Icon style={{transform: "translateY(-5%)"}} icon={info} size={20}/>
                    </span>
                </legend>
                <hr className='bg-light'/>
                <div className='p-2 position-relative'>
                    <input className='p-2 text-center rounded form-control' type={type} onChange={(e) => setOldPassword(e.target.value)} value={old_password} name="old_password" placeholder="old_password"/>
                    <span class="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={handleShowPassword}>
                        <Icon icon={icon} size={15}/>
                    </span>    
                </div>
                <div className='p-2'>
                    <input className='p-2 text-center rounded form-control' type={type} onChange={(e) => setNewPassword(e.target.value)} value={new_password} name="new_password" placeholder="new_password"/>
                </div>
                <div className='p-2'>
                    <input className='p-2 text-center rounded form-control' type={type} onChange={(e) => setNewPassword2(e.target.value)} value={new_password2} name="new_password2" placeholder="new_password2"/>
                </div>
                <div className='d-flex p-2 pt-4 pb-4 justify-content-center'>
                    <input className='p-2 px-3 bg-primary text-light border-0 rounded' type="submit" value="Change"/>
                </div>
            </fieldset>       
            </form>
        </div>
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
};

export default ChangePassword;
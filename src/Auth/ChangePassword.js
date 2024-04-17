import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import {info} from 'react-icons-kit/feather/info';


const ChangePassword = () => {
    
    const {change} = useContext(AuthContext);
    const [error, setError] = useState('');
    const [old_password, setOldPassword] = useState('');
    const [new_password1, setNewPassword] = useState('');
    const [new_password2, setNewPassword2] = useState('');

    const handleChange = (e) => {
        e.preventDefault();
        change(e, (errorMessage) => {
            setError(errorMessage);
        });
    };

    // Initialize state for each input field
    const [passwordType, setPasswordType] = useState({
        oldPassword: 'password',
        newPassword1: 'password',
        newPassword2: 'password'
    });

    // for all input fields
    const handleShowPassword = (field) => {
        setPasswordType({
            ...passwordType,
            [field]: passwordType[field] === 'password' ? 'text' : 'password'
        });
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
                    <input className='p-2 text-center rounded form-control' type={passwordType.oldPassword} onChange={(e) => setOldPassword(e.target.value)} value={old_password} name="old_password" placeholder="old_password"/>
                    <span class="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={() => handleShowPassword('oldPassword')}>
                        <Icon icon={passwordType.oldPassword === 'password' ? eyeOff : eye} size={15}/>
                    </span>    
                </div>
                <div className='p-2 position-relative'>
                    <input className='p-2 text-center rounded form-control' type={passwordType.newPassword1} onChange={(e) => setNewPassword(e.target.value)} value={new_password1} name="new_password1" placeholder="new_password1"/>
                    <span class="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={() => handleShowPassword('newPassword1')}>
                        <Icon icon={passwordType.newPassword1 === 'password' ? eyeOff : eye} size={15}/>
                    </span>   
                </div>
                <div className='p-2 position-relative'>
                    <input className='p-2 text-center rounded form-control' type={passwordType.newPassword2} onChange={(e) => setNewPassword2(e.target.value)} value={new_password2} name="new_password2" placeholder="new_password2"/>
                    <span class="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={() => handleShowPassword('newPassword2')}>
                        <Icon icon={passwordType.newPassword2 === 'password' ? eyeOff : eye} size={15}/>
                    </span>   
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
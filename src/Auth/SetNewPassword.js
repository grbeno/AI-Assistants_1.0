import React, {useContext, useState, useEffect} from 'react'
import AuthContext from "./AuthContext";
import {Icon} from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';


const SetNew = () => {

    const {setNew} = useContext(AuthContext);
    const [token, setToken] = useState("");
    
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    // show-hide password icon
    const [icon, setIcon] = useState(eyeOff);
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

    // set new password - auth context
    const handleSetNew = (e) => {
        e.preventDefault();
        setNew(e, (errorMessage) => {
            setError(errorMessage);
        },
        token,
        );
    };
    
    useEffect(() => {
        setToken(window.location.href.split('/').pop());
    }, [token]);

    return (
        <>
        <div className="container d-flex p-4 justify-content-center">
            <form className='auth-form' onSubmit={handleSetNew}>
            <fieldset>
                <legend>Set new Password</legend>
                <hr className='bg-light'/>
                <div className='p-2 position-relative'>
                    <input className='p-2 text-center rounded form-control' type={type} onChange={(e) => setPassword(e.target.value)} value={password} name="password" placeholder="password"/>
                        <span class="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={handleShowPassword}>
                            <Icon icon={icon} size={13}/>
                        </span>
                </div>
                <div className='d-flex p-2 pb-4 justify-content-center'>
                    <input className='p-2 px-3 bg-primary text-light border-0 rounded' type="submit" value="Send"/>
                </div>
            </fieldset>
            </form>  
        </div>
        {/* }  */}
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

export default SetNew
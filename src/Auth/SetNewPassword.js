import React, {useContext, useState, useEffect} from 'react'
import AuthContext from "./AuthContext";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'


const SetNew = () => {

    const {setNew} = useContext(AuthContext);
    // const [url_token, setUrlToken] = useState(null);
    const [token, setToken] = useState("");
    //const [email, setEmail] = useState("");
    // const [isexpired, setIsExpired] = useState(false);
    
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
        //setEmail(getEmail());
        setToken(window.location.href.split('/').pop());
    }, [token]);

    return (
        <>
        {/* {isexpired ?  // || token !== url_token
        <div className="container d-flex p-4 text-light justify-content-center">
            <h6>Password reset token is not valid.</h6>
        </div>
         :  */}
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
                    <i className="h5 sign-icon fa-solid fa-triangle-exclamation mx-2" style={{transform: "translateY(16%)"}}></i>
                    {error}
                </h6>
            </div>
        }
        </>
    );
}

export default SetNew
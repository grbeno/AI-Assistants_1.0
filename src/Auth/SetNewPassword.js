import React, {useContext, useState, useEffect} from 'react'
import AuthContext from "./AuthContext";
import {Icon} from 'react-icons-kit';
import {eye} from 'react-icons-kit/feather/eye';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';


const SetNew = () => {

    const {setnew} = useContext(AuthContext);
    const [token, setToken] = useState("");
    const [password1, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    
    // show-hide password icon
    const [icon1, setIcon1] = useState(eyeOff);
    const [icon2, setIcon2] = useState(eyeOff);
    const [type1, setType1] = useState('password');
    const [type2, setType2] = useState('password');
    const [isLoading, setIsLoading] = useState(false);
 
    const handleShowPassword1 = () => {
        if (type1 === 'password') {
            setType1('text');
            setIcon1(eye);
        } else {
            setType1('password');
            setIcon1(eyeOff);
        }
    }
        
    const handleShowPassword2 = () => {   
        if (type2 === 'password') {
            setType2('text');
            setIcon2(eye);
        } else {
            setType2('password');
            setIcon2(eyeOff);
        }
    }

    // set new password - auth context
    const handleSetNew = (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (e.target.password1.value !== e.target.password2.value) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }
        setnew(e, (errorMessage) => {
            setError(errorMessage);
            setIsLoading(false);
        },
        token,
        );
    };
    
    useEffect(() => {
        let url = window.location.href.toString()
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        //localStorage.setItem('reset_url', url);  // testing
        let rs_token = url.split('/').pop()
        //localStorage.setItem('reset_token', rs_token);  // testing
        setToken(rs_token);
    }, [token]);

    return (
        <>
        <div className="container d-flex justify-content-center">
            <form className='auth-form' onSubmit={handleSetNew}>
            <fieldset>
                <legend>Set new Password</legend>
                <p className="text-light">Username:  <b>{token}</b></p>
                <hr className='bg-light'/>
                <div className='pt-2 position-relative'>
                    <input className='p-2 text-center rounded form-control' type={type1} onChange={(e) => setPassword(e.target.value)} value={password1} name="password1" placeholder="password"/>
                        <span class="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={handleShowPassword1}>
                            <Icon icon={icon1} size={13}/>
                        </span>
                </div>
                <div className='pt-2 position-relative'>
                    <input className='p-2 text-center rounded form-control' type={type2} onChange={(e) => setPassword2(e.target.value)} value={password2} name="password2" placeholder="confirm password"/>
                        <span class="eye-icon position-absolute top-50 end-0 translate-middle-y pe-2" onClick={handleShowPassword2}>
                            <Icon icon={icon2} size={13}/>
                        </span>
                </div>
                <div className='d-flex pt-3 pb-4 justify-content-center'>
                    <input className='p-2 px-3 w-100 bg-primary text-light border-0 rounded' type="submit" value="Send"/>
                </div>
            </fieldset>
            </form>  
        </div>
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

export default SetNew
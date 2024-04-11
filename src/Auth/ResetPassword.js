import React, {useContext, useEffect, useState} from 'react'
import AuthContext from "./AuthContext"
import {Icon} from 'react-icons-kit'
import {mail} from 'react-icons-kit/feather/mail'

const Reset = () => {

    const {reset} = useContext(AuthContext);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = (e) => {
        setIsLoading(true); // spinner on
        e.preventDefault();
        reset(e,
            (errorMessage) => { setError(errorMessage); }, 
            (successMessage) => { setSuccess(successMessage); 
        });
    };

    // useEffect for error and success messages temporary display
    useEffect(() => {
        const timer = setTimeout(() => {
            setError("");
            setSuccess("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [error, success]);

    // useEffect for spinner
    useEffect(() => {
        setIsLoading(false);  // spinner off when goes to the bottom of the response list
    }, [error, success]);

    return (
        <>
        <div className="container d-flex p-4 justify-content-center">
            <form className='auth-form' onSubmit={handleReset}>
            <fieldset>
                <legend>New password
                    <span className='text-light mx-2'>
                        <Icon style={{transform: "translateY(-5%)"}} icon={mail} size={20}/>
                    </span>
                </legend>
                <hr className='bg-light'/>
                <div className='p-2'>
                    <input className='p-2 text-center rounded' type="text" name="email" placeholder="email"/>
                </div>
                <div className='d-flex p-2 pt-4 pb-4 justify-content-center'>
                    <input className='p-2 px-3 bg-primary text-light border-0 rounded' type="submit" value="Send"/>
                </div>
                <div className='d-flex pb-4 justify-content-center'>
                    <div className='d-block text-light'>
                        <hr className='bg-light'/> 
                        <p>Type your email address!</p>
                    </div>
                </div>
            </fieldset>
            </form>  
        </div>
        {isLoading ? <div className='d-flex justify-content-center'><div className='spinner'></div></div> : '' }
        {success && 
            <div className="d-flex mt-3 justify-content-center">
                <h6 className="p-4 text-light rounded">
                    <i className="sign-icon fa-solid fa-circle-check mx-3"></i>
                    {success}
                </h6>
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

export default Reset
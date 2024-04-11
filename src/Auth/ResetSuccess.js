import React from 'react'
import {Link} from 'react-router-dom'

const ResetSuccess = () => {

    return (
        <>
        <div className="container d-flex p-4 text-light justify-content-center">
            <h6>Password has been reset. Please <Link to="/login">login</Link> with the new password.</h6>
        </div>
        </>
    );
}

export default ResetSuccess
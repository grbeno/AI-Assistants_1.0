import React, {useContext, useEffect, useState} from 'react';
import '../Style/App.css';
import {Link} from 'react-router-dom';
import AuthContext from '../Auth/AuthContext';
import axiosInstance from '../axios';


const Header = () => {
    const {logout} = useContext(AuthContext)
    const jwtoken = localStorage.getItem('access_token');
    const [superuser, setSuperuser] = useState(false);

    const handleLogout = () => {
        logout();
    };

    // Check if the user is superuser
    const isSuperuser = () => {
        axiosInstance.get('accounts/is_superuser/', ).then(res => {
            setSuperuser(res.data.is_superuser);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        isSuperuser();
    }, []);

    return(
        <header>
            <nav className="navbar navbar-expand-md m-0 border-bottom shadow-sm" >
                <a className="menu-link navbar-brand mr-auto px-4 text-light" href='/'><span data-toggle="tooltip" title="home"><i className="fa-solid fa-house"></i></span></a>
                <>
                {jwtoken ? (
                    <span className="offbutton d-block h5 m-4 text-light" onClick={handleLogout}><span data-toggle="tooltip" title="logout"><i className="fa-solid fa-power-off"></i></span></span>
                ) : (
                    <div>
                        <Link to="/login"><span className="h5 text-light" data-toggle="tooltip" title="login"><i className="fa-solid fa-user mx-2"></i></span></Link>
                    </div>
                )}
                </>
                {superuser && window.BACKEND_URL==='http://localhost:8000' && <a className="d-none d-md-block h5 m-4 text-light" href="http://localhost:8000/no4uh/"><span data-toggle="tooltip" title="django-admin"><i className="top-icon fa-solid fa-id-card-clip"></i></span></a>}
            </nav>
        </header>
    )
}

export default Header
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Icon } from 'react-icons-kit';
import {wrench} from 'react-icons-kit/iconic/wrench'

const models = [
    "gpt-4o",
    "gpt-4o-mini",
];

export default function Coder() {

    // token
    var token = localStorage.getItem('access_token');
    
    // path
    const path =  window.BACKEND_URL + '/api/chat/';
    // localhost: /coder-assistant/, production: /coder-assistant
    const pathname = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) : window.location.pathname;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token && window.location.port !== '3000') {
            navigate('/login');
        }
    }, [token, navigate]);
    
    return (
        <>
        {token && (pathname === '/coder-assistant' || window.location.pathname === path) && (
            <div className="container h4 mb-5 text-light d-flex justify-content-center">
                <p className="text-center" style={{fontFamily:'monospace'}}>Coder Assistant is under development now!</p>
                <Icon className='text-secondary' size={'75%'} icon={wrench}/>
            </div>
        )}
    
        {window.location.port === '3000' && ( 
            <div className="container mb-5 text-light d-flex justify-content-center">
                <form className="col-6">
                    <div className="form-group mb-5">
                        <label htmlFor="model">Model:</label>
                        <select className="form-control" id="model">
                            {models.map((model) => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group w-100">
                        <label htmlFor="code">Code:</label>
                        <textarea className="form-control" id="code"></textarea>
                    </div>
                    <button type="submit" className="ml-1 col-12 btn btn-primary">Run</button>
                </form>
            </div>
        )}
        </>
    );
}


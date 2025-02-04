import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

const models = [
    "gpt-3.5-turbo",
    "gpt-4",
    "gpt-4-turbo",
    "gpt-4o",
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
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    if (window.location.port === '3000') {
        token = true;
    }
    
    return (
        <>
        {token && (pathname === '/coder-assistant' || window.location.pathname === path) && (
        <div className="container p-4 mb-5 text-light d-flex justify-content-center">
            <form className="col-6">
                <div className="form-group m-1 mb-5">
                    <label htmlFor="model">Model:</label>
                    <select className="form-control" id="model">
                        {models.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="code">Code:</label>
                    <textarea className="form-control" id="code"></textarea>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="mt-3 col-6 btn btn-primary">Run</button>
                </div>
            </form>
        </div>
        )}
        </>
    );
 }



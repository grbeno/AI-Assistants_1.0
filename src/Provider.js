import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './Auth/AuthContext';
import App from './App';
import Login from './Auth/Login';
import Header from './Elements/Header';
import Signup from './Auth/Signup';
import ChangePassword from './Auth/ChangePassword';
import ResetPassword from './Auth/ResetPassword';
import SetNew from './Auth/SetNewPassword';
import ResetSuccess from './Auth/ResetSuccess';
import LangAssistant from './Apps/lang-assistant';


const Provider = () => {
    return (
        <>
        <Router>
            <AuthProvider>
                <Header />
                    <Routes>
                        <Route path="/api/password_reset/confirm/email/:token" element={<SetNew />}/>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/signup" element={<Signup />}/>
                        <Route path="/change" element={<ChangePassword />}/>
                        <Route path="/reset" element={<ResetPassword />}/>
                        <Route path="/success" element={<ResetSuccess />}/>
                        <Route path="/lang-assistant" element={<LangAssistant />}/>
                        <Route path="/" element={<App />}/>
                    </Routes>
            </AuthProvider>
        </Router>
        </>
    );
};

export default Provider;
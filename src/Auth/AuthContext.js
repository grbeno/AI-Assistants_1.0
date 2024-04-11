import React, { createContext } from "react";
import axiosInstance from "../axios";
import { handleErrorMessages } from "../utils";

export const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({children}) => {

    // signup
    const signup = (e, errorCallback) => {
        e.preventDefault();
        axiosInstance.post('accounts/signup/', {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            password2: e.target.password2.value,
        })
        .then((response) => {
            console.log(response);
            window.location.href = '/login';
        })
        .catch((error) => {
            errorCallback(`[ ${error.response.data.affected_field} ] ${error.response.data.error_message}`);  // "Already existed username or bad password! Try again."
            console.log(`${error}: ${error.response.data.error_message}`);
        });
    };
    
    // login
    const login = (e, errorCallback) => {
        e.preventDefault();
        axiosInstance.post('/api/token/', {
            username: e.target.username.value,
            password: e.target.password.value 
        })
        .then((response) => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            axiosInstance.defaults.headers['Authorization'] =
                'JWT ' + localStorage.getItem('access_token');
            window.location.href = '/';
        })
        .catch((error) => {
            errorCallback("Wrong username or password! Try again.");
            console.log('Possibly wrong username or password: ' + error);
        });
    };

    // logout
    const logout = () => {
        // blacklist token
        axiosInstance.post('/api/token/blacklist/', {
            "refresh_token": localStorage.getItem('refresh_token')
        })
        .then((response) => {
            console.log(response);
            // remove tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            delete axiosInstance.defaults.headers['Authorization'];
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            window.location.href = 'login/';
        });
    };

    // change password
    const change = (e, errorCallback) => {
        e.preventDefault();
        axiosInstance.post('accounts/change_password/', {
            old_password: e.target.old_password.value,
            new_password: e.target.new_password.value,
            new_password2: e.target.new_password2.value,
        })
        .then((response) => {
            logout();
        })
        .catch((error) => {
            errorCallback(`[ ${error.response.data.affected_field} ] ${error.response.data.error_message}`);
            console.log(`${error}: ${error.response.data.error_message}`);
        });
    };

    // reset password
    const reset = (e, errorCallback, successCallback) => {
        e.preventDefault();
        axiosInstance.post('api/password_reset/', {
            email: e.target.email.value,
        })
        .then((response) => {
            successCallback('Password reset email has been sent.');
            console.log(response);
        })
        .catch((error) => {
            handleErrorMessages(error, errorCallback);
        });
    };
    
   // set new password
    const setNew = (e, errorCallback, token) => {
        e.preventDefault();
        
        axiosInstance.post('/api/password_reset/validate_token/', {
            token: token,
        })
        .then((response) => {
            console.log(response);

            // Only send the second request if the first one is successful
            return axiosInstance.post('/api/password_reset/confirm/', { 
                password: e.target.password.value,
                token: token,
            });
        })
        .then((response) => {
            console.log(response);
            window.location.href = '/success/';
        })
        .catch((error) => {
            console.log(error);
            if (error.response && error.response.data.detail){
                errorCallback('Invalid or expired token!');
            }
            else {
                handleErrorMessages(error, errorCallback);
            }
        });
    };

    /* const getEmail = () => {
        axiosInstance.get(`/api/password_reset/token_email/`, {
        })
        .then((response) => {
            console.log(response.data.email);
        })
        .catch((error) => {
            console.log(error);
        });
    }; */

    // delete user
    const deleteUser = (errorCallback, id) => {
        axiosInstance.delete(`/accounts/delete_user/${id}`, {
            id,
        })
        .then((response) => {
            console.log(response);
            window.location.href = '/login';
        })
        .catch((error) => {
            handleErrorMessages(error, errorCallback);
        });
    };

    const contextData = {signup, login, logout, change, reset, setNew, deleteUser};
      
    return (
        <>
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
        </>
    );
}

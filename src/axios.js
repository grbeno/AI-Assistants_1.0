import axios from 'axios';
import { expirationTime } from './utils';


// Export base url from env variable
const baseURL = process.env.REACT_APP_URL;

// Get csrf token
const getCSRFToken = () => {
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/);
    return csrfToken ? csrfToken[1] : null;
};

// Axios instance
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        Authorization: localStorage.getItem('access_token') ? 'JWT ' + localStorage.getItem('access_token') : null,
        'X-CSRFToken': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Remove tokens
const removeTokens = (error) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axiosInstance.defaults.headers['Authorization'];
    window.location.href = 'login/';
    return Promise.reject(error); 
};


// INTERCEPTORS

// Token flags
const tokenFlags = {
    isRefreshing: false,
    refreshFailed: false,
};

// Refresh token
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest.url === baseURL + 'api/token/refresh/') {
            console.log('prevent loop - error 401');
            window.location.href = 'login/';
            return Promise.reject(error);  // Prevent infinite loops
        }

        // undefined error occurred
        if (typeof error.response === 'undefined') {
            alert(
                'A server/network error occurred. ' + 
                'We are working on it. Hopfully, we will solve this problem as soon as possible. '
                //'After you click OK. The page will reload in 5 seconds.'
            );
            // reload after 5 seconds
            // return new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         reject(error);
            //         window.location.reload();
            //     }, 5000);
            // });
        }

        if (error.response.status === 401) {  
            
            if (expirationTime('refresh_token', false) < Date.now() / 1000) {  // refresh token expired
                console.log("Refresh token expired.");
                console.log('refresh_token_expired_@: ' + expirationTime('refresh_token'));
                removeTokens(error);
            }
            
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (refreshToken) {  // refresh token available

                if (!tokenFlags.isRefreshing && !tokenFlags.refreshFailed ) {         
                    tokenFlags.isRefreshing = true;
                    
                    console.log('Access token expired. Attempting to refresh token ...');
                    console.log('access_token_expired_@: ' + expirationTime('access_token'));
                    
                    return axiosInstance
                    .post('api/token/refresh/', { refresh: refreshToken })
                    .then((response) => {
                        
                        localStorage.setItem('access_token', response.data.access);
                        localStorage.setItem('refresh_token', response.data.refresh);  // renew refresh token - authenticated while the user is active!

                        axiosInstance.defaults.headers['Authorization'] = 
                            'JWT ' + response.data.access;
                        originalRequest.headers['Authorization'] = 
                            'JWT ' + response.data.access;

                        tokenFlags.isRefreshing = false;
                        console.log('refreshToken activated!');
                        
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        tokenFlags.refreshFailed = true;
                        console.log(err);
                    })
                    .finally (() => {
                        window.location.href = '/';  // go to here after the token is refreshed
                    });   
                }
                else {
                    console.log("Access token expired.");
                    console.log('Access_token_expired_@: ' + expirationTime('access_token'));
                }
            }
            else {
                console.log("Refresh token not available.");
            }
        } 
        else {
            console.log(error.response.status);
            return Promise.reject(error);   
        }    
});


export default axiosInstance;
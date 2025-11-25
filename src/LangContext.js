import React, { useState, useEffect, createContext } from 'react';
import axiosInstance from './axios';

export const LangContext = createContext();
export default LangContext;

export function LangData({children}) {
    // state for response
    const [response, setResponse] = useState('');
    const [openAIToken, setOpenAIToken] = useState(0);
    const [price, setPrice] = useState(0);
    // path for getting data
    const path = window.BACKEND_URL + '/api/chat/';

    // useEffect for getting data
    useEffect(() => {
        // get answer
        axiosInstance.get(path)
        .then((res) => {
            if (res && res.data) {
                const { chat, token, price } = res.data;
                setResponse(chat);
                setOpenAIToken(token);
                setPrice(price);
            }
        })  
        .catch((error) => {
            console.log('Error fetching chat data:', error);
        });
    }, [path]);

    return (
        <LangContext.Provider value={{response, setResponse, openAIToken, setOpenAIToken, price, setPrice}}>
            {children}
        </LangContext.Provider>
    );
}
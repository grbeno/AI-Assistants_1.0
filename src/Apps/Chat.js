import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { marked } from 'marked';
import '../Style/Chat.css';
import Icon from 'react-icons-kit';
import {direction} from 'react-icons-kit/entypo/direction'
import {arrows_horizontal} from 'react-icons-kit/ikons/arrows_horizontal'

const WebSocketChat = () => {
    // token
    var token = localStorage.getItem('access_token');
    const [responseMessages, setResponseMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();


    // apply markdown to response messages
    const createMarkup = (markdown) => {
        return { __html: marked(markdown) };
    };

    // Function to scroll to the bottom of the messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Initialize WebSocket connection
    useEffect(() => {
        const websocket = new WebSocket(window.WS_URL + '/ws/chat/');
        socketRef.current = websocket;

        websocket.onopen = () => {
            console.log('Connected to WebSocket');
            setConnectionStatus('Connected');
        };

        websocket.onclose = () => {
            console.log('Disconnected from WebSocket');
            setConnectionStatus('Disconnected');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('Error');
        };

        // Listen for messages
        socketRef.current.addEventListener('message', (event) => {
            const response = JSON.parse(event.data);
            setResponseMessages(prevMessages => [...prevMessages, { prompt: response.prompt, message: response.response }]);
        });

        // Cleanup on component unmount
        return () => {
            websocket.close();
        };

    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [responseMessages]);

    // Send message handler
    const sendMessage = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
            socketRef.current.send(JSON.stringify({
                prompt: inputMessage,
            }));
            setInputMessage('');
        }
    }, [inputMessage]);

    // Handle pressing Enter key in the input field
    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }, [sendMessage]);
    
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
        {token && window.location.pathname === '/ws/chat/' && (
        <div className="wrapper">
            <div className={`status ${
                connectionStatus === 'Connected' ? 'connected' : 
                connectionStatus === 'Error' ? 'error' : 'disconnected'
            }`}>
                <Icon style={{transform: "translateY(-5%)", marginRight: "1em"}} icon={arrows_horizontal} size={20}/>        
                Websocket status: {connectionStatus}
            </div>

            {window.location.port === '3000' ? (
                <div className="messages">
                    <span className="prompt">Hello!</span>
                    <span className="response">Hello! How can I assist you today?</span>
                </div>
            ) : null}
            
            {responseMessages.map((item, index) => (
                <div key={index} className="messages">
                    <div>
                        <span className="prompt">{item.prompt}</span>
                        <span className="response" dangerouslySetInnerHTML={createMarkup(item.message)}></span>
                    </div>
                </div>
            ))}
             {/* Anchor to scroll to */}
             <div ref={messagesEndRef} />

            <div className="chat-input-wrapper">
                <input
                    className="chat-input"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />
                <button
                    className="chat-button"
                    onClick={sendMessage}
                    disabled={!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN}
                >
                <Icon style={{transform: "translateY(-5%)", color: 'white'}} icon={direction} size={20}/> 
                </button>
            </div>
        </div>
    )}
    </>
    );
};

export default WebSocketChat;
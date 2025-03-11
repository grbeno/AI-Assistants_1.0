import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { marked } from 'marked';
import '../Style/Chat.css';
import Icon from 'react-icons-kit';
import {direction} from 'react-icons-kit/entypo/direction'
import {arrows_horizontal} from 'react-icons-kit/ikons/arrows_horizontal'
import {layers} from 'react-icons-kit/iconic/layers'


const models = [
    "gpt-4o-mini",
    "gpt-4o",   
];
const WebSocketChat = () => {
    // token
    var token = localStorage.getItem('access_token');
    const [responseMessages, setResponseMessages] = useState([]);
    const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
    const [inputMessage, setInputMessage] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [isLoading, setIsLoading] = useState(false);
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

    // useEffect for spinner
    useEffect(() => {
        setIsLoading(false);  // spinner off when goes to the bottom of the response list
    }, [responseMessages]);

    // Send message handler
    const sendMessage = useCallback(() => {
        setIsLoading(true);  // spinner on
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
            socketRef.current.send(JSON.stringify({
                prompt: inputMessage,
                model: selectedModel
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

    // handle gpt-model select
    const handleModelOptionChange = (event) => {
        setSelectedModel(event.target.value);
    };
    
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
                <Icon style={{marginRight: "1em", marginLeft: "1em"}} icon={arrows_horizontal} size={20}/>        
                Websocket status: {connectionStatus}
            </div>
            {selectedModel && (
                <div className="select-model">
                    <Icon style={{marginRight: "1em", marginLeft: "1em"}} icon={layers} size={20}/> 
                    Selected model: {selectedModel}
                </div>
            )}
            {window.location.port === '3000' ? (
                <div className="messages">
                    <span className="prompt">Hello!</span>
                    <span className="response" style={{paddingBottom: '0.5em'}}>Hello! How can I assist you today?</span>
                    <span class="prompt">Planets and dwarf planets in our solar system?</span>
                        <span class="response"><p>Sure! Here’s a brief overview:</p>
                        <p><strong>Planets:</strong></p>
                        <ol>
                        <li>Mercury</li>
                        <li>Venus</li>
                        <li>Earth</li>
                        <li>Mars</li>
                        <li>Jupiter</li>
                        <li>Saturn</li>
                        <li>Uranus</li>
                        <li>Neptune</li>
                        </ol>
                        <p><strong>Dwarf Planets:</strong></p>
                        <ol>
                        <li>Pluto</li>
                        <li>Eris</li>
                        <li>Haumea</li>
                        <li>Makemake</li>
                        <li>Ceres</li>
                        </ol>
                        <p>Let me know if you need more information!</p>
                    </span>
                </div>
            ) : null }
            
            {responseMessages.map((item, index) => (
                <div key={index} className="messages">
                    <div>
                        <span className="prompt">{item.prompt}</span>
                        <span className="response" dangerouslySetInnerHTML={createMarkup(item.message)}></span>
                    </div>
                </div>
            ))}

            {isLoading ? <div className='d-flex mb-5 justify-content-center'><div className='spinner'></div></div> : '' }
            {/* Anchor to scroll to */}
            <div ref={messagesEndRef} className="mb-5"/>
            <div className="chat-input-wrapper">
                <select className="bg-dark text-light mb-4 p-1 col-sm-3" aria-label="size 3 select example" value={selectedModel} onChange={handleModelOptionChange}>
                    {models.map((model, index) => (
                        <option key={index} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
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
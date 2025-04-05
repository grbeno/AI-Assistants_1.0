import { useNavigate } from 'react-router-dom';
import React, {useEffect, useState, useRef, useContext} from 'react';
import {expirationTime, convertTimestampToDate} from '../utils';
import axiosInstance from '../axios';
import '../Style/Lang.css';
import { LangContext } from '../LangContext';


// options for select - prompt modes
const options = [
    "Correct grammatical errors",
    "Correct as if it was written by a native speaker",
    "Translate to English",
    "Translate to Hungarian", 
    "Translate to German",
    "Translate to Latin",
];

const models = [
    "gpt-4o-mini",
    "gpt-4o",   
];

function Chat() {

    // token and user
    var token = localStorage.getItem('access_token'); 
    const {response, setResponse } = useContext(LangContext);
    const [formData, setFormData] = useState({ prompt: '', });
    const [selectedOption, setSelectedOption] = useState('Correct grammatical errors');
    const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');  // default
    const [isLoading, setIsLoading] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const expirationTimeRefAccess = useRef(expirationTime('access_token'));
    const expirationTimeRefRefresh = useRef(expirationTime('refresh_token'));

    // path
    const path =  window.BACKEND_URL + '/api/chat/';
    // localhost: /lang-assistant/, production: /lang-assistant
    const pathname = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) : window.location.pathname;
    const navigate = useNavigate();

    /* const scrollDownBy100px = () => {
        window.scrollBy({ top: 600, behavior: 'smooth' });
    }; */

    const postPrompt = (e) => {
        setIsLoading(true);  // spinner on
        e.preventDefault();
        axiosInstance.post(path, {
            mode: selectedOption,
            model: selectedModel,
            prompt: formData.prompt,
            answer: formData.answer
        })
        .then((res) => {
            setFormData({ prompt: '', });
            console.log('Selected option: ' + selectedOption);
            setSelectedOption('Correct grammatical errors');
            setResponse((response) => [...response, res.data]);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const deleteItem = (id) => {
        axiosInstance.delete(path + id + '/')
        .then((res) => {
            // get answer
            axiosInstance.get(path)
            .then((res) => {
                const { chat } = res.data;
                setResponse(chat);
            })  
            .catch((error) => {
                console.log(error);
            });  
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // useEffect for tokens
    useEffect(() => {
        console.log(expirationTimeRefAccess);
        console.log(expirationTimeRefRefresh);
    } , [expirationTimeRefAccess, expirationTimeRefRefresh]);

    // useEffect for spinner
    useEffect(() => {
        setIsLoading(false);  // spinner off when goes to the bottom of the response list
    }, [response]);

    useEffect(() => {
        // Trigger the fade-in effect when the component mounts
        setFadeIn(true);
      }, []);

    // handle input
    const handleInput = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    // handle gpt-model select
    const handleModelOptionChange = (event) => {
        setSelectedModel(event.target.value);
    };

    // handle mode select
    const handleOptionChange = (event) => {
         setSelectedOption(event.target.value);
    };

    // copy text with a mouse click
    const copyText = (event) => { 
        navigator.clipboard.writeText(event.target.textContent);
        setTimeout(() => {
            event.target.style.backgroundColor = '#1e383d';
        }, 200);
        event.target.style.backgroundColor = '#17592f';
    };
    
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // useEffect(() => {
    //     scrollDownBy100px();
    // }, [response]);

    if (window.location.port === '3000') {
        token = true;
    }

    return (
        <>
        {token && (pathname === '/lang-assistant' || window.location.pathname === path) && (
        <div className="container mb-5 text-light">
            <div className="d-flex justify-content-center">
                <div className="circle"><i class="fa-solid fa-robot fa-2x" ></i></div>
            </div>
            <div className="d-flex m-4 justify-content-center"><h3 className="text-light">Language Assistant</h3></div>
            <hr className='p-1 mb-5 bg-secondary'/>
            
            {/* 0. Description */}
            <div className={`fade-in-box ${fadeIn ? 'fade-in' : ''}`}>
                This chat-GPT-based language assistant is a tool that helps you write in a foreign language.
                From translation to text correction, this tool helps people in languages such as English, German, Hungarian, and Latin.
                My goal with the language assistant is to create a basic self-learning tool and evolve as the models develop.
            </div>

            {/* 1. Form */}
            {/* 1.1 Select GPT model */}
            <form className="p-md-2 mb-4 mt-4 justify-content-center" onSubmit={postPrompt}>
            <span className='mx-2 text-light'>Select gpt model</span>
                <select className="form-select mb-4 w-100" aria-label="size 3 select example" value={selectedModel} onChange={handleModelOptionChange}>
                    {models.map((model, index) => (
                        <option key={index} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
                {/* 1.2 Select lang-assistant mode */}
                <span className='mx-2 text-light'>Select assistant mode</span>
                <select className="form-select mb-4 w-100" aria-label="size 3 select example" value={selectedOption} onChange={handleOptionChange}>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                {/* <div className={`fade-in-box ${fadeIn ? 'fade-in' : ''} ml-1 ml-sm-2 mb-4 w-100`}> */}
                    {selectedModel && (
                        <p className='select-status'><b>Selected model:</b> <span style={{color: '#73ef8f'}}>[ {selectedModel} ]</span></p>
                    )}
                    {selectedOption && (
                        <p className='select-status'><b>Selected mode:</b> <span style={{color: '#73ef8f'}}> [ {selectedOption} ]</span></p>
                    )}
                    <p className='select-status mb-4' style={{background: '#7b781c'}}>Please consider the mode when formulating the prompt.</p>
                {/* </div> */}
                <span className='text-light mx-2'>Add Prompt</span>
                <textarea className="form-control" type="text" value={formData.prompt} name="prompt" onChange={handleInput}/>
                <div className='d-flex justify-content-center'>
                    <button className="send d-block mt-4 col-4 float-right btn btn-primary" type="submit" data-toggle="tooltip" title="Send" disabled={!formData.prompt}><i className="chat-icon fa-solid mx-3 fa-paper-plane"></i><b></b></button>    
                </div>
            </form>
            <br />

            {/* 2. Answer box */}

            {isLoading ? <div className='d-flex mb-5 justify-content-center'><div className='spinner'></div></div> : '' }        
            {response && response.slice().reverse().map(item => (
                <>
                <div id={item.id} className="p-md-2 mb-4 justify-content-center" style={{backgroundColor:'#17592f', border: '3px solid rgba(0, 0, 0, 0.05)', borderRadius: '10px', margin: '1% 0% 2% 1.5%' }}>
                    {/* 2.1 Header of Answer box */}
                    <div className='pb-3 pb-md-0 text-dark' style={{padding: '0.5%', backgroundColor: '#8ac29f', borderRadius: '8px'}} >
                        <i data-toggle="tooltip" title="Delete" className="delete cursor-like fa-solid fa-trash fa-lg mt-4 mb-4 mx-3 float-right text-dark" onClick={() => deleteItem(item.id)} style={{transform: "translateY(500%)"}}></i>
                        <div className='d-sm-flex pt-3 px-2 mx-2 justify-content-between'>
                            <p key={item.id}><span className="text-dark"><b>{item.mode}</b></span></p>
                            <span className='p-1 px-3 mb-3 text-warning' style={{backgroundColor: '#414523', borderRadius: '0.25rem', fontFamily: 'monospace', fontSize: '14px'}}>
                                {convertTimestampToDate(item.timestamp,'iso')}
                            </span>
                        </div>
                    </div>
                    {/* 2.2 Body of Answer box */}
                    <div className='pt-3'>
                        <b className='px-2 mx-2' style={{color: '#73ef8f'}}>[ prompt ]</b>
                        <p className='p-2 m-2'> <b> {item.prompt} </b></p>
                        <b className='px-2 mx-2' style={{color: '#73ef8f'}}>[ response ]</b>
                        <p className='answer p-2 m-2' data-toggle="tooltip" title="Copy text with a click" 
                        onClick={copyText}
                        onMouseEnter={(event) => {event.target.style.backgroundColor = '#1e383d';}}
                        onMouseLeave={(event) => {event.target.style.backgroundColor = 'transparent';}}
                        >
                            {item.answer}
                        </p>
                        <div className='pb-2'></div>
                        <hr style={{padding: '0.15%', backgroundColor: '#8ac29f'}}/>
                    </div>
                </div>
                <br />
                </>   
            ))}
        </div>
        )}
        </>
    );
}

export default Chat;

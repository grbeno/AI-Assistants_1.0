const token = localStorage.getItem('access_token');

const LangAssistant = () => {
  return (
        <>
        {token && window.location.pathname !== '/' &&
            <div className="d-flex mt-4 justify-content-center">
                <h4 className="p-5 text-center text-light">Hello, I am your language assistant.</h4>
            </div>
        }
        </>    
    );
}

export default LangAssistant;
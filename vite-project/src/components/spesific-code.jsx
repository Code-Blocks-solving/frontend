import { useEffect, useState, useRef  } from 'react'
import codeService from "../services/code-block-service"
import CodeBlock from './code-block'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const socket = io('http://localhost:3000');
export let PostIdEdit;

function SpesificCode() {

    const [message, setMessage] = useState('');

    const CodeIdDetails = useParams().id;
    const [isFirstClient, setIsFirstClient] = useState(false);
    //const [code, setCode] = useState({})
    const [code, setCode] = useState({
        title: '',
        code: '',
        _id: ''
    });
    const [editableCode, setEditableCode] = useState(code.code);
    const [error] = useState()

    useEffect(() => {
        socket.on('firstClientId', (id) => {
            // Check if this client is the first client
            setIsFirstClient(socket.id === id);
        });
        
        return () => {
            socket.off('firstClientId');
        };
    }, []);
    

    useEffect(() => {
        setEditableCode(code.code);
    }, [code.code]);

    useEffect(() => {
        const abortController = new AbortController();
         const fetchData = async () => { 
             try {
                 const { req, abort } = await codeService.getCodeByID(CodeIdDetails)
                 abortController.abort = abort;
                 const res = await req;
                 console.log(res.data);
                 if (res) {
                    const code = res.data;
                    if (code) {
                        const Code = {
                            title: code.title,
                            code: code.code,
                            _id: code._id
                        };
                        setCode(Code)
                        console.log("Code", code);
                        
                    }
                 }
             } catch (err) {
                 console.log(err);
                 //if (err instanceof CanceledError) return;
                 //setError(err.message);
             }
         };
         fetchData();
         return () => {
            abortController.abort();
         }
     
     }, [])

     useEffect(() => {
        socket.on('codeUpdate', (updatedCode) => {
            if (updatedCode._id === code._id) {
                setCode(updatedCode);
            }
        });
        return () => {
            socket.off('codeUpdate');
        };
    }, [code]);

    // const handleCodeChange = (e) => {
    //     const newCode = e.target.value;
    //     setEditableCode(newCode);
    //     socket.emit('codeUpdate', { id: code._id, code: newCode });
    // };

    function handleCodeChange1(value) {
        setEditableCode(value);
        socket.emit('codeUpdate', { id: code._id, code: value });
    }

        return (
            <>
                <h1 className="text-center" style={{ fontWeight: 'bold', color: 'brown' }}>Code Block:</h1>
                <div>
                    {error && <p className='text-danger'>{error}</p>}
                </div>

            <div className="p-4">
            { code &&(
         <div key={code._id}>
           <div style={{
    border: '1px solid #000',
    borderRadius: '5px',
    padding: '20px',
    margin: '10px',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
}}>
    <h1 >Title: {code.title}</h1>
    {/* <textarea 
    style={{ width: '100%', margin: '0' }} 
    value={editableCode} 
    onChange={handleCodeChange}
    disabled={isFirstClient}
/> */}
<div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f8f8',
    paddingTop: '10px' 
}}>
    <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f8f8',
    paddingTop: '50px'
}}>
    <AceEditor
        mode="javascript"
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={editableCode}
        onChange={(newValue) => {
            handleCodeChange1(newValue);
            if (newValue.trim() === code.result.trim()) {
                setMessage('Good job! 😊');
            } else {
                setMessage('');
            }
        }}
        readOnly={isFirstClient}
        style={{
            width: '600px',
            height: '300px',
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}
    />
 {isFirstClient && <div style={{
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.5em',
    color: 'red',
    textAlign: 'center',
    border: '2px solid red',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: 'white'
}}>You cant edit this code.</div>}
{message && <div style={{
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '2em',
    color: 'green',
    textAlign: 'center',
    border: '2px solid green',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: 'white'
}}>{message}</div>}
</div>


</div>


    {/* <button onClick={() => handleCodeChange(code._id, editableCode)}>Save Changes</button> */}
</div>
          
    </div>
)}
            </div>
          
           </>
        )
        
}

export default SpesificCode
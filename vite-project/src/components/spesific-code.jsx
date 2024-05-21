import { useEffect, useState } from 'react'
import codeService from "../services/code-block-service"

import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

import AceEditor from "react-ace";
import axios from 'axios';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const socket = io('http://localhost:3000');

function SpesificCode() {
    const [message, setMessage] = useState('');

    const CodeIdDetails = useParams().id;
    const [isFirstClient, setIsFirstClient] = useState(false);
    const [code, setCode] = useState({
        title: '',
        code: '',
        _id: ''
    });
    const [editableCode, setEditableCode] = useState(code.code);
    const [error] = useState();

    useEffect(() => {
        socket.on('firstClientId', (id) => {  

        });
        
        return () => {
            socket.off('firstClientId');
        };
    }, [socket,isFirstClient]);
     
    useEffect(() => {
        const checkFirstClient = async () => {
          const res = await axios.get('http://localhost:3000/firstClientCheck');
          setIsFirstClient(res.data.isFirstClient);
        };
    
        checkFirstClient();
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

  
    function handleCodeChange(value) {
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
    
    { (
    <AceEditor
        mode="javascript"
        theme="monokai"
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={editableCode}
        readOnly={isFirstClient }
        onChange={(newValue) => {
            if (!isFirstClient) {
                handleCodeChange(newValue);
            }
            if (newValue.trim() === code.result.trim()) {
                setMessage('Good job! 😊');
            } else {
                setMessage('');
            }
        }}
        style={{
            width: '600px',
            height: '300px',
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}
    />

)}
 {isFirstClient&& <div style={{
    position: 'absolute',
    top: '75%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.5em',
    color: 'red',
    textAlign: 'center',
    border: '2px solid red',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: 'white'
}}>Mentors cant edit this code.</div>}
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

</div>
          
    </div>
)}
            </div>
          
           </>
        )    
}
export default SpesificCode





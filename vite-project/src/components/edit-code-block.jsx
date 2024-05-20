import React, { useEffect, useState } from 'react'
import CodeBlock from './code-block'
import codeService from "../services/code-block-service"
import { useNavigate } from 'react-router-dom';

export let CodeIdDetails;

function EditCodeBlock() {
    const [codes, setCodes] = useState([])
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const { req, abort } = codeService.getAllBlocks()
        req.then((res) => {
            setCodes(res.data)
        }).catch((err) => {
            console.log(err)
            if (err.name === 'CanceledError') return
            setError(err.message)
        })
        return () => {
            abort()
        }
    }, [])

    const handleEdit = (id) => {
        CodeIdDetails = id;
        navigate(`/code/${CodeIdDetails}` );
    };

    return (
        <>
       <h1 style={{ color: 'red', textDecoration: 'underline' }}>CODE BLOCKS</h1>
        {error && <p className='text-danger'>{error}</p>}
        {codes.map((codeBlock, index) =>
    <div 
        style={{
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '10px', 
            marginBottom: '10px', 
            backgroundColor: '#f9f9f9'
        }} 
        key={index}
    >
        <CodeBlock codeBlock={codeBlock} />
        <button onClick={() => handleEdit(codeBlock._id)} className="btn" style={{ backgroundColor: 'brown', color: 'white' }}>Edit Code</button>
    </div>
)}

        </>
    )
}

export default EditCodeBlock
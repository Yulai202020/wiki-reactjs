import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Cookies from 'js-cookie';

function Add() {
    const [label, setLabel] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [text, setText] = useState<string>("");
    const server_path = localStorage.getItem('server_path');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await fetch(server_path + '/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ subject, text }),
            });
        
            if (response.status === 403) {
                Cookies.remove("token");
                navigate('/login');
            }
        
            const result = await response.json();
            navigate("/");
        } catch (error) {
          console.error('Fetch error:', error);
        }
    };

    return (
        <>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                <h3 className="text-center mb-4">Make post.</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label htmlFor="subject" className="form-label">subject</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Enter subject"
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="post" className="form-label">Text (body of post)</label>
                        <textarea className="form-control" id="post" onChange={(e) => setText(e.target.value)}></textarea>
                    </div>

                    {label && (
                        <div className="mb-3">
                            <label style={{ color: 'red' }}>{label}</label>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>

                <div className="mt-3 text-center">
                    <a href="/register">Register</a>
                </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Add;
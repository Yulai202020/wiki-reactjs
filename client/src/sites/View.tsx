import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./view.css"

function View() {
    const { id } = useParams(); // id of post

    const [BackendData, setBackendData] = useState<any>(null);
    const server_path = localStorage.getItem('server_path');

    useEffect(() => {
        fetch(server_path + '/api/post/' + id)
        .then((res) => {
            if (res.status === 404) {
                return null;
            } else {
                return res.json();
            }
        })
        .then((data) => {
            setBackendData(data);
            console.log(data);
        });
    }, []);

    return (
        <>
        {BackendData !== null ? (
            <div className="card">
                <div className="card-body">
                    <div className="card-header">
                        <div className="profile-pic"></div>
                        <div className="card-author-info">
                            <h5 className="card-author">{BackendData["username"]}</h5>
                        </div>
                    </div>
                    <h5 className="card-title">{BackendData["subject"]}</h5>
                    <p className="card-text" dangerouslySetInnerHTML={{ __html: BackendData["text"].replace(/\n/g, '<br />') }} />
                    <a href="/" className="card-link">Back to Home</a>
                </div>
            </div>
        ) : (
            <div className="view-container">
                <p>Post with index {id} not found.</p>
            </div>
        )}
        </>
    );
}

export default View;
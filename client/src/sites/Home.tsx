import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

// Define the type for the expected data structure
function Home() {
    const [backendData, setBackendData] = useState<any[]>([]);
    const serverPath = localStorage.getItem('server_path');

    useEffect(() => {
        if (serverPath) {
            fetch(`${serverPath}/api/posts`)
                .then((res) => {
                    if (res.status === 403) {
                        // Handle forbidden access or invalid credentials
                        return [];
                    }
                    if (!res.ok) {
                        // Handle other possible HTTP errors
                        throw new Error('Network response was not ok.');
                    }
                    return res.json();
                })
                .then((data) => {
                    setBackendData(data);
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    // Handle fetch errors (e.g., network issues)
                });
        } else {
            console.error('Server path not found in localStorage.');
        }
    }, [serverPath]);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-10">
                    <div className="list-group">
                        {backendData.length > 0 ? (
                            backendData.map((item, index) => (
                                <a href={`/view/${item["id"]}`} className="list-group-item list-group-item-action">{item["subject"]}</a>
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                    
                    {Cookies.get("token") !== undefined ? (
                        <>
                            <div className="mt-3 text-center">
                                <a href="/logout">Logout</a>
                            </div>
                            <div className="mt-3 text-center">
                                <a href="/add">Add</a>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Home;

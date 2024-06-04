// src/components/UpdatePage.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const UpdatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const controller = useRef(null);

    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            controller.current = new AbortController();

            try {
                const response = await axios.get(`${API_URL}/${id}`, {
                    signal: controller.current.signal,
                });
                setItem(response.data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                } else {
                    console.error('Error fetching data', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItem();

        return () => {
            if (controller.current) {
                controller.current.abort();
            }
        };
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`${API_URL}/${id}`, item);
            navigate('/')
        } catch (error) {
            console.error('Error updating data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !item) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Update Item</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={item.title}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
                        Body
                    </label>
                    <textarea
                        id="body"
                        name="body"
                        value={item.body}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Update
                    </button>
                    <Link to={'/'}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default UpdatePage;

// src/components/DataTable.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example public API

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const controller = useRef(null);

  useEffect(() => {
    fetchData();

    return () => {
      if (controller.current) {
        controller.current.abort();
      }
    };
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    controller.current = new AbortController();

    try {
      const response = await axios.get(`${API_URL}?_page=${page}&_limit=5`, {
        signal: controller.current.signal,
      });
      setData(response.data);
      const totalItems = response.headers['x-total-count'];
      setTotalPages(Math.ceil(totalItems / 5));
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

  const createData = async (newItem) => {
    try {
      const response = await axios.post(API_URL, newItem);
      setData([response.data, ...data]);
    } catch (error) {
      console.error('Error creating data', error);
    }
  };

  const updateData = async (id, updatedItem) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedItem);
      setData(data.map((item) => (item.id === id ? response.data : item)));
    } catch (error) {
      console.error('Error updating data', error);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Table with CRUD and Pagination</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Body</th>

          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.id}</td>
              <td className="py-2 px-4 border-b">{item.title}</td>
              <td className="py-2 px-4 border-b">{item.body}</td>
              <td className="py-2 px-4 border-b">
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="text-center mt-4">Loading...</div>}
      <div className="flex justify-center mt-4">
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <button
            key={pageNumber + 1}
            className={`py-2 px-4 rounded ${page === pageNumber + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => handlePageChange(pageNumber + 1)}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded ml-2"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;

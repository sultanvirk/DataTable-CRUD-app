// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataTable from './components/DataTable';
import UpdatePage from './components/UpdatePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataTable />} />
        <Route path="/update/:id" element={<UpdatePage />} />
      </Routes>
    </Router>
  );
};

export default App;

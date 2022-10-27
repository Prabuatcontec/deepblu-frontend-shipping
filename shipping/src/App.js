import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Shipping from './components/Shipping/Shipping';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';

function App() {
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/" element={<Login />} />
              
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
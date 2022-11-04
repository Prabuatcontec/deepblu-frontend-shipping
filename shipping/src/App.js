import React , {useState} from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Shipping from './components/Shipping/Shipping';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('token') !== null
  );
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard/> : <Navigate to='/'/>} />
          <Route path="/shipping" element={isLoggedIn ? <Shipping/> : <Navigate to='/'/>} />
          <Route path="/" element={!isLoggedIn ? <Login/> : <Navigate to='/shipping'/>}/>
              
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
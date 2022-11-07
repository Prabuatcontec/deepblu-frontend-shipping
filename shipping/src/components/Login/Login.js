import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';


export default function Login() {
  const [value, setValue] = useState('');
  const onChange = (event) => {
    setValue(event.target.value);
  };
  let navigate = useNavigate();
  const [values, setValues] = useState({
    _username: '', _password: ''
  });
  const login = async () => {
    
    const response = await fetch('https://deepbluapi.gocontec.com/login_check', {
      method: 'POST',
      body: new URLSearchParams(values),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
    if (response.status !== 200) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const token = await response.json();
    localStorage.setItem('token', token['token'])
    navigate('/shipping') 
  }
  const set = name => {
    return ({ target: { value } }) => {
      setValues(oldValues => ({ ...oldValues, [name]: value }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default submission
    try {
      await login();
      setValues({
        _username: '', _password: ''
      });
    } catch (e) {
      alert(`Login failed! ${e.message}`);
    }
  }

  return (
    <div class="login">
      <form onSubmit={onSubmit}>
        <div><h2>Login</h2></div>
        <label>
          <p>Username</p>
          <input required type="text" value={values._username} onChange={set('_username')} />
        </label>
        <label>
          <p>Password</p>
          <input required type="password" value={values._password} onChange={set('_password')} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export default function Login() {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { request } = useHttp();

  const login = async e => {
    e.preventDefault();

    const formData = {
      email,
      password
    }

    const data = await request('/login', 'POST', formData);
    auth.login(data.token, data.userId);

    const lastProjectId = localStorage.getItem('lastProjectId');
    
    if (data.projects.includes(lastProjectId)) {
      window.location.href = `/project/${lastProjectId}/home`;
    } else {
      window.location.href = `/project/${data.projects[0]}/home`;
    }
  };

  return (
    <form action="/login" method="post">
      <h1>Вход</h1>

      <div>
        <label>E-mail</label>
        <input onChange={e => setEmail(e.target.value)} placeholder="e-mail" name="email" />
      </div>

      <div>
        <label>Password</label>
        <input onChange={e => setPassword(e.target.value)} placeholder="password" name="password" />
      </div>

      <button type="submit" onClick={login}>Войти</button>
      
      <Link to="/register">Ещё не зарегистрированы? На регистрацию</Link>
    </form>
  );
}
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';

export default () => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: null,
    email: null,
    phone: null,
    password: null,
    project: null
  });
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const { request } = useHttp();
  const registerUser = async e => {
    e.preventDefault();

    try {
      const dataRegister = await request('/register', 'POST', formData);
      const dataLogin = await request('/login', 'POST', formData);

      auth.login(dataLogin.token, dataLogin.userId);
      localStorage.setItem('lastProjectId', formData.project);
      window.location.href = `/project/${formData.project}/home`;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1>Регистрация</h1>

      <div>
        <label>Name</label>
        <input
          onChange={e => {
            const value = e.target.value;
            setFormData(prev => ({...prev, username: value}));
          }
          }
          placeholder="Username"
          name="username"
        />
      </div>

      <div>
        <label>E-mail</label>
        <input
          onChange={e => {
            const value = e.target.value;
            setFormData(prev => ({...prev, email: value}));
          }
          }
          placeholder="e-mail"
          name="email"
        />
      </div>

      <div>
        <label>Password</label>
        <input
            onChange={e => {
              const value = e.target.value;
              setFormData(prev => ({...prev, password: value}));
            }
            }
            placeholder="password"
            name="password"
          />
      </div>

      <div>
        <label>Phone</label>
        <input
          onChange={e => {
            const value = e.target.value;
            setFormData(prev => ({...prev, phone: value}))
          }
          }
          placeholder="Phone"
          name="phone"
        />
      </div>

      <div>
        <label>Project name</label>
        <input
          onChange={e => {
            const value = e.target.value;
            setFormData(prev => ({...prev, project: value}))
          }
          }
          placeholder="Project name"
          name="project"
          type="number"
        />
      </div>

      <button onClick={registerUser}>Зарегистрироваться</button>

      <Link to="/login">Уже зарегистрированы? На вход</Link>
    </div>
  );
}
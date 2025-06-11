import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/user/login', {
        email,
        password,
      });

      alert('로그인 성공!');
      console.log('로그인 성공 응답:', response.data);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('email', response.data.email);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인 중 오류 발생');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}
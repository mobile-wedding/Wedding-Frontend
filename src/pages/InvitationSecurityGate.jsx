import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function InvitationSecurityGate() {
  const { invitationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const securityCode = location.state?.security_code; // ✅ 전달된 보안코드

  const handleSubmit = async () => {
    try {
      await axios.get(`http://localhost:8000/api/invitation/verify/${invitationId}/${code}`);
      localStorage.setItem(`verified_${invitationId}`, code);
      navigate(`/invitation/preview/${invitationId}`);
    } catch (err) {
      setError('보안코드가 올바르지 않습니다.');
    }
  };

  // ✅ 전달된 보안코드가 있으면 먼저 보여줌
  if (securityCode) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>청첩장이 생성되었습니다 🎉</h2>
        <p>아래 보안코드를 복사해서 하객에게 전달해주세요.</p>
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: '#f0f0f0',
            padding: '1rem',
            borderRadius: '8px',
            display: 'inline-block',
            marginBottom: '1rem',
          }}
        >
          {securityCode}
        </div>
        <br />
        <button
          onClick={() => navigate(`/invitation/${invitationId}`)}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          초대장 미리보기
        </button>
      </div>
    );
  }

  // 🔒 보안코드 입력 모드
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>보안코드를 입력해주세요</h2>
      <input
        type="text"
        maxLength="6"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem', width: '150px', textAlign: 'center' }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        확인
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
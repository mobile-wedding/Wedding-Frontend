import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiLock, FiCheckCircle } from 'react-icons/fi';           // 아이콘
import './InvitationSecurityGate.css';

export default function InvitationSecurityGate() {
  const { invitationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  /* ───────── 보안코드 생성 직후 화면 ───────── */
  const securityCode = location.state?.security_code;
  if (securityCode) {
    return (
      <div className="gate-root">
        <section className="gate-card success">
          <FiCheckCircle size={48} className="icon" />
          <h2>청첩장이 생성되었어요!</h2>
          <p>아래 보안코드를 복사해서 하객에게 전달해 주세요.</p>

          <div className="code-box">{securityCode}</div>

          <button
            className="btn primary"
            onClick={() => navigate(`/invitation/${invitationId}`)}
          >
            초대장 미리보기
          </button>
        </section>
      </div>
    );
  }

  /* ───────── 보안코드 입력 화면 ───────── */
  const handleSubmit = async () => {
    try {
      await axios.get(
        `http://localhost:8000/api/invitation/verify/${invitationId}/${code}`
      );
      localStorage.setItem(`verified_${invitationId}`, code);
      navigate(`/invitation/preview/${invitationId}`);
    } catch {
      setError('보안코드가 올바르지 않습니다.');
    }
  };

  return (
    <div className="gate-root">
      <section className={`gate-card ${error && 'shake'}`}>
        <FiLock size={44} className="icon" />
        <h2>보안코드를 입력해 주세요</h2>

        <input
          type="text"
          maxLength="6"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="6자리"
          className="code-input"
        />

        <button className="btn primary" onClick={handleSubmit}>
          확인
        </button>

        {error && <p className="err">{error}</p>}
      </section>
    </div>
  );
}
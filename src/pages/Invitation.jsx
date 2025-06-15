// src/pages/CreateInvitation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './invitation.css';
import axios from 'axios';

export default function CreateInvitation() {
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handlePreview = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      // 1. invitation 먼저 생성
      const res = await axios.post(`http://localhost:8000/api/invitation/${userId}`, {
        groom_name: groomName,
        bride_name: brideName,
        wedding_date: new Date(date).toISOString(),
        location: location,
        message: '',
      });

      const invitationId = res.data.id;
      const securityCode = res.data.security_code; // ✅ 보안코드 추출
      alert(`이 보안 코드는 복사해주세요:)\n초대장 보안코드: ${securityCode}`);     // ✅ 사용자에게 보여주기
  
      // 2. 사진 업로드
      const formData = new FormData();
      formData.append('invitation_id', invitationId);
      photos.forEach(file => formData.append('files', file));
  
      await axios.post('http://localhost:8000/api/photo/photo/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      // 3. 스타일 태깅
      await axios.post(`http://localhost:8000/api/photo/classify/${invitationId}`);
  
      // 4. 사진 레이아웃 배치
      await axios.post(`http://localhost:8000/api/photo/photo/layout/${invitationId}`);
  
      // 5. 청첩장 결과 보기 화면으로 이동
      navigate(`/invitation/preview/${invitationId}`);
  
    } catch (err) {
      console.error(err);
      alert('청첩장 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="create-invitation-wrapper">
      <div className="create-invitation-container">
        <h2>청첩장 만들기</h2>

        <div className="form-group">
          <label>신랑 이름</label>
          <input value={groomName} onChange={(e) => setGroomName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>신부 이름</label>
          <input value={brideName} onChange={(e) => setBrideName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>결혼 날짜</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>예식 장소</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="form-group">
          <label>사진 업로드</label>
          <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
        </div>

        <div className="button-group">
          <button className="preview-btn" onClick={handlePreview}>만들기</button>
          <button className="cancel-btn" onClick={() => navigate('/')}>취소</button>
        </div>
      </div>
    </div>
  );
}
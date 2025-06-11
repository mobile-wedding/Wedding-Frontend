// src/pages/CreateInvitation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './invitation.css';

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

  const handlePreview = () => {
    navigate('/invitation/preview', {
      state: {
        groomName,
        brideName,
        date,
        location,
        photos: photos.map(file => URL.createObjectURL(file))
      }
    });
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
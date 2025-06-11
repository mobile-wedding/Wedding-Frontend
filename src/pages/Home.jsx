import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleViewSample = (cardId) => {
    navigate(`/invitation/${cardId}`);
  };

  const handleCreateInvitation = () => {
    navigate('/invitation');
  };

  const cardList = [
    { id: 'card1', image: '/cards/card1.png' },
    { id: 'card2', image: '/cards/card2.png' },
    { id: 'card3', image: '/cards/card3.png' },
  ];

  return (
    <div className="home-container">
      {/* 헤더 */}
      <header className="header">
        <h1 className="logo">Girit</h1>
        <nav className="nav-links">
          <a href="/login">로그인</a>
          <a href="/signup" className="join">회원가입</a>
        </nav>
      </header>

      {/* 소개 */}
      <p className="slogan">소중한 날을, 더 특별하게.</p>
      <p className="desc">예쁜 청첩장, 링크 하나면 충분해요.</p>

      {/* 카드 영역 */}
      <div className="card-wrapper">
        {cardList.map((card) => (
          <div key={card.id} className="card-item">
            <img
              src={card.image}
              alt={card.id}
              className="card-image"
            />
            <div className="card-buttons">
              <button onClick={() => handleViewSample(card.id)} className="sample-btn">
                샘플 보기
              </button>
              <button onClick={handleCreateInvitation} className="create-btn">
                청첩장 만들기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
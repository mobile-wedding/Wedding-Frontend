import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      {/* 상단 헤더 */}
      <header className="header">
        <h1 className="logo">Girit</h1>
        <nav className="nav-links">
          <a href="#">모바일 청첩장</a>
          <a href="/login">로그인</a>
          <a href="/signup" className="join">회원가입</a>
        </nav>
      </header>

      {/* 소개 문구 */}
      <p className="slogan">소중한 날을, 더 특별하게.</p>
      <p className="desc">예쁜 청첩장, 링크 하나면 충분해요.</p>

      {/* 카드 3장 */}
      <div className="card-wrapper">
        <img src="/cards/card1.png" alt="card1" />
        <img src="/cards/card2.png" alt="card2" />
        <img src="/cards/card3.png" alt="card3" />
      </div>
    </div>
  );
}
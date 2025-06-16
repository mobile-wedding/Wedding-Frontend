import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const nav = useNavigate();
  const isLogin = !!localStorage.getItem('user_id');

  const cardList = [
    { id: 'card1', image: '/cards/card1.png', label: '클래식 로즈' },
    { id: 'card2', image: '/cards/card2.png', label: '모던 화이트' },
    { id: 'card3', image: '/cards/card3.png', label: '빈티지 필름' },
  ];

  return (
    <>
      {/* 헤더 ------------------------------------------------ */}
      <header className="topbar">
        <h1 className="logo" onClick={() => nav('/')}>Girit</h1>
        <nav className="nav">
          {isLogin ? (
            <>
              <span className="user">{localStorage.getItem('email')}</span>
              <button className="btn ghost" onClick={() => { localStorage.clear(); nav('/'); }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <a className="link" href="/login">로그인</a>
              <a className="btn primary sm" href="/signup">회원가입</a>
            </>
          )}
        </nav>
      </header>

      {/* Hero ------------------------------------------------ */}
      <section className="hero-full">
        <div className="phones">
          <img src="/cards/phone-left.png"  alt="left-mock"  className="phone left"  />
          <img src="/cards/phone-right.png" alt="right-mock" className="phone right" />
        </div>

        <div className="hero-text">
          <h2 className="headline">
            사진만 넣어보세요!<br />
            AI가 사진을 자동 분류해주고<br />
            자동 배치해줘요!
          </h2>

          <p className="subline">
            일생에 가장 아름다운 날,
            <br className="br-md" />
            Girit에서 모바일 청첩장을 만들어 보세요!
          </p>

          <div className="cta-row">
            <button className="btn primary lg" onClick={() => nav('/invitation')}>
              🛠 지금 바로 제작하기
            </button>
            <button className="btn ghost lg" onClick={() => nav('/invitation/card1')}>
              🔗 샘플링크 보기
            </button>
          </div>

          <p className="caption">5분 만에 최고의 청첩장을 만나보실 수 있습니다.</p>
        </div>
      </section>

      {/* 스크롤 인디케이터 */}
      <div className="scroll-indicator" />

      {/* 갤러리 --------------------------------------------- */}
      <section className="gallery" id="templates">
        <h3 className="section-title">소중한 날을, 더 특별하게.</h3>
        <p className="section-desc">예쁜 모바일 청첩장, 링크 하나면 충분해요.</p>

        <div className="card-grid">
          {cardList.map((c) => (
            <div key={c.id} className="card">
              <img src={c.image} alt={c.label} onClick={() => nav(`/invitation/${c.id}`)} />
              <h4 className="card-label">{c.label}</h4>
              <div className="actions">
                <button className="btn ghost sm" onClick={() => nav(`/invitation/${c.id}`)}>
                  샘플 보기
                </button>
                <button className="btn primary sm" onClick={() => nav('/invitation')}>
                  청첩장 만들기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
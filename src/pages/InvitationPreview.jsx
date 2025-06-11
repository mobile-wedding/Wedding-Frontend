import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import MapEmbed from '../components/MapEmbed';
import QRCode from 'react-qr-code';          // ← 추가


/* ─────────────────────────  작은 카운트다운 박스  ───────────────────────── */
function CountdownItem({ label, value }) {
  const box = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 60,
    padding: '0.25rem 0',
    border: '1px solid #eee',
    borderRadius: 6,
    fontSize: '0.75rem',
  };
  return (
    <div style={box}>
      <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
        {String(value).padStart(2, '0')}
      </span>
      <span>{label}</span>
    </div>
  );
}

/* ────────────────────────  월 단위 캘린더 매트릭스  ─────────────────────── */
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function buildCalendarMatrix(dateObj) {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth();
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const start = first.getDay(); // 0(Sun)-6(Sat)

  const matrix = [];
  let week = new Array(7).fill(null);
  let d = 1;

  // 1주 차
  for (let i = start; i < 7; i++) week[i] = d++;
  matrix.push(week);

  // 나머지 주
  while (d <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && d <= daysInMonth; i++) week[i] = d++;
    matrix.push(week);
  }
  return matrix;
}

/* ─────────────────────────────  메인 컴포넌트  ──────────────────────────── */
export default function InvitationPreview() {
  const { state } = useLocation();
  const [showShare, setShowShare] = useState(false);
  const shareUrl = window.location.href;
  const {
    groomName,
    brideName,
    date: weddingDateStr,
    location,
    photos = [],
    message,
  } = state || {};

  /* 날짜·D-Day 로직 ----------------------------------------------------- */
  const weddingDate = weddingDateStr ? new Date(weddingDateStr) : null;
  const weekDay = weddingDate?.toLocaleDateString('ko-KR', { weekday: 'long' }).toUpperCase();
  const ymd = weddingDate?.toISOString().split('T')[0].replace(/-/g, '.');

  const diffLeft = () => {
    if (!weddingDate) return null;
    const diff = weddingDate - new Date();
    return {
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
    };
  };
  const [left, setLeft] = useState(diffLeft());
  useEffect(() => {
    if (!weddingDate) return;
    const id = setInterval(() => setLeft(diffLeft()), 1_000);
    return () => clearInterval(id);
  }, [weddingDateStr]);

  /* 월별 캘린더 매트릭스 (memo) --------------------------------------- */
  const calendar = useMemo(
    () => (weddingDate ? buildCalendarMatrix(weddingDate) : []),
    [weddingDateStr]
  );

  /* 사진 분할 ---------------------------------------------------------- */
  const main = photos[0];
  const gallery = photos.slice(1);
  const section = { margin: '3rem 0', textAlign: 'center' };

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      {/* 1) 메인 사진 */}
      <section style={section}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{ymd}</h3>
        <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', letterSpacing: 1 }}>{weekDay}</p>
        {main && (
          <img
            src={main}
            alt="main"
            style={{ width: '100%', borderRadius: 10, objectFit: 'cover' }}
          />
        )}
      </section>

      {/* 2) 인사말 */}
      <section style={section}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          {groomName} | {brideName}
        </h2>
        <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {message ||
            `두 사람이 꽃과 나무처럼 걸어와서
서로의 모든 것이 되기 위해
오랜 기다림 끝에 혼례식을 치르는 날
세상은 더욱 아름다워라

이해인, <사랑의 사람들> 中`}
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#666' }}>
          INVITATION
          <br />
          소중한 분들을 초대합니다
        </p>
      </section>

      {/* 3) 캘린더 + 카운트다운 */}
      <section style={section}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{ymd}</h3>
        <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', letterSpacing: 1 }}>
          {weekDay} 오후 1시 30분
        </p>

        {/* ▶ 미니 캘린더 ◀ */}
        {calendar.length > 0 && (
          <table
            style={{
              width: '100%',
              maxWidth: 500,
              margin: '0.5rem auto 1.25rem',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
            }}
          >
            <thead>
              <tr>
                {WEEKDAYS.map((d) => (
                  <th key={d} style={{ padding: 4, fontWeight: 500 }}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.map((week, i) => (
                <tr key={i}>
                  {week.map((day, j) => {
                    const isDday = day === weddingDate.getDate();
                    const base = {
                      width: '14%',
                      padding: '6px 0',
                      textAlign: 'center',
                      borderRadius: 6,
                    };
                    const style = isDday
                      ? { ...base, background: '#fcefe8', fontWeight: 700 }
                      : base;
                    return (
                      <td key={j} style={style}>
                        {day ?? ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ▶ D-Day 카운트다운 ◀ */}
        {left && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            <CountdownItem label="DAYS" value={left.days} />
            <CountdownItem label="HOUR" value={left.hours} />
            <CountdownItem label="MIN" value={left.minutes} />
            <CountdownItem label="SEC" value={left.seconds} />
          </div>
        )}

        <p style={{ marginTop: '1.25rem', fontSize: '0.8rem' }}>
          {groomName} ♥ {brideName}의 결혼식이 {left?.days ?? 0}일 남았습니다.
        </p>
      </section>

      {/* 4) 갤러리 */}
      {gallery.length > 0 && (
        <section style={section}>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: 2 }}>
            GALLERY
            <br />
            갤러리
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
            }}
          >
            {gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`gallery-${i}`}
                style={{ width: '100%', borderRadius: 6, objectFit: 'cover' }}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5) 오시는 길 */}
      <section style={section}>
  <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: 2 }}>
    LOCATION
    <br />
    오시는 길
  </h3>
  <p style={{ marginBottom: '1rem' }}>{location}</p>

  <MapEmbed address={location} />
</section>

{/* 6) 공유하기 --------------------------------------------------- */}
<section style={{ ...section, marginBottom: '4rem' }}>
  <button
    onClick={() => setShowShare(!showShare)}
    style={{
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '8px',
      background: '#333',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    공유하기
  </button>

  {showShare && (
    <div
      style={{
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* URL 복사용 입력창 */}
      <input
        readOnly
        value={shareUrl}
        onClick={(e) => e.target.select()}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '0.9rem',
        }}
      />

      {/* QR 코드 */}
      <QRCode value={shareUrl} size={180} />

      <button
        onClick={() => setShowShare(false)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#888',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        닫기
      </button>
    </div>
  )}
</section>
    </div>
  );
}

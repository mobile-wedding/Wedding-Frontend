import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './InvitationDetail.css';

export default function InvitationDetail() {
  const { id } = useParams();
  const sectionRefs = useRef([]);
  const [active, setActive] = useState(0);

  const texts = [
    {
      title: '01. 커버',
      text: `청첩장을 열면 가장 먼저 보이는 메인 이미지입니다.\n단정한 웨딩 사진 한 장으로 우리의 시작을 알리고,\n하객분들께 따뜻한 첫인사를 전합니다.`,
    },
    {
      title: '02. 결혼 일정',
      text: `결혼식 일정, 그리고 디데이를 담은 화면입니다.\n초대의 의미와 기다림의 설렘을 함께 전합니다.`,
    },
    {
      title: '03. 갤러리',
      text: `함께한 순간들을 사진으로 담아 여러분과 나누고 싶습니다.\n설렘과 미소가 가득했던 그날의 추억을 소중한 분들과 감상해주세요.`,
    },
    {
      title: '04. 결혼식장',
      text: `저희의 특별한 날에 함께해주실 소중한 분들을 위해\n예식장 위치를 안내드립니다.\n편안하게 찾아오실 수 있도록 정성을 다해 준비하겠습니다.`,
    },
  ];

  /*  IntersectionObserver → active 인덱스 업데이트  */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sectionRefs.current.indexOf(e.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="detail-root">
      <div className="detail-wrapper">
        {/* ---------- 이미지 스크롤 영역 ---------- */}
        <div className="preview-col">
          {[1, 2, 3, 4].map((n, i) => (
            <figure
              key={n}
              ref={(el) => (sectionRefs.current[i] = el)}
              className="snap-item"
            >
              <img
                src={`/cards/${id}_${n}.png`}
                alt={`${id}-page${n}`}
                className="inv-img"
              />
            </figure>
          ))}
        </div>

        {/* ---------- 설명 ---------- */}
        <aside className="desc-col">
          <h3>{texts[active].title}</h3>
          {texts[active].text.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </aside>
      </div>
    </div>
  );
}
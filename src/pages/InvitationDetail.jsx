import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './InvitationDetail.css';

export default function InvitationDetail() {
  const { id } = useParams();
  const sectionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const descriptions = [
    { title: '01. 커버', text: '청첩장을 열면 가장 먼저 보이는 메인 이미지입니다.\n단정한 웨딩 사진 한 장으로 우리의 시작을 알리고,\n하객분들께 따뜻한 첫인사를 전합니다.' },
    { title: '02. 결혼 일정', text: '결혼식 일정, 그리고 디데이를 담은 화면입니다.\n초대의 의미와 기다림의 설렘을 함께 전합니다.' },
    { title: '03. 갤러리', text: '함께한 순간들을 사진으로 담아\n여러분과 나누고 싶습니다.\n설렘과 미소가 가득했던 그날의 추억을\n소중한 분들과 함께 감상해주세요.'},
    { title: '04. 결혼식장', text: '저희의 특별한 날에\n함께해주실 소중한 분들을 위해\n예식장 위치를 안내드립니다.\n편안하게 찾아오실 수 있도록\n정성을 다해 준비하겠습니다.'}]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="invitation-detail-container">
      <div className="invitation-scroll-wrapper">
        {/* 왼쪽: 스크롤되는 청첩장 이미지 */}
        <div className="invitation-preview">
          <div ref={(el) => (sectionRefs.current[0] = el)}>
            <img src={`/cards/${id}_1.png`} alt={`${id}`} className="invitation-image" />
          </div>
          <div ref={(el) => (sectionRefs.current[1] = el)}>
            <img src={`/cards/${id}_2.png`} alt={`${id}-page2`} className="invitation-image" />
          </div>
          <div ref={(el) => (sectionRefs.current[2] = el)}>
            <img src={`/cards/${id}_3.png`} alt={`${id}-page3`} className="invitation-image" />
          </div>
          <div ref={(el) => (sectionRefs.current[3] = el)}>
            <img src={`/cards/${id}_4.png`} alt={`${id}-page4`} className="invitation-image" />
          </div>
        </div>

        {/* 오른쪽: 각 페이지 설명 */}
        <div className="invitation-description">
          <div className="desc-section">
            <h3>{descriptions[activeIndex].title}</h3>
            <p>{descriptions[activeIndex].text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
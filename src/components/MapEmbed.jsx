// src/components/MapEmbed.jsx
import React, { useEffect, useRef } from 'react';

export default function MapEmbed({ address }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !address || !mapRef.current) return;

    // 지도 SDK가 완전히 로드된 후 실행
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          const options = {
            center: coords,
            level: 3,
          };

          mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);

          new window.kakao.maps.Marker({
            map: mapInstanceRef.current,
            position: coords,
          });
        }
      });
    });

    return () => {
      mapInstanceRef.current = null;
    };
  }, [address]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '300px',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#eee',
      }}
    >
      {!window.kakao?.maps && '지도를 불러오는 중...'}
    </div>
  );
}
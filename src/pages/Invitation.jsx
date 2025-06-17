import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import Dropzone from 'react-dropzone';
import cls from 'classnames';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

import './Invitation.css';

export default function CreateInvitation() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      groom: '',
      bride: '',
      date: new Date(),
      place: '',
    },
  });

  const onDrop = (files) => setPhotos((prev) => [...prev, ...files]);

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data) => {
    if (step !== 2) return setStep(step + 1); // 1→2, 2→3(제출)

    try {
      /* 1) 초대장 생성 */
      const uid = localStorage.getItem('user_id');
      const invRes = await axios.post(
        `http://localhost:8000/api/invitation/${uid}`,
        {
          groom_name: data.groom,
          bride_name: data.bride,
          wedding_date: data.date.toISOString(),
          location: data.place,
          message: '',
        }
      );
      const { id, security_code } = invRes.data;
      alert(`보안코드 복사해주세요: ${security_code}`);

      /* 2) 사진 업로드 */
      const fd = new FormData();
      fd.append('invitation_id', id);
      photos.forEach((p) => fd.append('files', p));
      await axios.post('http://localhost:8000/api/photo/photo/upload', fd);

      /* 3) 스타일링 & 레이아웃 */
      await axios.post(`http://localhost:8000/api/photo/classify/${id}`);
      await axios.post(`http://localhost:8000/api/photo/photo/layout/${id}`);

      /* 4) 미리보기 이동 */
      nav(`/invitation/preview/${id}`);
    } catch (e) {
      console.error(e);
      alert('청첩장 생성 오류 😢');
    }
  };

  /* ---------------- Preview 값 ---------------- */
  const w = watch(); // 모든 폼 값 실시간 구독

  return (
    <div className="wizard-root single">
      <div className="frame-wrap">
        {/* 우측 : 스텝 폼 --------------------------------- */}
        <section className="form-pane">
          {/* 진행 바 */}
          <div className="stepper">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cls('dot', step >= s && 'on')} />
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <>
                <h2>정보 입력</h2>
                <label>신랑 이름</label>
                <input {...register('groom', { required: true })} />
                {errors.groom && <span className="err">필수 입력</span>}

                <label>신부 이름</label>
                <input {...register('bride', { required: true })} />
                {errors.bride && <span className="err">필수 입력</span>}

                <label>결혼 날짜</label>
                <DatePicker
                  locale={ko}
                  selected={w.date}
                  onChange={(d) => setValue('date', d)}
                  dateFormat="yyyy.MM.dd"
                />

                <label>예식 장소</label>
                <input {...register('place', { required: true })} />
              </>
            )}

            {step === 2 && (
              <>
                <h2>부가기능</h2>

                <label>사진 업로드</label>
                <Dropzone onDrop={onDrop} accept={{ 'image/*': [] }}>
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                      {...getRootProps()}
                      className={cls('dropbox', isDragActive && 'on')}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? '놓으세요…' : '이미지 끌어다 놓기 / 클릭'}
                    </div>
                  )}
                </Dropzone>

                {/* 썸네일 프리뷰 */}
                {photos.length > 0 && (
                  <div className="thumb-row">
                    {photos.map((p, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(p)}
                        alt="t"
                        onClick={() =>
                          setPhotos((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <h2>제작 완료 🎉</h2>
                <p>"만들기" 버튼을 누르면 <br />초대장을 자동으로 배치하고 미리보기를 보여 드려요.</p>
              </>
            )}

            {/* 네비게이션 버튼 */}
            <div className="nav-btns">
              {step > 1 && (
                <button type="button" className="btn ghost" onClick={() => setStep(step - 1)}>
                  이전
                </button>
              )}
              <button type="submit" className="btn primary">
                {step === 3 ? '만들기' : '다음'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

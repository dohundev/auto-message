'use client';

import { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
import { MESSAGE_TEMPLATE } from './constants/messageTemplate';

const inputStyle =
  'w-full block rounded-xl bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 mb-4';
const labelStyle = 'block text-sm font-semibold text-gray-800 ';
const buttonStyle =
  'w-full bg-black text-white font-semibold py-2 rounded-lg active:scale-[0.98] transition cursor-pointer';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [weddingDate, setWeddingDate] = useState<Date | null>(new Date());
  const [wakeTime, setWakeTime] = useState('08:00');
  const [departureTime, setDepartureTime] = useState('09:00');
  const [shootTime, setShootTime] = useState('10:00');
  const [ceremonyTime, setCeremonyTime] = useState('11:00');
  const [location, setLocation] = useState('');
  const [hasReception, setHasReception] = useState(false);
  const [hasSecondPart, setHasSecondPart] = useState(false);
  const [activeTab, setActiveTab] = useState('message');

  const formatDateWithDay = (data: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = data.getFullYear();
    const month = data.getMonth() + 1;
    const day = data.getDate();
    return `${year}. ${month}. ${day} (${days[data.getDay()]})`;
  };

  const formatDateShort = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}(${days[date.getDay()]})`;
  };

  const message = MESSAGE_TEMPLATE.replace(
    '{{weddingDateTime}}',
    weddingDate
      ? `${formatDateWithDay(weddingDate)} ${ceremonyTime || ''}`
      : '',
  )
    .replace('{{shootTime}}', shootTime || '')
    .replace('{{location}}', location || '')
    .replace('{{customerName}}', customerName || '')
    .replace('{{hasReception}}', hasReception ? '-연회' : '')
    .replace('{{hasSecondPart}}', hasSecondPart ? '-2부' : '');

  const scheduleSummary = `
  ${weddingDate ? `${formatDateShort(weddingDate)}` : ''}
  1. ${shootTime} ${location} ${customerName}
  기상 : ${wakeTime} 
  출발 : ${departureTime}
`;

  // 유효성 검사
  const checkValidation = () => {
    if (
      !customerName ||
      !weddingDate ||
      !ceremonyTime ||
      !shootTime ||
      !location
    ) {
      toast('모든 필수 항목을 입력해주세요.', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#333',
          fontWeight: 'bold',
        },
      });

      return false;
    }
    return true;
  };

  // 복사하기
  const copyMessage = () => {
    if (activeTab === 'message') {
      if (!checkValidation()) {
        return;
      }
      navigator.clipboard.writeText(message);
      toast('문자 복사가 완료되었습니다.', {
        icon: '✔︎',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    } else {
      if (!checkValidation()) {
        return;
      }
      navigator.clipboard.writeText(scheduleSummary);
      toast('일정 복사가 완료되었습니다.', {
        icon: '✔︎',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
    }
  };

  const openSmsApp = () => {
    if (!checkValidation()) {
      return;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      toast('모바일 기기에서만 문자를 보낼 수 있습니다.', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#333',
          fontWeight: 'bold',
        },
      });

      return;
    }

    const body = encodeURIComponent(message);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&' : '?';

    const phone = phoneNumber.replace(/-/g, ''); // 하이픈 제거
    window.location.href = `sms:${phone}${separator}body=${body}`;
  };

  const addMinutesToTime = (baseTime: string, minutesToAdd: number) => {
    if (!baseTime) return '';

    const [hours, minutes] = baseTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  const handleShootTimeChange = (time: string) => {
    if (!time) return;
    setShootTime(time);
    setDepartureTime(addMinutesToTime(time, -60));
    setWakeTime(addMinutesToTime(time, -120));
    setCeremonyTime(addMinutesToTime(time, 60));
  };

  const handlePhoneChange = (phone: string) => {
    const numbers = phone.replace(/[^0-9]/g, '');

    // 포맷팅
    let formatted = '';
    if (numbers.length <= 3) {
      formatted = numbers;
    } else if (numbers.length <= 7) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }

    setPhoneNumber(formatted);
  };

  const setTimeAfter = (time: number) => {
    if (!shootTime) {
      toast.error('먼저 촬영 시작 시간을 입력해주세요.');
      return;
    }

    const hours = Math.floor(time / 60);
    const mins = time % 60;
    const timeText =
      hours > 0
        ? mins > 0
          ? `${hours}시간 ${mins}분`
          : `${hours}시간`
        : `${mins}분`;

    toast(`본식 시간이 ${timeText} 뒤 설정 되었습니다`, {
      icon: '✔︎',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontWeight: 'bold',
      },
    });

    const newTime = addMinutesToTime(shootTime, time);
    setCeremonyTime(newTime);
  };

  const setHasReceptionToggle = () => {
    setHasReception(!hasReception);
  };
  const setHasSecondPartToggle = () => {
    setHasSecondPart(!hasSecondPart);
  };

  const setDateToWeekday = (targetDay: number) => {
    const date = new Date();
    const today = date.getDay(); // 0=일, 6=토

    // 오늘 기준으로 다가오는 targetDay까지 남은 일수
    const diff = (targetDay - today + 7) % 7;
    date.setDate(date.getDate() + diff);

    setWeddingDate(date);
  };

  const reset = () => {
    setCustomerName('');
    setPhoneNumber('');
    setWeddingDate(new Date());
    setShootTime('10:00');
    setCeremonyTime('11:00');
    setLocation('');
    setHasReception(false);
    setHasSecondPart(false);
    setWakeTime('08:00');
    setDepartureTime('09:00');

    toast('초기화 되었습니다', {
      icon: '✔︎',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
  };

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className='size-full'>
      {showSplash && (
        <div
          className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className='text-center animate-splash'>
            <h1
              className='text-white text-4xl md:text-5xl tracking-widest font-light'
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                letterSpacing: '0.3em',
              }}
            >
              L FILM
            </h1>

            <div className='w-full h-px bg-white/70 mx-auto my-5' />

            <h2
              className='text-white text-4xl md:text-5xl tracking-widest font-light'
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                letterSpacing: '0.3em',
              }}
            >
              C RECORD
            </h2>
          </div>
        </div>
      )}
      <main className='min-h-screen bg-gray-100 flex flex-col lg:flex-row justify-center items-center gap-10 p-6 py-10'>
        <Toaster position='top-center' reverseOrder={false} />
        <section className='w-full max-w-md lg:h-[600px] bg-white rounded-2xl flex flex-col shadow-lg p-3'>
          <h1 className='text-2xl font-bold text-gray-900'>문자 생성기 </h1>
          <p className='text-sm text-gray-500 mb-3'>
            입력만 하면 바로 복사해서 전송하세요
          </p>
          <div className='overflow-y-auto flex-1 px-1'>
            <div className='flex'>
              <button
                onClick={reset}
                className='ml-auto text-sm text-gray-500 underline'
              >
                전체 초기화
              </button>
            </div>

            <div className='space-y-2 mb-4'>
              <label className={labelStyle}>
                이름 <span className='text-rose-500 '>*</span>
              </label>
              <input
                className={inputStyle}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder='고객명을 입력해주세요'
              />
              <label className={labelStyle}>
                전화번호 <span className='text-rose-500 '>*</span>
              </label>
              <input
                className={inputStyle}
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder='전화번호를 입력해주세요'
              />
              <div className='flex items-center gap-2'>
                <label className={labelStyle}>
                  날짜 <span className='text-rose-500 '>*</span>
                </label>
                <button
                  className='bg-rose-500 text-xs text-white font-medium py-1 px-2 rounded-lg active:scale-[0.98] transition cursor-pointer'
                  onClick={() => setDateToWeekday(6)}
                >
                  토요일
                </button>
                <button
                  className='bg-rose-500 text-xs text-white font-medium py-1 px-2 rounded-lg active:scale-[0.98] transition cursor-pointer'
                  onClick={() => setDateToWeekday(0)}
                >
                  일요일
                </button>
              </div>
              <input
                type='date'
                className={inputStyle}
                value={
                  weddingDate ? weddingDate.toISOString().split('T')[0] : ''
                }
                onChange={(e) =>
                  setWeddingDate(new Date(e.target.value) || null)
                }
              />
              <label className={labelStyle}>
                촬영 시작 시간 <span className='text-rose-500 '>*</span>
              </label>
              <input
                type='time'
                className={inputStyle}
                value={shootTime}
                onChange={(e) =>
                  handleShootTimeChange(e.target.value as string)
                }
              />
              <div className='flex items-center gap-2'>
                <label className={labelStyle}>
                  본식 시간 <span className='text-rose-500 '>*</span>
                </label>
                <button
                  className='bg-rose-500 text-xs text-white font-medium py-1 px-2 rounded-lg active:scale-[0.98] transition cursor-pointer'
                  onClick={() => setTimeAfter(90)}
                >
                  +1시간 30분
                </button>
              </div>
              <input
                type='time'
                className={inputStyle}
                value={ceremonyTime}
                onChange={(e) => setCeremonyTime(e.target.value)}
              />
              <div className='flex items-center gap-2'>
                <label className={labelStyle}>
                  예식 장소 <span className='text-rose-500 '>*</span>
                </label>
                <button
                  className={`text-xs font-semibold py-2 rounded-xl p-2  transition ${
                    hasReception
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  onClick={setHasReceptionToggle}
                >
                  연회
                </button>
                <button
                  className={`text-xs font-semibold py-2 rounded-xl p-2  transition ${
                    hasSecondPart
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                  onClick={setHasSecondPartToggle}
                >
                  2부
                </button>
              </div>
              <input
                className={inputStyle}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='장소를 입력해주세요'
              />
              <label className={labelStyle}>기상시간</label>
              <input
                type='time'
                className={inputStyle}
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
              <label className={labelStyle}>출발시간</label>
              <input
                type='time'
                className={inputStyle}
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />
            </div>
          </div>
        </section>
        <section className='w-full max-w-md lg:h-[600px] bg-white rounded-2xl flex flex-col shadow-lg p-4'>
          <div className='flex gap-2 mb-3'>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'message'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              문자 미리보기
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'schedule'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              스케줄 요약
            </button>
          </div>
          <div className='bg-gray-100 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed flex-1 overflow-y-auto my-2'>
            {activeTab === 'message' ? message : scheduleSummary}
          </div>

          {activeTab === 'message' ? (
            <div className='flex gap-1'>
              <button onClick={() => copyMessage()} className={buttonStyle}>
                문자 복사
              </button>
              <button onClick={() => openSmsApp()} className={buttonStyle}>
                문자 보내기
              </button>
            </div>
          ) : (
            <div className='flex gap-2'>
              <button onClick={() => copyMessage()} className={buttonStyle}>
                일정 복사
              </button>
              {/* <button onClick={() => addSchedule()} className={buttonStyle}>
              일정 추가
            </button> */}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
import { MESSAGE_TEMPLATE } from './constants/messageTemplate';


const inputStyle =
  'w-full block rounded-xl bg-gray-100 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400';
const labelStyle = 'block text-sm font-semibold text-gray-800 mb-2';

export default function Home() {
  const [customerName, setCustomerName] = useState('');
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [shootTime, setShootTime] = useState('10:00');
  const [ceremonyTime, setCeremonyTime] = useState('11:00');
  const [location, setLocation] = useState('');

  const formatDateWithDay = (data: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    const year = data.getFullYear()     
    const month = data.getMonth() + 1   
    const day = data.getDate()         
    return `${year}. ${month}. ${day} (${days[data.getDay()]})`
  }

  const message = MESSAGE_TEMPLATE
  .replace('{{weddingDateTime}}', weddingDate ? `${formatDateWithDay(weddingDate)} ${ceremonyTime || ''}` : '')
  .replace('{{shootTime}}', shootTime || '')
  .replace('{{location}}', location || '')
  .replace('{{customerName}}', customerName || '');

// 유효성 검사
const checkValidation = () => {
  if( !customerName || !weddingDate || !ceremonyTime || !shootTime || !location ) {
    toast.error('모든 필수 항목을 입력해주세요 !')
    return false
  }
  return true
}

// 복사하기
const copyMessage = () => {
  if( !checkValidation() ) {
    return 
  }
  navigator.clipboard.writeText(message)
  toast.success('복사가 완료되었습니다.')
}


const addMinutesToTime = (baseTime: string, minutesToAdd: number) => {
  if (!baseTime) return '';  
  
  const [hours, minutes] = baseTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  
  const newHours = Math.floor(totalMinutes / 60) % 24;  
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};


const setTimeAfter = (time:number) => {
  if(!shootTime){
    toast.error('먼저 촬영 시작 시간을 입력해주세요.')
    return
  }

  const newTime = addMinutesToTime(shootTime, time)
  setCeremonyTime(newTime)
}
 
  return (
   
    <main className='min-h-screen bg-gray-100 flex flex-col lg:flex-row justify-center items-center gap-10 p-6 py-10'>
    <Toaster   
    
    containerStyle={{
      top: '50%',
      transform: 'translateY(-20%)',
    }}
    toastOptions={{
      duration: 1500,
      position: 'top-center',  
    }} />
      <section className='w-full max-w-md lg:h-[600px] bg-white rounded-2xl shadow-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-900'>문자 생성기 </h1>
        <p className='text-sm text-gray-500 mb-3'>
          입력만 하면 바로 복사해서 전송하세요
        </p>
        <div className='space-y-2 mb-4'>
        <label className={labelStyle}>
        이름
          </label>
         
          <input
            className={inputStyle}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder='고객명을 입력해주세요'
          />
          <label className={labelStyle}>
            날짜
          </label>
          {/* <DatePicker
            selected={weddingDate}
            onChange={(date: Date | null) => setWeddingDate(date)}
            dateFormat='yyyy.MM.dd'
            placeholderText='날짜 선택'
            className={inputStyle}
            locale={ko}   
            withPortal
          /> */}
          <input
            type='date'
            className={inputStyle}
            value={weddingDate ? weddingDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setWeddingDate(new Date(e.target.value) || null)}
          />
          <label className={labelStyle}>촬영 시작</label> 
          <input
            type='time'
            className={inputStyle}
            value={shootTime}
            onChange={(e) => setShootTime(e.target.value)}
          />
          {/* <DatePicker
            selected={shootTime ? new Date(`2000-01-01T${shootTime}`) : null}
            onChange={(date: Date | null) => {
              if (date) {
                const hours = String(date.getHours()).padStart(2, '0');
                const mins = String(date.getMinutes()).padStart(2, '0');
                setShootTime(`${hours}:${mins}`);
              } 
            }}
            showTimeSelect          
            showTimeSelectOnly      
            timeIntervals={5}      
            timeCaption="시간"        
            dateFormat="HH:mm"       
            locale={ko}
            className={inputStyle}
            wrapperClassName="w-full block"  
            placeholderText="시간 선택"
            onFocus={(e) => e.target.blur()}   
          

          />  */}
          <label className={labelStyle}>본식 시간</label>
         <div>
         <button className='bg-rose-500 text-xs  text-white font-semibold py-2 rounded-xl active:scale-[0.98] transition cursor-pointer p-2 mr-2'
          onClick={() => setTimeAfter(60)}
          >1시간 뒤</button> 
          <button className='bg-rose-500 text-xs  text-white font-semibold py-2 rounded-xl active:scale-[0.98] transition cursor-pointer p-2'
          onClick={() => setTimeAfter(90)}
          >1시간 30분 뒤</button> 
         </div>

          {/* <DatePicker
            selected={ceremonyTime ? new Date(`2000-01-01T${ceremonyTime}`) : null}
            onChange={(date: Date | null) => {
              if (date) {
                const hours = String(date.getHours()).padStart(2, '0');
                const mins = String(date.getMinutes()).padStart(2, '0');
                setCeremonyTime(`${hours}:${mins}`);
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={5}
            timeCaption="시간"
            dateFormat="HH:mm"
            locale={ko}
            className={inputStyle}
            wrapperClassName="w-full block"   
            placeholderText="시간 선택"
            onFocus={(e) => e.target.blur()}   
          />   */}
          <input
            type='time'
            className={inputStyle}
            value={ceremonyTime}
            onChange={(e) => setCeremonyTime(e.target.value)}
          />
        
          <label className={labelStyle}>예식 장소</label>
          <input
            className={inputStyle}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='장소를 입력해주세요'
          />
        </div>
      </section>
      <section className='w-full max-w-md lg:h-[600px] bg-white rounded-2xl flex flex-col shadow-lg p-4'>
        <h1 className='text-2xl font-bold text-gray-900'>문자 미리보기 </h1>
        <div className='bg-gray-100 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed flex-1 overflow-y-auto my-2'>{message}</div>
        <button
          onClick={() => copyMessage()}
          className='w-full bg-rose-500 text-white font-semibold py-4 rounded-xl active:scale-[0.98] transitio cursor-pointer'
        >
          문자 복사하기
        </button> 
      </section>
    </main>
  );
}

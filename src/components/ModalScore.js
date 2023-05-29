import React from 'react'
import  Letter_A  from '../assets/score/letter-a.png'
import  Letter_B  from '../assets/score/letter-b.png'
import  Letter_C  from '../assets/score/letter-c.png'
import  Letter_D  from '../assets/score/letter-d.png'
import  Letter_E  from '../assets/score/letter-e.png'
import  Celebrate  from '../assets/Celebrate.gif'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function ModalScore(props) {

  const navigate = useNavigate()
  //이제 클리어 기준 세워서 클리어/실패 처리 후 결과값을 DB에 넣고, 카테고리 페이지에서 DB결과값을 불러와서 보여준다
  //그리고 클리어한 카테고리는 들어갔을 때 다른 화면이 보여야함. 그 화면 처리해주기.

  //이외 아이패드에 해야할 것 쓰여있음.
  let LetterSrc;

  if(0 <= props.points && props.points <= 200){ LetterSrc = Letter_E }
  else if(200 < props.points && props.points <= 400){ LetterSrc = Letter_D }
  else if(400 < props.points && props.points <= 600){ LetterSrc = Letter_C }
  else if(600 < props.points && props.points <= 800){ LetterSrc = Letter_B }
  else if(800 < props.points && props.points <= 1000){ LetterSrc = Letter_A}

  return (
    <div className='justify-center flex'>
      <div className='flex h-full w-full fixed items-center justify-center opacity-80 bg-orange-100 top-0 left-0'></div>
      <motion.div className='flex  border-2 border-black fixed p-2 bg-white mx-auto w-4/6 h-3/6 rounded-3xl text-center
       shadow-2xl items-center justify-center'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: {
            opacity: 0, x: -50,
          },
          visible: {
            opacity: 1, x: 0
          }
        }}
      >
        <div className='flex flex-col w-5/6 gap-3  mx-auto  h-5/6 my-auto justify-center items-center'>
          <img src={Celebrate} className='absolute w-full h-full' />
          <div className='relative justify-center items-center'>
          <img src={props.src} className='w-[115px] h-[100px]' />
          {/* 아마 쿠룽이 사진은 삭제하고 (위에) 밑에 점수 사진을 확대할 것 같다. 이미지만 왼쪽으로 쏠렸는데 화면크기 상관없이 가운데에 오도록 마진 속성을 사용해보자. */}
          <img src={LetterSrc} className='ml-10 w-[20px] h-[20px]'/> 
          <label className='text-xl font-bold mt-3'>총점 : {props.points} 점</label>
          {props.count === 0 ? console.log("시간초과없음")
            : (<label className='font-bold'>시간초과 <label className='text-red-400'>{props.count}</label> 회로 <label className='text-red-400'>{props.minus}</label> 점 감점되었습니다.</label>)}
          <button className='p-1 bg-orange-200 w-4/6 mt-5 rounded-xl font-bold text-xl hover:text-white hover:bg-orange-300'
            onClick={() => navigate('/category', { state: { src: props.src, level: props.level, Category: props.category } })}>OK</button>
        </div></div>
      </motion.div>
    </div>

  )
}

export default ModalScore

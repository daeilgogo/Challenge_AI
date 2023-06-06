import React, { useEffect } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Letter_A from '../assets/score/letter-a.png'
import Letter_B from '../assets/score/letter-b.png'
import Letter_C from '../assets/score/letter-c.png'
import Letter_D from '../assets/score/letter-d.png'
import Letter_E from '../assets/score/letter-e.png'
import Celebrate from '../assets/Celebrate.gif'
import Fail from '../assets/failimage.png'
import Clear from '../assets/clearimage.png'
import Success from '../assets/Sound/success.mp3'
import Lose from '../assets/Sound/fail.mp3'


function ModalScore(props) {

  const navigate = useNavigate()
  const CoinNum = props.coinNum
  const isClear = props.isClear
  const [win,setWin]=useState(false)
  const Winner = new Audio(Success)
  const Loser= new Audio(Lose)


  //const [isClear, setIsClear] = useState(false)
  // const StandardOfClear = {
  //   'Tutorial': 600,
  //   'Level_1': 700,
  //   'Level_2': 800,
  //   'Level_3': 900
  // }

  // useEffect(() => {
  // if (props.points >= StandardOfClear[props.level]) {
  //   setIsClear(true)
  // }},[])

  //이제 클리어 기준 세워서 클리어/실패 처리 후 결과값을 DB에 넣고, 카테고리 페이지에서 DB결과값을 불러와서 보여준다
  //그리고 클리어한 카테고리는 들어갔을 때 다른 화면이 보여야함. 그 화면 처리해주기.
  
  ///////////Sound Effect
  useEffect(() => {
    if(win === false ){
      Winner.play();
    }else{
      Loser.play()
    }
  },[])
  
  let LetterSrc;


  if (0 <= props.points && props.points <= 600) { LetterSrc = Letter_E; setWin(true) }
  else if (600 < props.points && props.points <= 700) { LetterSrc = Letter_D}
  else if (700 < props.points && props.points <= 800) { LetterSrc = Letter_C }
  else if (800 < props.points && props.points <= 900) { LetterSrc = Letter_B }
  else if (900 < props.points && props.points <= 1000) { LetterSrc = Letter_A }

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
        {isClear ?
        <div className='flex flex-col w-5/6 gap-3  mx-auto  h-5/6 my-auto justify-center items-center'>
          <img src={Celebrate} className='absolute w-full h-full' />
          <div className='relative justify-center items-center'>
            <img src={Clear} className='ml-16 mb-5 w-[150px] h-[40px]' />
            <img src={LetterSrc} className='ml-20 w-[100px] h-[90px]' />
            <div className='text-xl font-bold mt-5'>총점📝 : {props.points}점</div>
            <div className='text-xl font-bold'>코인🪙 : + {CoinNum}개</div>
            {props.count === 0 ? console.log("시간초과없음")
              : (<div className='font-bold mt-5'>시간초과 <label className='text-red-400'>{props.count}</label> 회로 <label className='text-red-400'>{props.minus}</label> 점 감점되었습니다.</div>)}
            <button className='p-1 bg-orange-200 w-4/6 mt-5 rounded-xl font-bold text-xl hover:text-white hover:bg-orange-300'
              onClick={() => navigate('/category', { state: { src: props.src, Level: props.Level, Category: props.category } })}>OK</button>
          </div>
        </div>
        : <div className='flex flex-col w-5/6 gap-3  mx-auto  h-5/6 my-auto justify-center items-center'>
        <div className='relative justify-center items-center'>
          <img src={Fail} className=' ml-5 mb-5 w-[150px] h-[40px]' />
          <img src={LetterSrc} className='ml-12 w-[100px] h-[90px]' />
          <div className='text-xl font-bold mt-5'>총점📝 : {props.points}점</div>
          <div className='text-xl font-bold'>코인🪙 : + 0개</div>
          <button className='p-1 bg-orange-200 w-4/6 mt-5 rounded-xl font-bold text-xl hover:text-white hover:bg-orange-300'
            onClick={() => navigate('/category', { state: { src: props.src, Level: props.Level, Category: props.category } })}>OK</button>
        </div>
      </div>}
      </motion.div>
    </div>

  )
}

export default ModalScore
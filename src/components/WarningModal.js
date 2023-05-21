import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function WarningModal({setModal}) {

 const navigate=useNavigate()

  return (
    <div className='justify-center flex' >
        <div className='flex h-full w-full fixed items-center justify-center opacity-80 bg-orange-100 top-0 left-0'></div>
        <motion.div className='flex  border-2 border-black p-2 bg-white mx-auto w-4/6 h-3/6 rounded-3xl fixed 
         shadow-2xl items-center justify-center'
         initial='hidden'
    whileInView='visible'
    viewport={{once:true,amount:0.5}}
    transition={{duration:0.5}}
    variants={{
      hidden:{
          opacity:0, x:-50,
      },
      visible:{
          opacity:1, x:0
              
      }
      

    }}>
      
        <div className='flex flex-col w-5/6 gap-3  mx-auto  h-5/6 my-auto justify-center items-center '>
            <button className='-mt-20 ml-[95%] text-2xl font-bold mb-50' onClick={()=>setModal(false)}>x</button>
           <label className='text-3xl text-orange-300 font-bold'>! 주의 !</label>
           <label className='mt-5 text-center w-5/6'>토론이 종료되기 전에 화면에서 벗어나면 토론 내용이 저장되지 않습니다. 그래도 괜잖습니까?</label>
           <button className='p-2 bg-orange-200 w-4/6 mt-5 rounded-xl font-bold  hover:text-white  hover:bg-orange-300 ' onClick={()=>navigate('/home')}>삭제돼도 괜잖아요</button>
        </div>
      </motion.div>
    </div>
    
  )
}

export default WarningModal

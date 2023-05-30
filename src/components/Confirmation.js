import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'





export default function Confirmation({ConfirBuyTime, ConfirmSubmit}) {

  const navigate=useNavigate()


  return (
    <div className='justify-center flex' >
        <div className='flex h-full w-full fixed items-center justify-center opacity-80 bg-orange-100 top-0 left-0'></div>
        <motion.div className='flex  border-2 border-black p-2 bg-white mx-auto w-4/6 h-3/6 lg:w-3/6 rounded-3xl fixed 
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
      
        <div className='flex flex-col w-5/6 h-5/6 gap-3  mx-auto  my-auto justify-center items-center '>
           <label className='text-2xl lg:text-3xl text-orange-300 font-bold'>⏰시간 초과⏰</label>
           <label className='mt-5 text-base lg:text-xl text-center w-5/6'>시간이 초과되었어요!</label>
           <label className='mt-2 text-xs lg:text-base text-center w-5/6'>시간을 구매하시면 의견을 더 작성하실 수 있습니다 📝</label>
           <label className='mt-0 text-xs lg:text-base text-center w-5/6'>그냥 제출하시면 총점수에서 <label classname='text-red-400'>30점이 감점</label>됩니다 😯</label>
           <div className='flex w-full justify-center gap-8 mt-5'>
             <button className='p-2 text-sm lg:text-lg bg-red-200  rounded-xl font-bold  hover:text-white  hover:bg-red-300 ' onClick={()=>{ConfirBuyTime()}}>시간 구매</button>
             <button className='p-2 text-sm lg:text-lg bg-orange-200  rounded-xl font-bold  hover:text-white  hover:bg-orange-300 ' onClick={()=>{ConfirmSubmit()}}>그냥 제출</button>
           </div>
           
        </div>
      </motion.div>
    </div>
    
  )
}

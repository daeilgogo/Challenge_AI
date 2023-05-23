import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'





export default function Confirmation({ConfirBuyTime, ConfirmSubmit}) {

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
           <label className='text-3xl text-orange-300 font-bold'>! 알림 !</label>
           <label className='mt-5 text-center w-5/6'>시간이 끝났습니다, 계속 의견을 작성하시고 싶으면 시간을 구매할 수 있습니다 !!</label>
           <div className='flex w-full justify-center gap-10 mt-5'>
             <button className='p-2 bg-red-200  rounded-xl font-bold  hover:text-white  hover:bg-red-300 ' onClick={()=>{ConfirBuyTime()}}>시간을 구매하시겠습니까?</button>
             <button className='p-2 bg-orange-200  rounded-xl font-bold  hover:text-white  hover:bg-orange-300 ' onClick={()=>{ConfirmSubmit()}}>그냥 제출하시겠습니까?</button>
           </div>
           
        </div>
      </motion.div>
    </div>
    
  )
}

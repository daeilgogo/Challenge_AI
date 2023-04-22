import React from 'react'
import B from '../assets/score/B.png'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'


function ModalScore({setModal,props,points,level,categorie}) {

  const navigate = useNavigate()
  return (
    <div  className='flex h-full w-full fixed items-center justify-center opacity-80 bg-orange-100 top-0 left-0'>
      <motion.div className='flex fixed p-2 bg-white mx-auto w-5/6 h-3/6 rounded-3xl text-center
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
       }}
       >
        <div className='flex flex-col w-5/6 gap-3  mx-auto  h-5/6 my-auto justify-center items-center'>
           <img src={props} className='w-[100px] h-[100px]'/>
           <label className='text-xl font-bold mt-3'>총점 : {points} </label>
           <label className='font-bold'><label className='text-yellow-500'>논리력</label>에서 가장 높은 평가를 받았습니다!</label>
           <button className='p-1 bg-orange-200 w-4/6 mt-5 rounded-xl font-bold text-xl hover:text-white hover:bg-orange-300' onClick={()=>navigate('/congrat',{state:{src:props,Level:level,Categorie:categorie}})}>OK</button>
        </div>
      </motion.div>
    </div>
    
  )
}

export default ModalScore

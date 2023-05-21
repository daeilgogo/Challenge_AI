import React, { useState,useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {firebase} from '../firebase'
import { UserAuth } from '../context/AuthContext'
import Coins from '../assets/coins.png'
import Time from '../assets/Time.jpg'

function BuyTime({ value, onChange,setBuyTime,HandleBuyTime,setOff }) {

    const {user}=UserAuth()
 const navigate=useNavigate()

     //////Get score from firestore
     const db = firebase.firestore();
     const [coins, setCoins]=useState('')
     useEffect(()=>{
       const getinfo = db.collection("users").doc(user.uid)
       getinfo.onSnapshot((doc)=>{
        if(doc.exists){
          return  setCoins(doc.data().Coins)
        } 
           })
       
     },[])
 

   
  return (
    <div className='justify-center flex' >
      <div  className='flex h-full w-full fixed items-center justify-center opacity-90 bg-orange-100 top-0 left-0'></div>
    <motion.div className='flex  border-2 border-black fixed p-2 bg-white mx-auto w-5/6 h-4/6 rounded-3xl text-center flex-col top-[15%]
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
      <div className='flex flex-col w-5/6 gap-1  mx-auto  h-full  my-auto justify-center items-center'>
      <button className='ml-[80%]  font-bold text-xl text-red-500' onClick={()=>{setBuyTime();setOff(false)}}>X</button>
         <img src={Coins} className='w-[50px] h-[50px] -mt-[5%]'/>
         <label className='text-xl font-bold mt-3 flex'>코인 : <div className='ml-2 text-blue-500'> {coins} </div> </label>
         <label className='font-bold'>쾨인을 이용해서 시간을 구매할 수 있습니다</label>
         <label className='font-bold'>2 min --- 3 코인 </label>
         <label className='font-bold'>3 min --- 5 코인 </label>
         <label className='font-bold'>5 min --- 6 코인 </label>
         <label className='font-bold'>시간을 구매하신 후 바로 시작하니까 빨리 닫으면 좋겠습니다 </label>
         <div className='flex items-center w-5/6 mx-auto gap-3'>
            <img src={Time} className='w-[100px] h-[100px]'/>
            <select className='w-5/6 p-2 bg-green-100 rounded-xl outline-none shadow-2xl border-2 border-black hover:bg-green-300' value={value} onChange={onChange}>
                 <option value='2'>2 min </option>
                 <option value='3'>3 min</option>
                 <option value='5'>5 min</option>
            </select>
         </div>
         <label>시간을 구매하하시겠습니까: <label className='text-red-600 text-xl font-bold'>{value} </label>?</label>
         <button className='p-1 bg-orange-200 w-4/6 mt-5 rounded-xl font-bold text-xl border-2 border-black hover:text-white hover:bg-orange-300'onClick={()=>{HandleBuyTime()}}>구매합니다 </button>
        {/* <div className='bg-blue-200 w-5/6 p-5'>
         <input type="text" value={value} onChange={onChange} />
        </div>  */}
    </div>
  </motion.div>
  </div>
  )
}

export default BuyTime

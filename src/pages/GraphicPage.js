import React, {useEffect, useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import { motion } from 'framer-motion'
import {firebase} from '../firebase'

function GraphicPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)


    

    //////Get score from firestore
    const [score, setScore]=useState('')
   
    useEffect(()=>{
      
    const db = firebase.firestore();

    const getinfo = db.collection("users")
     
   getinfo.orderBy('Score')
   .get()
      .then((querySnapshot) => {
       querySnapshot.forEach((doc)=>{
         return  setScore(doc.data())
       })
      });
    },[])
   

  return (
     <motion.div className='flex w-screen  items-center justify-center h-screen bg-white'
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
        <div  className=' flex w-full bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
          <div className=' bg-[#f7ad3e] w-full p-2 justify-center items-center flex fixed top-0'>
            <div  className='w-full md:w-5/6 bg-[#f7ad3e] p-3 rounded-xl flex justify-between gap-5 items-center'>
                <img className='w-9 h-8' src={Logo}/>
                <div  className='flex-1 text-lg md:text-xl text-white'>  도전하나요 , {user.displayName}</div>
                <div className='flex gap-2'>
                   <img alt='Coins' src={Coins}/>
                   <div className='text-xl text-white'>{score.Score}</div>
                </div>
                <button className=' lg:block border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                onClick={()=>setIsMenuToggled(!isMenuToggled)}>
                   <FaBars className='w-8 h-7'/>
                </button>
                 {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
            </div>
            {isMenuToggled && (<MenuBar setModal={setIsMenuToggled}/>)}
            
          </div>
          <div className='w-5/6 mx-auto h-5/6 bg-white justify-center items-center flex flex-col gap-7 rounded-xl font-bold'>
              
             
             

          </div> 
        </div>
    </motion.div>
  )
}

export default GraphicPage

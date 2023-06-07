import React, {useEffect, useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import F_place from '../assets/f_place.jpg'
import S_place from '../assets/s_place.jpg'
import T_place from '../assets/t_place.jpg'
import ModalScore from '../components/ModalScore'
import WarningModal from '../components/WarningModal'
import { motion } from 'framer-motion'
import {firebase} from '../firebase'



function RatingPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
    const [modal,setModal]=useState(false)
    const [data, setData]=useState([])
    const [score, setScore]=useState('')
   
    const db = firebase.firestore();

    ///Get data from firestore 
    const medal = [F_place, S_place, T_place]

    useEffect(() => {
      const getinfo = db.collection("users");
      getinfo.orderBy('Coins', 'desc').limit(10).onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setData(data);
        }
      });
    }, [user.uid]);
    



//////Get score from firestore
  const [coins,setCoins]=useState()
  useEffect(()=>{
    const getinfo = db.collection("users").doc(user.uid)
    getinfo.onSnapshot((doc)=>{
      if(doc.exists){
        return  setCoins(doc.data().Coins)
      }  
        })
    
  },[user.uid])
  
      




  ////////////////////////////////
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
         <div className=' flex w-full bg-white mx-auto h-full items-center justify-center rounded-2xl 
        gap-10 flex-col'>
            <div className=' bg-[#f7ad3e] w-full p-2 justify-center items-center flex'>
               <div className='w-full md:w-5/6 bg-[#f7ad3e] p-3 rounded-xl flex justify-between gap-5 items-center'>
                  <img className='w-9 h-8 hidden lg:block' src={Logo} />
                  <div className='flex-1 text-lg md:text-xl text-white'>  도전하나요 , {user.displayName}</div>
                  <div className='flex gap-2'>
                     <img alt='Coins' src={Coins} />
                     <div className='text-xl text-white'>{coins}</div>
                  </div>
                  <button className=' lg:block border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                     onClick={() => setIsMenuToggled(!isMenuToggled)}>
                     <FaBars className='w-8 h-7' />
                  </button>
                  {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
               </div>
               {isMenuToggled && (<MenuBar setModal={setIsMenuToggled}/>)}

            </div>
          <div className='w-5/6 mx-auto h-full  bg-white justify-center flex flex-col gap-5 rounded-xl font-bold'>
            {
              data.map((data,idx)=>(

                <div key={idx} className=' bg-gray-200 mx-auto   p-2 rounded-xl  flex w-full justify-between gap-3 items-center'>
                    {medal[idx] && <img className='w-10 h-10' src={medal[idx]}/>}
                    <div className='flex-1'>{data.Name}</div>
                    <div>{data.Coins}</div>
              </div>
                
              ))
            }
              
             

             
          </div>
        </div>
    </motion.div>
  )
}

export default RatingPage

import React, {useEffect, useState,useRef} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars,FaHome, FaSleigh } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import ChatBot from './ChatBot'
import ModalScore from '../components/ModalScore'
import WarningModal from '../components/WarningModal'
import {firebase} from '../firebase'
import { useLocation } from 'react-router-dom'
import Timer from '../components/Timer'



function ChatPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
    const navigate =useNavigate()
    const [modal,setModal]=useState(false)
    const [done,setDone]=useState(false)
    const location = useLocation();

    const category = location.state.category;
    const position= location.state.position;
    const Level= location.state.Level;
    const src= location.state.img;
    const Topic = location.state.Topic;

 
    

    //////Get score from firestore
    const [score, setScore]=useState('')
    useEffect(()=>{
      const db = firebase.firestore();
      const getCoin = db.collection("users")
      getCoin.orderBy('Coin')
      .get()
       .then((querySnapshot) => {
        querySnapshot.forEach((doc)=>{
          return setScore(doc.data())    
        })
       });
      
    },[])
    //// Send data to firebase:

    const [new_Score,setNew_Score]=useState(150)

    const Level_Done= async()=>{
    try { const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid).collection(Level).doc(category);
        await userRef.set({
        Score:new_Score,
        Title:category,
       }, { merge: true });
      }
       catch(error){
        console.log(error)
       }
    }

   


 
  return (
     <div className='flex w-screen  items-center justify-center h-screen bg-orange-300'>
        <div className=' flex w-[95%] bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
          <div className=' bg-orange-300 w-full p-2 justify-center items-center flex fixed top-0'>
            <div className='w-[95%] mx-auto bg-white p-3 rounded-xl font-bold flex justify-between gap-5 items-center'>
                <div className='flex-1'> 주제 : {Topic}</div>
                <div className='flex-1'> {user.displayName}님의 입장 : {position}</div>
                <div className='flex gap-2'>
                   <img alt='Coins' src={Coins}/>
                   <div>{score.Score}</div>
                </div>
                <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                // onClick={()=>navigate('/home')}
                onClick={()=>setModal(!modal)}
                >
                   <FaHome className='w-8 h-7'/>
                </button>
 
                 {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
            </div>
          
            
          </div>
          <div className='w-full mx-auto h-full bg-white mt-5 items-center flex flex-col gap-10 rounded-xl text-sm'>

           <ChatBot categorie={category} src={src} Level={Level} Topic={Topic}
            setScore={setScore} position={position}  Modal={setModal} isModal={modal}/>
          
           
            
          </div> 
        </div>
    </div>
  )
}

export default ChatPage

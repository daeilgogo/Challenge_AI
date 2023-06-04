import React, {useEffect, useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Coins from '../assets/coins.png'
import { FaHome, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import ChatBot from './ChatBot'
import Review from './Review'
import {firebase} from '../firebase'
import { useLocation } from 'react-router-dom'





function ChatPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
    const navigate =useNavigate()
    const [modal,setModal]=useState(false)
    const [done,setDone]=useState(false)
    const location = useLocation();
    const [buytTime,setBuyTime]=useState(false)

    const category = location.state.category;
    const position= location.state.position;
    const Level= location.state.Level;
    const src= location.state.img;
    const Topic = location.state.Topic;
    const replay= location.state.replay;
    const character = location.state.character;
    const score = location.state.score;

 
    

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
          
        },[user.uid])

   


 
  return (
     <div className='flex w-screen  items-center justify-center h-screen bg-orange-300'>
        <div className=' flex w-[95%] bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
          <div className=' bg-orange-300 w-full p-2 justify-center items-center flex fixed top-0'>
            <div className='w-[95%] mx-auto bg-white p-3 rounded-xl font-bold flex gap-5 items-center'>
                <div className='flex-1 text-sm'> 주제 : {Topic}</div>
                {!replay && <div className='flex-1 hidden lg:block'> {user.displayName}님의 입장 : {position}</div>}
                   <img alt='Coins' src={Coins}/>
                   <div>{coins}</div>
                <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                onClick={()=>{ replay ? navigate('/home') : setModal(!modal)}}
                >
                   <FaHome className='w-8 h-7'/>
                </button>
 
                 {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
            </div>
          </div>
          <div className='w-full mx-auto h-full bg-white mt-5 items-center flex flex-col gap-10 rounded-xl text-sm'>

            {replay ? <Review category={category} src={character} Level={Level} score={score}
            setScore={setCoins} position={position}  Modal={setModal} isModal={modal} buyTime={buytTime} setBuyTime={setBuyTime} Topic={Topic}/>
            :<ChatBot categorie={category} src={src} Level={Level}
            setScore={setCoins} position={position}  Modal={setModal} isModal={modal} buyTime={buytTime} setBuyTime={setBuyTime} Topic={Topic} />}
          
          </div> 
        </div>
    </div>
  )
}

export default ChatPage

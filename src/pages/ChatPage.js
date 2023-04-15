import React, { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, FaHome, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import ChatBot from './ChatBot'

function ChatPage() {
  const { user } = UserAuth()
  const [isMenuToggled, setIsMenuToggled] = useState(false)
  const navigate = useNavigate()

  //파라미터 : 토론주제 넘겨받기
  const location = useLocation()
  const Category = location.state.category


  return (
    <div className='flex w-screen  items-center justify-center h-screen bg-orange-300'>
      <div className=' flex w-5/6 bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
        <div className=' bg-orange-300 w-full p-2 justify-center items-center flex fixed top-0'>
          <div className='w-5/6 mx-auto bg-white p-3 rounded-xl font-bold flex justify-between gap-5 items-center'>
            <img className='w-9 h-8' src={Logo} />
            <div className='flex-1'>카테고리 : {Category}</div>
            <div className='flex gap-2'>
              <img alt='Coins' src={Coins} />
              <div>2500</div>
            </div>
            <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
              onClick={() => navigate('/home')}>
              <FaHome className='w-8 h-7' />
            </button>
            {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
          </div>
          {isMenuToggled && (<MenuBar />)}

        </div>
        <div className='w-full mx-auto h-full bg-white justify-center items-center flex flex-col gap-5 rounded-xl text-sm'>
          <div className='w-full h-[90%] mt-2 '>
            <ChatBot dabatetitle={Category} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

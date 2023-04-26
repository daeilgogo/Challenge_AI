import React, { useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { UserAuth } from '../context/AuthContext'
import Logo from '../assets/logo.png'
import { BsGraphUpArrow } from "react-icons/bs";
import { MdHotelClass } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function TabBar() {
    const [isMenuToggled,setIsMenuToggled]=useState(false)
    const navigate= useNavigate()
    //initialize UserAuth

    const {logOut, user}=UserAuth()
  // Define a function to Handle the Logout Button
  
  const handleLogout= async()=>{
    try {
       await logOut(); 
    } catch (error) {
        console.log(error)
    }
}
  
    return (
     <div className='fixed bottom-[1%]  z-0  w-5/6 drop-shadow-xl
                items-center  rounded-2xl shadow-sx-2xl bg-orange-300 mx-auto flex'>
          <div className='flex w-full gap-2 '>
             <button className='hover:bg-orange-300 hover:text-white w-5/6 text-left rounded-xl p-1 bg-orange-200 mx-auto flex items-center gap-1  fond-bold  ' onClick={()=>navigate('/home')}> <FaHome/>홈</button>
             <button className='hover:bg-orange-300 hover:text-white w-5/6 text-left rounded-xl p-1 bg-orange-200 mx-auto flex items-center gap-1  fond-bold' onClick={()=>navigate('/grap')}><BsGraphUpArrow/>그래프</button>
             <button className='hover:bg-orange-300 hover:text-white w-5/6 text-left rounded-xl p-1 bg-orange-200 mx-auto flex items-center gap-1  fond-bold' onClick={()=>navigate('/rating')}><MdHotelClass/>랭킹</button>
             <button className='hover:bg-orange-300 hover:text-white w-5/6  rounded-sm p-1 bg-red-300 mx-auto mt-10  items-center justify-center flex gap-2' onClick={handleLogout}> <img className='w-5 h-5' src={Logo}/>로그아웃</button>
          </div>
     </div>
  )
}

export default TabBar

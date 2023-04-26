import React, {useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'


function GraphicPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
   

  return (
     <div className='flex w-screen  items-center justify-center h-screen bg-orange-300'>
        <div className=' flex w-5/6 bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
          <div className=' bg-orange-300 w-full p-2 justify-center items-center flex fixed top-0'>
            <div className='w-5/6 mx-auto bg-white p-3 rounded-xl font-bold flex justify-between gap-5 items-center'>
                <img className='w-9 h-8' src={Logo}/>
                <div className='flex-1'>  도전하나요 , {user.displayName}</div>
                <div className='flex gap-2'>
                   <img alt='Coins' src={Coins}/>
                   <div>2500</div>
                </div>
                <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                onClick={()=>setIsMenuToggled(!isMenuToggled)}>
                   <FaBars className='w-8 h-7'/>
                </button>
                 {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
            </div>
            {isMenuToggled && (<MenuBar/>)}
            
          </div>
          <div className='w-5/6 mx-auto h-5/6 bg-white justify-center items-center flex flex-col gap-7 rounded-xl font-bold'>
              
              <div className='w-2/6 bg-orange-200 mx-auto  text-center p-2 rounded-xl shadow-xl shadow-orange-500'>
                사회
              </div>

              <div className='w-2/6 bg-orange-200 mx-auto  text-center p-2 rounded-xl shadow-xl shadow-orange-500'>
                환경
              </div>

              <div className='w-2/6  bg-orange-200 mx-auto  text-center p-2 rounded-xl shadow-xl shadow-orange-500'>
                 기술
              </div>

              <div className='w-2/6  bg-orange-200 mx-auto  text-center p-2 rounded-xl shadow-xl shadow-orange-500'>
                 기술
              </div>

              <div className='w-2/6  bg-orange-200 mx-auto  text-center p-2 rounded-xl shadow-xl shadow-orange-500'>
                 기술
              </div>

              <div className='w-2/6  bg-orange-200 mx-auto  text-center p-2 rounded-xl shadow-xl shadow-orange-500'>
                 기술
              </div>

          </div> 
        </div>
    </div>
  )
}

export default GraphicPage

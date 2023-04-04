import React, {useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import F_place from '../assets/f_place.jpg'
import S_place from '../assets/s_place.jpg'
import T_place from '../assets/t_place.jpg'


function RatingPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
   

  return (
     <div className='flex w-screen  justify-center h-screen bg-orange-300 items-center'>
        <div className=' flex w-5/6 bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
           flex-col'>
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
          <div className='w-5/6 mx-auto   bg-white justify-center flex flex-col gap-5 rounded-xl font-bold'>
              
              <div className=' bg-gray-200 mx-auto   p-2 rounded-xl  flex w-full justify-between gap-3 items-center'>
                <img className='w-10 h-10'  src={F_place}/>
                <div className='flex-1'>홍길동</div>
                <div>123124</div>
              </div>

              <div className=' bg-gray-200 mx-auto   p-2 rounded-xl items-center flex w-full justify-between gap-3'>
                <img className='w-10 h-10' src={S_place}/>
                <div className='flex-1'>홍길동</div>
                <div>122341</div>
              </div>

              <div className=' bg-gray-200 mx-auto   p-2 rounded-xl items-center  flex w-full justify-between gap-3'>
                <img className='w-10 h-10' src={T_place}/>
                <div className='flex-1'>홍길동</div>
                <div>90352</div>
              </div>

              <div className=' bg-gray-200 mx-auto   p-2 rounded-xl items-center   flex w-full justify-between gap-3'>
                <img className='w-10 h-10' src={T_place}/>
                <div className='flex-1'>홍길동</div>
                <div>90352</div>
              </div>

              <div className=' bg-gray-200 mx-auto   p-2 rounded-xl items-center   flex w-full justify-between gap-3'>
                <img className='w-10 h-10' src={T_place}/>
                <div className='flex-1'>홍길동</div>
                <div>90352</div>
              </div>
              <div className=' bg-gray-200 mx-auto   p-2 rounded-xl items-center flex w-full justify-between gap-3'>
                <img className='w-10 h-10' src={T_place}/>
                <div className='flex-1'>홍길동</div>
                <div>90352</div>
              </div>
              <div className=' bg-gray-200 mx-auto   p-2 rounded-xl items-center   flex w-full justify-between gap-3'>
                <img className='w-10 h-10' src={T_place}/>
                <div className='flex-1'>홍길동</div>
                <div>90352</div>
              </div>


              

              

          </div> 
        </div>
    </div>
  )
}

export default RatingPage

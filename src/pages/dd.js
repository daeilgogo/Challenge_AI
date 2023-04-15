import React, { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars } from 'react-icons/fa'
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc'
import MenuBar from '../components/MenuBar'
import TabBar from '../components/tabBar'
import Level from '../components/Level'
import Kinder from "../assets/kinder.png"
import Elementary from "../assets/element.png"
import High from "../assets/high.png"
import Univ from "../assets/univ.png"

function Home() {
   const { user } = UserAuth()
   const [isMenuToggled, setIsMenuToggled] = useState(false)
   const navigate = useNavigate()
   const chatBot = () => {
      navigate('/chat')
   }

   //함수 : 모바일 화면에서 좌우 스크롤 버튼 (<, >)
   const movePage = (props) => {
      if (props === "left") {
         document.getElementById('container').scrollBy({
            top: 0,
            left: -(document.documentElement.clientWidth-100),
            behavior: "smooth",
          });
      } else if (props === "right") {
         document.getElementById('container').scrollBy({
            top: 0,
            left: document.documentElement.clientWidth-100,
            behavior: "smooth",
          });
      }
   }

   //화면 : Home
   return (
      <div className='flex w-screen  items-center justify-center h-screen bg-white'>
         <div className=' flex w-full bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
            <div className=' bg-[#F29104] w-full p-2 justify-center items-center flex fixed top-0'>
               <div className='w-full md:w-5/6 bg-[#F29104] p-3 rounded-xl flex justify-between gap-5 items-center'>
                  <img className='w-9 h-8 hidden lg:block' src={Logo} />
                  <div className='flex-1 text-lg md:text-xl text-white'>  도전하나요 , {user.displayName}</div>
                  <div className='flex gap-2'>
                     <img alt='Coins' src={Coins} />
                     <div className='text-xl text-white'>2500</div>
                  </div>
                  <button className='hidden lg:block border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                     onClick={() => setIsMenuToggled(!isMenuToggled)}>
                     <FaBars className='w-8 h-7' />
                  </button>
                  {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
               </div>
               {isMenuToggled && (<MenuBar />)}

            </div>
            <div className='w-4/6 h-4/6 bg-white justify-center items-center flex flex-row rounded-xl font-bold'>
               <div id='container' className='overflow-auto lg:overflow-visible whitespace-nowrap transition ease-in-out delay-150'>
                  {/* 모바일 스크롤 버튼 < */}
                  <VscChevronLeft className="absolute top-1/2 left-0 w-[40px] h-[40px] lg:hidden" direction="left"
                     onClick={() => {
                        movePage("left")
                     }} />
                  <Level complete={true} name="Kinder" title="튜토리얼" content="유치원생 쿠룽이" src={Kinder}></Level>
                  <Level complete={false} name="Elementary" title="LEVEL1" content="초등학생 쿠룽이" src={Elementary}></Level>
                  <Level complete={false} name="High" title="LEVEL2" content="고등학생 쿠룽이" src={High}></Level>
                  <Level complete={false} name="Univ" title="LEVEL3" content="대학생 쿠룽이" src={Univ}></Level>
                  {/*모바일 스크롤 버튼 > */}
                  <VscChevronRight className="absolute top-1/2 right-0 w-[40px] h-[40px] lg:hidden"
                     onClick={() => {
                        movePage("right")
                     }} />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Home

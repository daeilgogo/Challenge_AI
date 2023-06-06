import React, { useEffect, useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc'
import { motion } from 'framer-motion'
import { firebase } from '../firebase'
import MenuBar from '../components/MenuBar'
import Level from '../components/Level'
import Kinder from "../assets/kinder.png"
import Elementary from "../assets/element.png"
import High from "../assets/high.png"
import Univ from "../assets/univ.png"
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'



function Home() {
   const { user } = UserAuth()
   const [isMenuToggled, setIsMenuToggled] = useState(false)
   const navigate = useNavigate()
   const [level, setLevel] = useState({
      Level1: 'LEVEL 1',
      Level2: 'LEVEL 2',
      Level3: 'LEVEL 3'
   }
   );

   //레벨 클리어 유무
   const [Level_1, setLevel_1] = useState(false)
   const [Level_2, setLevel_2] = useState(false)
   const [Level_3, setLevel_3] = useState(false)

   //코인, 레벨 클리어 유무 가져오기
   const db = firebase.firestore();
   const [coins, setCoins] = useState('')
   useEffect(() => {
      const getinfo = db.collection("users").doc(user.uid)
      getinfo.get()
         .then((doc) => {
            if (doc.exists) {
               doc.data().Tutorial ? setLevel_1(true) : setLevel_1(false)
               doc.data().Level_1 > 1000 ? setLevel_2(true) : setLevel_2(false)
               doc.data().Level_2 > 500 ? setLevel_3(true) : setLevel_3(false)
               return (setCoins(doc.data().Coins))
            }
         })

   }, [user.uid])


   //함수 : 모바일 화면에서 좌우 스크롤 버튼 (<, >), 화면 크기만큼 좌우 이동
   const movePage = (props) => {
      if (props === "left") {
         document.getElementById('container').scrollBy({
            top: 0,
            left: -(document.documentElement.clientWidth - 100),
            behavior: "smooth",
         });
      } else if (props === "right") {
         document.getElementById('container').scrollBy({
            top: 0,
            left: document.documentElement.clientWidth - 100,
            behavior: "smooth",
         });
      }
   }

   //화면 : Home
   return (
      <motion.div className='flex w-screen  items-center justify-center h-screen bg-white'
         initial='hidden'
         whileInView='visible'
         viewport={{ once: true, amount: 0.5 }}
         transition={{ duration: 0.5 }}
         variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 }
         }}>
         <div className=' flex w-full bg-white mx-auto h-full items-center justify-center rounded-2xl flex-col'>
            <div className=' bg-[#f7ad3e] w-full p-2 justify-center items-center flex'>
               <div className='w-full md:w-5/6 bg-[#f7ad3e] p-3 rounded-xl flex justify-between gap-5 items-center'>
                  <img className='w-9 h-8 hidden lg:block' src={Logo} />
                  <div className='flex-1 text-lg md:text-xl text-white'> 도전하나요 , {user.displayName}</div>
                  <div className='flex gap-2'>
                     <img alt='Coins' src={Coins} />
                     <div className='text-xl text-white'>{coins}</div>
                  </div>
                  <button className=' lg:block border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                     onClick={() => setIsMenuToggled(!isMenuToggled)}>
                     <FaBars className='w-8 h-7' />
                  </button>
               </div>
               {isMenuToggled && (<MenuBar setModal={setIsMenuToggled} />)}

            </div>
            <div className='w-4/6 h-full bg-white justify-center items-center flex flex-row rounded-xl font-bold'>
               <div id='container' className='overflow-auto lg:overflow-visible whitespace-nowrap transition ease-in-out delay-150'>
                  {/* 모바일 스크롤 버튼 < */}
                  <VscChevronLeft className="absolute top-1/2 left-0 w-[40px] h-[40px] lg:hidden"
                     onClick={() => {
                        movePage("left")
                     }} />
                  <div className='text-2xl text-center mb-10'>👇 난이도를 선택하세요! 👇</div>
                  <Level complete={true} name="Kinder" title="튜토리얼" content="유치원생 쿠룽이" src={Kinder}></Level>
                  <Level complete={Level_1} name="Elementary" title={level.Level1} content="초등학생 쿠룽이" src={Elementary}></Level>
                  <Level complete={Level_2} name="High" title={level.Level2} content="고등학생 쿠룽이" src={High}></Level>
                  <Level complete={Level_3} name="Univ" title={level.Level3} content="대학생 쿠룽이" src={Univ}></Level>
                  {/*모바일 스크롤 버튼 > */}
                  <VscChevronRight className="absolute top-1/2 right-0 w-[40px] h-[40px] lg:hidden"
                     onClick={() => {
                        movePage("right")
                     }} />
               </div>
            </div>
         </div>
      </motion.div>
   )
}

export default Home

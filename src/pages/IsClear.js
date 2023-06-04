import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { firebase } from '../firebase'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'

function IsClear() {
  const navigate = useNavigate()
  const [isMenuToggled, setIsMenuToggled] = useState(false)
  const { user } = UserAuth();

  //파라미터 : 이전 페이지 파라미터 갖고오기
  const location = useLocation()
  const category = location.state.category
  const image = location.state.character
  const Level = location.state.Level
  const score = location.state.score

  //////Get score from firestore
  const db = firebase.firestore();
  const [coins, setCoins] = useState('')
  const [topic, setTopic] = useState('')
  
  useEffect(() => {
    const getinfo = db.collection("users").doc(user.uid)
    const debateinfo = db.collection("users").doc(user.uid).collection(Level).doc(category).collection(category).doc('Debate Updated')

    getinfo.get()
      .then((doc) => {
        if (doc.exists) {
          return setCoins(doc.data().Coins)
        }
      })

    debateinfo.onSnapshot((doc) => {
      if (doc.exists) {
        setTopic(doc.data().Debate_Subject)
      }
    })
  }, [user.uid])

  //컴포넌트 : 버튼
  const Button = (props) => {
    return (
      <button className={`w-[200px] h-[50px] xl:w-[180px] xl:h-[150px] lg:text-lg
                         transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110
                         border-2 border-inherit shadow-lg rounded-xl relative
                         ${props.id === '1' ? '' : 'bg-[#f7ad3e] text-white'}`}
        onClick={() => {
          {props.id === '1' ? navigate('/setting', { state: { category: category, character: image, Level: Level } })
                            : navigate('/chat', { state: { category: category, character: image, Level: Level, replay:true, score:score, Topic:topic } })}
        }}>
        {props.BtnName}
      </button>
    )
  }

  //화면 : CategoryPage
  return (
    <div className=' flex w-full bg-white mx-auto h-5/6 items-center justify-center rounded-2xl gap-10 flex-col'>
      <div className=' bg-[#f7ad3e] w-full p-2 justify-center items-center flex fixed top-0'>
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
        {isMenuToggled && (<MenuBar setModal={setIsMenuToggled} />)}
      </div>
      <div className='w-5/6 h-5/6 mt-[150px] bg-white rounded-xl flex flex-col font-bold justify-center items-center'>
        <img className='w-[180px] h-[150px]' src={image}></img>
        <div className='flex flex-wrap mt-2 justify-center items-center'>
          <div className='text-sm lg:text-xl mt-2 p-1 bg-orange-300 rounded-lg'>{category}</div>
          <div className='text-sm lg:text-xl mt-2 ml-2 p-1 bg-[#ffed94] rounded-lg'>"{topic}"</div>
          <div className='text-sm lg:text-xl mt-2 ml-2 p-1 bg-[#D1F204] rounded-lg'>총점수 : {score}/1000</div>
        </div>
        <div className='p-5 gap-2 overflow-auto justify-center items-center flex flex-wrap'>
          <div className='hidden md:block basis-full'></div>
          <div className='hidden lg:block mt-2 text-2xl'>👇 토론을 다시하거나 다시볼 수 있어요! 👇</div>
          <div className='basis-full lg:p-2'></div>
          <Button BtnName="토론 다시하기 🔄️" id='1' />
          <Button BtnName="토론 다시보기 🎦" id='2'/>
        </div>
      </div>
    </div>
  )
}

export default IsClear

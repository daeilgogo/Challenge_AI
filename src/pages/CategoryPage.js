import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { firebase } from '../firebase'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import Letter_A from '../assets/score/letter-a.png'
import Letter_B from '../assets/score/letter-b.png'
import Letter_C from '../assets/score/letter-c.png'
import Letter_D from '../assets/score/letter-d.png'
import Letter_E from '../assets/score/letter-e.png'
import { elements } from 'chart.js'

function CategoryPage() {
  const navigate = useNavigate()
  const [isMenuToggled, setIsMenuToggled] = useState(false)
  const { user } = UserAuth();


  //파라미터 : 이미지 주소 갖고오기
  const location = useLocation()
  const image = location.state.src
  const Level = location.state.Level

  //레벨별 학력 매치
  const Education = new Map([
    ['Tutorial', '유치원생'],
    ['Level_1', '초등학생'],
    ['Level_2', '고등학생'],
    ['Level_3', '대학생']
  ])

  //레벨별 별 개수 매치
  const StarNum = new Map([
    ['Tutorial', '⭐'],
    ['Level_1', '⭐⭐'],
    ['Level_2', '⭐⭐⭐'],
    ['Level_3', '⭐⭐⭐⭐']
  ])

  //레벨별 클리어 기준 매치
  const ClearNum = new Map([
    ['Tutorial', 'A이상 (900/1000)'],
    ['Level_1', 'B이상 (800/1000)'],
    ['Level_2', 'C이상 (700/1000)'],
    ['Level_3', 'D이상 (600/1000)']
  ])

  const [isClear, setIsClear] = useState({
    "과학과 기술": false,
    "경제와 비즈니스": false,
    "사회문제와 인권": false,
    "자연과 환경": false,
    "교육과 학습": false
  });

  const [score, setScore] = useState({
    "과학과 기술": 0,
    "경제와 비즈니스": 0,
    "사회문제와 인권": 0,
    "자연과 환경": 0,
    "교육과 학습": 0
  });

  const topics = ["과학과 기술", "경제와 비즈니스", "사회문제와 인권", "자연과 환경", "교육과 학습"]

  //firestore에서 카테고리 클리어 여부 갖고오기
  useEffect(() => {
    topics.map(async function (element) {
      const isClearRef = db.collection('users').doc(user.uid).collection(Level).doc(element).collection(element).doc('Debate Updated')

      isClearRef.onSnapshot((doc) => {
        if (doc.exists) {
          //카테고리 클리어 여부
          let newIsClear =isClear 
          newIsClear[element] = doc.data().isClear
          setIsClear(newIsClear)

          //카테고리 점수
          let newScore = score 
          newScore[element] = doc.data().Score
          setScore(newScore)
        }
      })
    });
  }, [user.uid,topics])

  //////Get score from firestore
  const db = firebase.firestore();
  const [coins, setCoins] = useState('')
  useEffect(() => {
    const getinfo = db.collection("users").doc(user.uid)
    getinfo.get()
      .then((doc) => {
        if (doc.exists) {
          return setCoins(doc.data().Coins)
        }
      })

  }, [user.uid])


  //컴포넌트 : 카테고리 버튼
  const Category = (props) => {
    //카테고리 점수에 따른 A~E 등급 이미지
    let LetterSrc;
    let LetterColor;
    let CategoryScore = score[props.category]

    if (0 <= CategoryScore && CategoryScore <= 600) { LetterSrc = Letter_E; LetterColor="border-red-200 hover:bg-red-200"}
    else if (600 < CategoryScore && CategoryScore <= 700) { LetterSrc = Letter_D; LetterColor="border-green-200 hover:bg-green-200" }
    else if (700 < CategoryScore && CategoryScore <= 800) { LetterSrc = Letter_C; LetterColor="border-blue-200 hover:bg-blue-200" }
    else if (800 < CategoryScore && CategoryScore <= 900) { LetterSrc = Letter_B; LetterColor="border-yellow-200 hover:bg-yellow-200" }
    else if (900 < CategoryScore && CategoryScore <= 1000) { LetterSrc = Letter_A; LetterColor="border-pink-200 hover:bg-pink-200" }

    return (
      <button className={`w-[200px] h-[50px] xl:w-[180px] xl:h-[150px] lg:text-lg
                         transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110
                         border-2 border-inherit shadow-lg rounded-xl relative
                       ${isClear[props.category] ? `${LetterColor} border-4` : 'bg-white'}`}

        onClick={() => {
            isClear[props.category] ?( navigate('/isClear', { state: { category: props.category, character: image, Level: Level, score: score[props.category] } }))
                                    :( navigate('/setting', { state: { category: props.category, character: image, Level: Level } }))
        }}>
        {props.category}
        {isClear[props.category] ? 
          (<img src={LetterSrc} className='absolute -mt-12 ml-40
                                          xl:-mt-24 xl:ml-32
                                          w-[40px] h-[40px] 
                                          lg:w-[50px] lg:h-[50px]'/>) : (null)}
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
          <div className='text-sm lg:text-xl mt-2 p-1 bg-orange-300 rounded-lg'>{Education.get(Level)} 쿠룽이</div>
          <div className='text-sm lg:text-xl mt-2 ml-2 p-1 bg-[#ffed94] rounded-lg'>난이도 {StarNum.get(Level)}</div>
          <div className='text-sm lg:text-xl mt-2 ml-2 p-1 bg-[#D1F204] rounded-lg'>클리어 {ClearNum.get(Level)}</div>
        </div>
        <div className='p-5 gap-2 overflow-auto justify-center items-center flex flex-wrap'>
          <div className='hidden md:block basis-full'></div>
          <div className='hidden lg:block mt-2 text-2xl'>👇 원하는 토론 주제를 골라주세요! 👇</div>
          <div className='basis-full lg:p-2'></div>
          <Category category="과학과 기술" />
          <Category category="사회문제와 인권" />
          <Category category="자연과 환경" />
          <Category category="경제와 비즈니스" />
          <Category category="교육과 학습" />
        </div>
      </div>
    </div>
  )
}

export default CategoryPage

import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { firebase } from '../firebase'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import { motion } from 'framer-motion'
import MenuBar from '../components/MenuBar'
import popupBg from '../assets/popup_background.png'
import Letter_A from '../assets/score/letter-a.png'
import Letter_B from '../assets/score/letter-b.png'
import Letter_C from '../assets/score/letter-c.png'
import Letter_D from '../assets/score/letter-d.png'
import Letter_E from '../assets/score/letter-e.png'

function CategoryPage() {
  const navigate = useNavigate()
  const [isMenuToggled, setIsMenuToggled] = useState(false)
  const [forRender,setforRender] = useState(false)
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
  function getIsClear() {
    topics.map(async function (element) {
      const isClearRef = db.collection('users').doc(user.uid).collection(Level).doc(element).collection(element).doc('Debate Updated')

      isClearRef.onSnapshot((doc) => {
        if (doc.exists) {
          //카테고리 클리어 여부
          let newIsClear = isClear
          newIsClear[element] = doc.data().isClear
          setIsClear(newIsClear)

          //카테고리 점수
          let newScore = score
          newScore[element] = doc.data().Score
          setScore(newScore)

          console.log(isClear)
        }
      })
    });
  }
  
  useEffect(() => {
    getIsClear()
  }, [user.uid])

  //////Get score from firestore
  const db = firebase.firestore();
  const [coins, setCoins] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const getinfo = db.collection("users").doc(user.uid)
    getinfo.get()
      .then((doc) => {
        if (doc.exists) {
          doc.data().Tutorial ? setIsDone(true) : setIsDone(false)
          return setCoins(doc.data().Coins)
        }
      })

  }, [])


  //컴포넌트 : 카테고리 버튼
  const Category = (props) => {
    let LetterSrc;
    let LetterColor;
    let CategoryScore = score[props.category]
    
    //카테고리 점수에 따른 A~E 등급 이미지
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
            isClear[props.category] ? navigate('/isClear', { state: { category: props.category, character: image, Level: Level, score: score[props.category] } })
                                    : navigate('/setting', { state: { category: props.category, character: image, Level: Level } })
        }}>
        {props.category}
        {isClear[props.category] ? 
          <img src={LetterSrc} className='absolute -mt-12 ml-40
                                          xl:-mt-24 xl:ml-32
                                          w-[40px] h-[40px] 
                                          lg:w-[50px] lg:h-[50px]'/> : null}
      </button>
    )
  }
  
  const [openTutorialModal, setOpenTutorialModal] = useState(false)

  useEffect(() => {
  if(Level === 'Tutorial'){setOpenTutorialModal(true)}
  }, [])

  //튜토리얼일 때 설명 모달
  const TutorialModal = () => {
    return(
      <div className='justify-center flex'>
      <div className='flex h-full w-full fixed items-center justify-center opacity-80 bg-orange-100 top-0 left-0'></div>
      <motion.div className='flex border-2 top-40 fixed p-2 bg-white mx-auto w-9/12 lg:w-3/6 h-3/6 rounded-3xl text-center 
       shadow-2xl items-center justify-center bg-[length:280px_200px] lg:bg-[length:1000px_180px] bg-no-repeat' style={{backgroundImage: `url(${popupBg})`}}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: {
            opacity: 0, x: -50,
          },
          visible: {
            opacity: 1, x: 0
          }
        }}
      >
        <div class='flex flex-col w-5/6 gap-3  mx-auto  h-5/6 my-auto justify-center items-center'>
          <div className='relative'>
            <div className='font-bold text-lg lg:text-xl mt-5'>안녕하세요, <label className='text-orange-400'>{user.displayName}</label>님!</div>
            <div className='font-bold text-xs lg:text-lg'>DebateMate에 오신 것을 환영합니다 😺</div>
            <div className='mt-7 mb-3 text-xs lg:text-base font-bold text-justify'>DebateMate는 AI 쿠룽이와 함께 토론을 진행하고 문해력을 기르는 게임입니다!
            이번 토론게임은 튜토리얼로, 유치원생 쿠룽이와 토론해볼수 있습니다.
            모든 난이도에는 5가지 토론 카테고리가 있습니다.
            원하시는 카테고리를 골라 다양한 주제로 토론을 진행해보세요!</div>
            <button className='p-1 bg-yellow-400 w-4/6 mt-5 rounded-xl font-bold text-md lg:text-xl hover:text-white hover:bg-yellow-500'
              onClick={() => setOpenTutorialModal(false)}>카테고리 고르기</button>
          </div>
        </div>
      </motion.div>
    </div>
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
      {openTutorialModal && !isDone && <TutorialModal />}
    </div>
  )
}

export default CategoryPage

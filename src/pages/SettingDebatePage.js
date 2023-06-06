import React, { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { firebase } from '../firebase'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { FaBars, FaHome } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import { Wheel } from 'react-custom-roulette'
import { motion } from 'framer-motion'

function CategoryPage() {
  const { user } = UserAuth()
  const [isMenuToggled, setIsMenuToggled] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()

  //파라미터 : 카테고리, 캐릭터 이미지 갖고오기
  const location = useLocation()
  const Category = location.state.category
  const Character = location.state.character
  const Level = location.state.Level

  //컴포넌트 : 확인 메세지
  const ConfirmMessage = () => {
    return (
      <div className='mt-12 bg-ywhite justify-center items-center flex flex-col rounded-xl font-bold'>
        <img className='w-[120px] h-[100px]' src={Character}></img>
        <div className='pt-6 text-2xl text-[#F29104]'>{Category}</div>
        <div className='text-lg'>카테고리로 토론을 시작할까요?</div>
        <div className='flex-row pt-8'>
          <button className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 
                               w-[120px] h-[40px] border-2 border-inherit shadow-xl text-lg rounded-lg'
            onClick={() => navigate('/category', { state: { src: Character, category:Category, Level:Level } })}>NO</button>
          <button className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110
                               w-[120px] h-[40px] ml-10 shadow-xl bg-[#F29104] text-lg text-white rounded-lg'
            onClick={() => setConfirm(true)}>YES</button>
        </div>
      </div>
    )
  }

  //컴포넌트 : 룰렛
  const Roulette = () => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [stop, setStop] = useState(false);
    const [topic, setTopic] = useState('...');

    //객체 : 룰렛 데이터
    const data = [
      { id: 1, option: '반대' },
      { id: 2, option: '찬성' }
    ];

    //객체 : DB 컬렉션 네임
    const TopicName = {
      "과학과 기술": "과학",
      "경제와 비즈니스": "경제",
      "사회문제와 인권": "사회",
      "자연과 환경": "자연",
      "교육과 학습": "교육"
    }

    //함수 : 룰렛 돌리기
    const handleSpinClick = () => {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    };

    //함수 : 토론주제 갖고오기
    const getTopic = async () => {
      const db = firebase.firestore();
      const TopicRef = db.collection('DebateTopics').doc(`${TopicName[Category]}`);
      console.log('카테고리 : ' + TopicName[Category])

      //0부터 4사이의 랜덤 숫자 생성
      const RandomTopicNum = Math.floor(Math.random() * 5);

      try {
        await TopicRef.get().then((doc) => {
          const TopicName = doc.data()[Level][RandomTopicNum];
          setTopic(TopicName)
          console.log('토론주제 : ' + topic)
        })
      } catch (error) {
        console.log(error)
      }
    }

    //useEffect : 토론주제 갖고오기
    useEffect(() => {
      getTopic()
    }, [confirm])

    return (
      <>
        <div className="flex-col text-lg" align="center">
          <img className='w-[120px] h-[100px]' src={Character}></img>
          <div className="mt-8">오늘의 토론 주제는</div>
          <div className="text-orange-400 text-xl"> "{topic}"</div>
          <div>입니다.</div>
          {!stop && <br />}
          {!stop && <div>찬성 반대 입장을 정하겠습니다.</div>}
          {!stop && <div>룰렛을 돌려주세요!</div>}
          {!stop && <button className="button2 mt-8 w-[150px] h-[50px] text-xl text-white bg-orange-400 shadow-lg rounded-xl" onClick={handleSpinClick}>
            룰렛 돌리기
          </button>}
          <div className={`${!mustSpin ? 'hidden' : 'block'} absolute top-0 left-0 right-0 p-4 bg-white shadow-xl rounded-2xl`}>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              outerBorderColor={["#f2f2f2"]}
              outerBorderWidth={[20]}
              innerBorderColor={["#f2f2f2"]}
              radiusLineColor={["#dedede"]}
              radiusLineWidth={[20]}
              textColors={["#ffffff"]}
              fontSize={[50]}
              perpendicularText={[true]}
              backgroundColors={[
                "#F47C7C",
                "#7286D3"
              ]}
              onStopSpinning={() => {
                setMustSpin(false);
                setStop(true);
              }}
            />
          </div>
          <br />
          <div className='text-2xl text-orange-400'>
            {stop && !mustSpin ? user.displayName + "님은 " + data[prizeNumber].option + "입장입니다!" : ""}<br />
            {stop && <button className="button2 mt-8 w-[150px] h-[50px] text-xl text-white bg-orange-400 shadow-lg rounded-xl"
              onClick={() => { navigate('/chat', { state: { category: Category, position: data[prizeNumber].option, Level: Level, img: Character, Topic: topic } }) }}>토론 시작하기</button>}
          </div>
        </div>
      </>
    )
  }

  //화면 : Home
  return (
    <motion.div className='flex w-screen  items-center justify-center h-screen bg-white'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: -50, },
        visible: { opacity: 1, x: 0 }
      }}>
      <div className=' flex w-full bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
        <div className=' bg-[#f7ad3e] w-full p-2 justify-center items-center flex fixed top-0'>
          <div className='w-full md:w-[95%] bg-[#f7ad3e] p-3 rounded-xl flex justify-between gap-5 items-center'>
            <img className='w-9 h-8 hidden lg:block' src={Logo} />
            <div className='flex-1 text-lg md:text-xl text-white'>카테고리 : {Category}</div>
            <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
              onClick={() => navigate('/home')}
            >
              <FaHome className='w-8 h-7' />
            </button>
            {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
          </div>
          {isMenuToggled && (<MenuBar setModal={setIsMenuToggled} />)}

        </div>
        <div className=' relative w-5/6 mx-auto justify-center items-center'>
          {confirm ? <Roulette /> : <ConfirmMessage />}
        </div>
      </div>
    </motion.div>
  )
}

export default CategoryPage

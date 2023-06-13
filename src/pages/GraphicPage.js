import React, { useEffect, useState, useRef } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import { motion } from 'framer-motion'
import { firebase } from '../firebase'
import Chart, { Title } from 'chart.js/auto';
import { Button } from '@chatscope/chat-ui-kit-react'
import HereIcon from '../assets/touch-screen.png'


const options = [
  { value: 'Tutorial', label: '튜토리얼' },
  { value: 'Level_1', label: 'Level 1' },
  { value: 'Level_2', label: 'Level 2' },
  { value: 'Level_3', label: 'Level 3' },
];
const options_1 = [
  { value: '과학과 기술', label: '과학과 기술' },
  { value: '자연과 환경', label: '자연과 환경' },
  { value: '사회문제와 인권', label: '사회문제와 인권' },
  { value: '경제와 비즈니스', label: '경제와 비즈니스' },
  { value: '교육과 학습', label: '교육과 학습' },
];

function GraphicPage() {
  const { user } = UserAuth()
  const [isMenuToggled, setIsMenuToggled] = useState(false)
  const [data, setData] = useState([])


  //////Get score from firestore
  const [coins, setCoins] = useState()
  const db = firebase.firestore();

  useEffect(() => {
    const getinfo = db.collection("users").doc(user.uid)
    getinfo.onSnapshot((doc) => {
      if (doc.exists) {
        return setCoins(doc.data().Coins)
      }
    })

    setTimeout(function () {
      document.getElementById('forRender').click()
    }, 300);
  }, [])

  ///// Get Categorie 
  const BringGraph = async (Level, Categorie, isClear) => {
    if (isClear === true) {
      const db = firebase.firestore();
      const data = db.collection("users").doc(user.uid).collection(Level).doc(Categorie).collection(Categorie)

      await data.get().then((data) => {
        if (data.empty) {
          return setShow(true)
        } else {
          setShow(false)
          return setData(data.docs.map((doc) => doc.data()));
        }
      })

      OpenGraph(Level, Categorie)
    } else {
      setShow(true)
      setGrap(false)
    }
  }

  const OpenGraph = async (Level, Categorie, Title) => {
    const db = firebase.firestore();
    const data = db.collection("users").doc(user.uid).collection(Level).doc(Categorie).collection(Categorie).doc('Debate Updated')
    data.get()
      .then((doc) => {
        return setTitle(doc.data())
      })
    setGrap(true)
  }


  const [selectedOption, setSelectedOption] = useState('Tutorial');
  const [selectedOption_1, setSelectedOption_1] = useState(options_1[0].value);
  const [title, setTitle] = useState('Debate Updated');
  const [show, setShow] = useState(false)
  const [grap, setGrap] = useState(false)
  const [render, setRender] = useState(false)


  /////////
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setTimeout(function () {
      document.getElementById('forRender').click()
    }, 300);
    setShow(false)
  };
  const handleSelectChange_Option_1 = (event) => {
    setSelectedOption_1(event.target.value);
  };

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


  useEffect(() => {

    async function getIsClear() {
      topics.map(async function (element) {
        const isClearRef = db.collection('users').doc(user.uid).collection(selectedOption).doc(element).collection(element).doc('Debate Updated')

        await isClearRef.get()
          .then((doc) => {
            if (doc.exists) {
              let newIsClear = isClear
              newIsClear[element] = doc.data().isClear
              setIsClear(newIsClear)

              //카테고리 점수
              let newScore = score
              newScore[element] = doc.data().Score
              setScore(newScore)
            } else {
              let newIsClear = isClear
              newIsClear[element] = false
              setIsClear(newIsClear)
            }
          })
      })
    }

    getIsClear()
    console.log(selectedOption)
    console.log(isClear)

  }, [selectedOption])

  ///////////////////////////////
  ///////////////////////////////////////////

  const chartContainer = useRef(null);



  useEffect(() => {
    if (chartContainer && chartContainer.current) {

      const newChartInstance = new Chart(chartContainer.current, {
        type: "bar",
        data: {
          labels: ['논리력', '설득력', '표현력', '적극성', '경청자세'],
          datasets: [
            {
              label: title.Debate_Subject,
              data: [title.Score_Logic, title.Score_PerPower, title.Score_Express, title.Score_Positive, title.Score_ListPost],
              backgroundColor: ['#F7A4A4', '#FEBE8C', '#FFFBC1', '#B6E2A1', '#C3F8FF'],
              borderColor: "white",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 200,
            },
          },
        },
      });

      return () => {
        newChartInstance.destroy();
      };
    }
  }, [title, user.uid]);

  //컴포넌트 : 카테고리 버튼
  const Category = (props) => {

    //카테고리 점수에 따른 A~E 등급 이미지
    return (
      <button className={`w-[200px] h-[50px] xl:w-[180px] xl:h-[50px] lg:text-lg
                       transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110
                       border-2 border-inherit shadow-lg rounded-xl relative
                     ${props.isClear[props.category] === true ? `bg-[#FFFBC1] border-4` : 'bg-white'}`}

        onClick={() => {
          BringGraph(selectedOption, props.category, props.isClear[props.category])
        }}>
        {props.category}
        {props.isClear[props.category] && <img src={HereIcon} className='absolute -mt-12 ml-40
                                          xl:-mt-14 xl:ml-36
                                          w-[40px] h-[40px] 
                                          lg:w-[50px] lg:h-[50px]'/>}
      </button>
    )
  }
  const [forRender, setForRender] = useState(false)

  //그래픽 페이지 화면
  return (
    <motion.div className='flex w-screen  items-center justify-center h-screen bg-white overflow:visible'
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
      }}>
      <div className=' flex w-full bg-white mx-auto h-full items-center justify-center rounded-2xl gap-10 flex-col'>
        <div className=' bg-[#f7ad3e] w-full p-2 justify-center items-center flex'>
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
        <div className='w-5/6 mx-auto h-full mt-10 bg-white items-center flex flex-col gap-5 rounded-xl font-bold'>
          <label htmlFor="select-example" className='text-base lg:text-xl'>✨ 옵션을 선택하고 점수를 확인하세요! ✨</label>
          <select id="select-example" value={selectedOption} onChange={handleSelectChange} className='w-4/6 p-2 border-zinc-300 border-2 bg-white rounded-xl shadow-xl text-center text-lg hover:bg-[#ECF2FF]'>
            {options.map((option) => (
              <option className="border-1 border-inherit" selected='selected' key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button></button>
          <select hidden id="select-example" value={selectedOption_1} onChange={handleSelectChange_Option_1} className='w-5/6 bg-green-400 p-1 rounded-xl shadow-xl outline-none hover:bg-green-300'>
            {options_1.map((option) => (
              <option selected='selected' key={option.value} value={option.value}>{option.label} {isClear[option.label] === true ? "✅🟢⚪" : "❌"}</option>
            ))}
          </select>
          <div className='flex flex-col lg:flex-row gap-5'>
          <Category isClear={isClear} category="과학과 기술" />
          <Category isClear={isClear} category="자연과 환경" />
          <Category isClear={isClear} category="사회문제와 인권" />
          <Category isClear={isClear} category="경제와 비즈니스" />
          <Category isClear={isClear} category="교육과 학습" />
          </div>
          <div>
            <button hidden className='bg-orange-300 rounded-xl p-1 hover:bg-orange-200' onClick={() => BringGraph(selectedOption, selectedOption_1)}>그래프 보기</button>
          </div>

          <div className='w-full items-center flex gap-5 justify-center text-lg'>
            {show && <div>토론을 진행한 적이 없습니다 😺</div>}
          </div>

          <div className='w-5/6  flex mx-auto gap-10 items-center justify-center align-middle'>
            {/* {
              data.map((items,idx)=>(
                <div className='bg-gray-50 p-1 gap-5'>
                  <div className='text-center text-orange-400'>{items.Debate_Subject}</div>
                  <div className='mt-5'> 논리력:{items.Score_Logic}</div>
                  <div className='mt-5'> 설득력:{items.Score_PerPower}</div>
                  <div className='mt-5'> 표현력:{items.Score_Express}</div>
                  <div className='mt-5'> 적극성:{items.Score_Positive}</div>
                  <div className='mt-5'> 경청자세:{items.Score_Express}</div>
                  <div className='mt-10'> 총점수:{items.Score}</div>
                </div>


                
              ))
            }
            */}


            {grap === true && (<div className='-ml-5'>
              <canvas ref={chartContainer} className='w-[300px] h-[600px] lg:w-[800px]' />
            </div>)}
          </div>
          <button id='forRender' onClick={() => { setForRender(!forRender); }}></button>
        </div>
      </div>
    </motion.div>
  )
}

export default GraphicPage
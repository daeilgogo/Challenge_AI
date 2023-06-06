import React, { useEffect, useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars } from 'react-icons/fa'
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc'
import MenuBar from '../components/MenuBar'
import Level from '../components/Level'
import Kinder from "../assets/kinder.png"
import Elementary from "../assets/element.png"
import High from "../assets/high.png"
import Univ from "../assets/univ.png"
import { motion } from 'framer-motion'
import { firebase } from '../firebase'


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

   //// Send data to firebase:

   const [new_Score, setNew_Score] = useState(50)

   const Level_Done = (title) => {
      try {
         navigate('/chat', { state: { data: title } })
      } catch (error) {
         console.log(error)
      }
   }

   const [score, setScore] = useState(0);
   const [levelObj, setLevelObj] = useState({
      Level_1: 0,
      Level_2: 0,
      Level_3: 0
   });

   const levels = ["Level_1", "Level_2", "Level_3"]
   const topics = ["과학과 기술", "경제와 비즈니스", "사회문제와 인권", "자연과 환경", "교육과 학습"]
   const [totalScore, setTotalScore] = useState(0)
   
   //firestore에서 카테고리 클리어 여부 갖고오기
   // useEffect(() => {
   //    levels.map(async function (L_element) {
   //       topics.map(async function (element) {
   //          await db.collection('users').doc(user.uid).collection(L_element).doc(element).collection(element).doc('Debate Updated').get().then((doc)=>{
   //             if (doc.exists) {
   //                if(doc.data().isClear){
   //                   console.log('문서있음')
   //                   sum += 1;
   //                   console.log(sum)
   //                }
   //             } else {
                  
   //             }
   //          }).then(()=>{
   //             console.log('참조:'+sum)
   //          })
   //       })
   //       sum = 0;

   //       // let newlevelObj = { ...levelObj }
   //       // newlevelObj[L_element] = sum
   //       // setLevelObj(newlevelObj)
   //       // console.log(levelObj)

   //       // const ref = db.collection('users').doc(user.uid).set({
   //       //    isClear:{
   //       //       [L_element]: sum
   //       //    }
   //       // }, { merge: true });
   //    })

   // }, [user.uid])

   /////////////////Somme de tout les Score 


   const [data, setData] = useState([]);

   let Level_ = ['Level_1', 'Level_2', 'Level_3'];
   let Categorie = [
     '과학과 기술',
     '자연과 환경',
     '사회문제와 인권',
     '경제와 비즈니스',
     '교육과 학습',
   ];
 
   useEffect(() => {
     const fetchData = async () => {
       const promises = [];
 
       for (let i = 0; i < Level_.length; i++) {
         for (let j = 0; j < Categorie.length; j++) {
           const dataRef = db
             .collection('users')
             .doc(user.uid)
             .collection(Level_[i])
             .doc(Categorie[j])
             .collection(Categorie[j])
             .doc('Debate Updated');
 
           const promise = dataRef.get().then((snapshot) => {
             const score = snapshot.data()?.Score || 0;
             return score;
           });
 
           promises.push(promise);
         }
       }
 
       const results = await Promise.all(promises);
       const scoresSum = results.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
       setData(results);
       console.log(`Sum of all Scores: ${scoresSum}`);
     };
 
     fetchData();
   }, [user.uid]);








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


   //함수 : 모바일 화면에서 좌우 스크롤 버튼 (<, >)
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
            <div className='w-4/6 h-full bg-white justify-center items-center flex flex-row rounded-xl font-bold'>
               <div id='container' className='overflow-auto lg:overflow-visible whitespace-nowrap transition ease-in-out delay-150'>
                  {/* 모바일 스크롤 버튼 < */}
                  <VscChevronLeft className="absolute top-1/2 left-0 w-[40px] h-[40px] lg:hidden"
                     onClick={() => {
                        movePage("left")
                     }} />
                  <Level complete={true} name="Kinder" title="튜토리얼" content="유치원생 쿠룽이" src={Kinder}></Level>
                  <Level complete={true} name="Elementary" title={level.Level1} content="초등학생 쿠룽이" src={Elementary}></Level>
                  <Level complete={true} name="High" title={level.Level2} content="고등학생 쿠룽이" src={High}></Level>
                  <Level complete={true} name="Univ" title={level.Level3} content="대학생 쿠룽이" src={Univ}></Level>
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

import React, {useEffect, useState,useRef} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import { motion } from 'framer-motion'
import {firebase} from '../firebase'
import Chart from 'chart.js/auto';
import GitHubContributionsGraph from '../components/Confirmation'



const options = [
  { value: 'Level_1', label: 'Level 1' },
  { value: 'Level_2', label: 'Level 2' },
  { value: 'Level_3', label: 'Level 3' },
];
const options_1 = [
  { value: '과학과 기술', label: '과학과 기술' },
  { value: '자연과 환경', label: '자연과 환경' },
  { value: '사회문제와 인권', label: '사회문제와 인권' },
  { value: '경제와 비즈니스', label: '경제와 비즈니스' },
  { value: '교육과 학습', label: '교육과  학습' },
];

function GraphicPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
    const [data,setData]=useState([])

  

        //////Get score from firestore
        const [coins,setCoins]=useState()
        const db = firebase.firestore();
        useEffect(()=>{
          const getinfo = db.collection("users").doc(user.uid)
          getinfo.onSnapshot((doc)=>{
            if(doc.exists){
              return  setCoins(doc.data().Coins)
            }  
              })
          
        },[])
    ///// Get Categorie 
    const BringGraph =async(Level,Categorie) => {
      const db = firebase.firestore();
      const data =  db.collection("users").doc(user.uid).collection(Level).doc(Categorie).collection(Categorie)
      await data.get().then((data)=>{
      return setData(data.docs.map((doc) => doc.data()));
     }
     )
    }
//////////////////////////////////////////

const [selectedOption, setSelectedOption] = useState(options[0].value);
const [selectedOption_1, setSelectedOption_1] = useState(options[0].value);


const handleSelectChange = (event) => {
  setSelectedOption(event.target.value);
};
const handleSelectChange_Option_1 = (event) => {
  setSelectedOption_1(event.target.value);
};
 ///////////////////////////////
///////////////////////////////////////////

const chartContainer = useRef(null);



useEffect(() => {
  if (chartContainer && chartContainer.current) {
    const labels = data.map((item) => item.Debate_Subject);
    const values = data.map((item) => item.Score);
    const newChartInstance = new Chart(chartContainer.current, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: selectedOption_1,
            data: values,
            backgroundColor: ['green','orange','red','yellow'],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 100,
          },
        },
      },
    });

    return () => {
      newChartInstance.destroy();
    };
  }
}, [data]);


      
////////////////////


  return (
     <motion.div className='flex w-screen  items-center justify-center h-screen bg-white'
     initial='hidden'
     whileInView='visible'
     viewport={{once:true,amount:0.5}}
     transition={{duration:0.5}}
     variants={{
       hidden:{
           opacity:0, x:-50,
       },
       visible:{
           opacity:1, x:0
               
       }
     }}>
        <div  className=' flex w-full bg-white mx-auto h-full items-center justify-center rounded-2xl gap-10 flex-col'>
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
          <div className='w-5/6 mx-auto h-full bg-white justify-center items-center flex flex-col gap-5 rounded-xl font-bold'>
            <label htmlFor="select-example" className=''>옵션을 선택하세요:</label>
                <select id="select-example" value={selectedOption} onChange={handleSelectChange} className='w-5/6 bg-green-400 p-1 rounded-xl shadow-xl outline-none hover:bg-green-300'>
                     {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                   ))}
                </select>
                <select id="select-example" value={selectedOption_1} onChange={handleSelectChange_Option_1} className='w-5/6 bg-green-400 p-1 rounded-xl shadow-xl outline-none hover:bg-green-300'>
                     {options_1.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                   ))}
                </select>
            <div>
                <button className='bg-orange-300 rounded-xl p-1 hover:bg-orange-200' onClick={()=>BringGraph(selectedOption,selectedOption_1)}>그래프 보기</button>
            </div>
          
          <div className='w-4/6 h-4/6'>
           
            <div>
               <canvas ref={chartContainer} className=''/>
            </div>
           
          </div>
          
            
         
          
          <GitHubContributionsGraph/>

          </div> 
        </div>
    </motion.div>
  )
}

export default GraphicPage

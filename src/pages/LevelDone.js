import React, {useEffect, useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars,FaHome } from 'react-icons/fa'
import { motion } from 'framer-motion'
import {firebase} from '../firebase'
import { useLocation } from 'react-router-dom'


function LevelDone() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
    const navigate =useNavigate()
    const [modal,setModal]=useState(false)
    const location=useLocation()

    const src= location.state.src;
    const Level= location.state.Level;
    const Categorie= location.state.Categorie;
    

    //////Get score from firestore
   const [score, setScore]=useState('')
   const [points, setPoints]=useState('')

   useEffect(()=>{
  const db = firebase.firestore();

  const getinfo = db.collection("users")
   
  getinfo.orderBy('Score',"desc")
 .limit(10)
 .get()
    .then((querySnapshot) => {
     querySnapshot.forEach((doc)=>{
       return  setScore(doc.data())
     })
 
    });
   },[])

  const [data,setData]=useState()
  
 /// get data about title from firestore
 useEffect(()=>{
    const db = firebase.firestore();
    const getinfo = db.collection("users").doc(user.uid).collection(Level)
    getinfo.get().then(produit=>{
    return setData( produit.docs.map(doc=>doc.data()))
   })

 },[])


//  ///Get all score from firestore and calculate the total score.
//  useEffect(()=>{
//   const db=firebase.firestore()
//   const getScore = db.collection('users').doc(user.uid).collection(Level)
//   getScore.get().then(doc=>{return setPoints(doc.data())})
//  })

//  const CalculateScore=()=>{
//   var Score
//   for(var i=0;i<points.length;i++){
//      Score=(i.Score)++
//   }
//   return Score
//  }
   
   
    

  


  

  return (
  <motion.div className='flex w-screen  items-center justify-center h-screen bg-orange-300'
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
    <div className=' flex w-[95%] bg-white mx-auto h-[95%] items-center justify-center rounded-2xl 
    gap-10 flex-col'>
      <div className=' bg-orange-300 w-full p-2 justify-center items-center flex fixed top-0'>
        <div className='w-[95%] mx-auto bg-white p-3 rounded-xl font-bold flex justify-between gap-5 items-center'>
           
            <div className='flex gap-2'>
               <img alt='Coins' src={Coins}/>
               <div>{score.Score}</div>
            </div>
            <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
            onClick={()=>navigate('/home')}>
               <FaHome className='w-8 h-7'/>
            </button>
           
        </div>
      
        
      </div>
      <div className='w-5/6 mx-auto  bg-white justify-center items-center flex flex-col gap-5 rounded-xl text-sm'>
       
        <div className='text-2xl font-bold w-4/5 mx-auto text-center h-5/6 mt-6 '>{Level}</div>
          <div className='mb-5 p-2'>
             <img className='w-[150px] h-[150px]' src={src}/>  
          </div>  
          <div className='w-5/6 mx-auto gap-5 flex-col flex  p-2'>
            {
              data?.map((items,idx)=>(
                <div key={idx} className='flex mx-auto items-center gap-5  bg-orange-200 rounded-full w-5/6 justify-between font-bold text-xl shadow-xl'>
                   <div className=' w-4/6 mx-auto justify-center flex'>{items.Title}</div>
                      <div className='2/6 mx-auto flex'> 
                      
                   </div> 
                </div>

              ))
            }

            </div>
            {/* <div className='flex mx-auto items-center gap-5  bg-orange-50 rounded-full w-5/6 justify-between font-bold text-xl shadow-xl'>
                 <div className=' w-4/6 mx-auto justify-center flex'>사회문제와 환경 </div>
                 <div className='2/6 mx-auto flex'> 
                   <img className='w-10 h-10' src={B}/>
                 </div> 
            </div>
            <div className='flex mx-auto items-center gap-5  bg-orange-50 rounded-full w-5/6 justify-between font-bold text-xl shadow-xl'>
                 <div className=' w-4/6 mx-auto justify-center flex'>자연과 환경 </div>
                 <div className='2/6 mx-auto flex'> 
                   <img className='w-10 h-10' src={B}/>
                 </div> 
            </div>
            <div className='flex mx-auto items-center gap-5  bg-orange-50 rounded-full w-5/6 justify-between font-bold text-xl shadow-xl'>
                 <div className=' w-4/6 mx-auto justify-center flex'>경제와 비지니스</div>
                 <div className='2/6 mx-auto flex'> 
                   <img className='w-10 h-10' src={B}/>
                 </div> 
            </div>
            <div className='flex mx-auto items-center gap-5  bg-orange-50 rounded-full w-5/6 justify-between font-bold text-xl shadow-xl'>
                 <div className=' w-4/6 mx-auto justify-center flex'>교육과 학습</div>
                 <div className='2/6 mx-auto flex'> 
                   <img className='w-10 h-10' src={B}/>
                 </div> 
            </div> */}
        
      </div> 
    </div>
</motion.div>
  )
}

export default LevelDone

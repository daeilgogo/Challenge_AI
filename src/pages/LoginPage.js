import React, { useEffect,useState } from 'react'
import {GoogleButton} from 'react-google-button'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
function LoginPage() {
    
    const {googleSignIn,user}=UserAuth()
    const navigate=useNavigate()

    //define usesate of emailand password
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')


   //define a function to handle the Login button
    const handleSignIn=async()=>{
        try {
            await googleSignIn()
        } catch (error) {
            console.log(error)
        }
    }

    // define useEffect to manage the user when he login

    useEffect(()=>{
        if(user!=null){
           navigate('/home')
        }
     },[user])

    return (

    <div className='flex w-screen  items-center justify-center h-screen bg-orange-300 '>
        <div className=' flex w-5/6 lg:w-3/6 bg-white  h-5/6 items-center justify-center shadow-2xl rounded-2xl 
        gap-10 flex-col'>
            <div className='  justify-center items-center flex '>
               <img src={Logo}/>
            </div>
            {/* <div className='flex flex-col  gap-3 w-4/6 mt-5'>
              <input placeholder='이메일' 
              type='email'
              className='bg-white rounded-xl p-3 shadow-xl outline-none text-sm'/>
              <input placeholder='비밀번호'
              onChange={(e)=>setEmail(e.target.value)}
              type='password'
               className='bg-white rounded-xl p-3 shadow-xl outline-none'/>
               <button className='border-orange-300 rounded-xl mt-5 border-2
               w-4/6 mx-auto p-2 font-bold  hover:bg-orange-300 hover:text-white'>로그인</button>
               <div className='flex  w-5/6 mx-auto mt-2 text-sm text-center justify-center'>
                <button className='  hover:text-orange-300'>비밀번호 찾기 / </button>
                <button className='ml-2  hover:text-orange-300' onClick={()=> navigate('/register')}>가입</button>
               </div>
            </div> */}

            <div className='text-center'>
                <div className='text-lg md:text-2xl lg:text-2xl'>DebateMate에 오신걸 환영합니다!</div><br/>
                <div className='text-sm md:text-sm lg:text-base text-gray-500'>진행을 위해 구글계정으로 로그인 해주세요</div>
            </div>
            <GoogleButton onClick={handleSignIn} className='p -mt-5'/>
        </div>
        

    </div>
  )
}

export default LoginPage

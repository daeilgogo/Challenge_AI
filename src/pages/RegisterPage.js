// import React, { useEffect,useState } from 'react'
// import { UserAuth } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'
// import Logo from '../assets/logo.png'


// function RegisterPage() {
    
//     const {googleSignIn,user}=UserAuth()
//     //initialize useNavigate
//     const navigate=useNavigate()

//      //define usesate of name, email and password
//      const [name,setName]=useState('')
//      const [email,setEmail]=useState('')
//      const [password,setPassword]=useState('')
 

//     const handleSignIn=async()=>{
//         try {
//             await googleSignIn()
//         } catch (error) {
//             console.log(error)
//         }
//     }
//  useEffect(()=>{
//      if(user!=null){
//        navigate('/home')
//     }
//   },[user])

//     return (

//     <div className='flex w-screen  items-center justify-center h-screen bg-orange-300'>
//         <div className=' flex w-3/6 bg-white mx-auto shadow-2xl h-5/6 items-center justify-center rounded-2xl 
//         gap-10 flex-col'>
//             <div className='  justify-center items-center flex '>
//                <img src={Logo}/>
//             </div>
//             <div className='flex flex-col  gap-3 w-4/6 mt-5'>
            
//             <input placeholder='이름' 
//               type='text'
//               onChange={(e)=>setName(e.target.value)}
//               className='bg-white rounded-xl p-3 shadow-xl outline-none text-sm'/>
              
              
//             <input placeholder='이메일' 
//               type='email'
//               onChange={(e)=>setEmail(e.target.value)}
//               className='bg-white rounded-xl p-3 shadow-xl outline-none text-sm'/>
              
              
//             <input placeholder='비밀번호'
//               type='password'
//               onClick={(e)=>setPassword(e.target.value)}
//                className='bg-white rounded-xl p-3 shadow-xl outline-none'/>
//                <button className='border-orange-300 rounded-xl mt-5 border-2
//                w-4/6 mx-auto p-2 font-bold  hover:bg-orange-300 hover:text-white' onClick={()=>navigate('/')}>가입</button>
//                <div className='flex  w-5/6 mx-auto mt-2 text-sm text-center justify-center'>
//                <button className='  hover:text-orange-300'>비밀번호 찾기/ </button>
//                 <button className='ml-2  hover:text-orange-300' onClick={()=> navigate('/')}>로그인</button>
//                </div>
//             </div>
       
//         </div>
        

//     </div>
//   )
// }

// export default RegisterPage

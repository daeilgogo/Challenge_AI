import React, { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import TabBar from '../components/tabBar'
import Level from '../components/Level'
import Kinder from "../assets/kinder.png"
import Elementary from "../assets/element.png"
import High from "../assets/high.png"

function CategoryPage() {
  const { user } = UserAuth()
  const [isMenuToggled, setIsMenuToggled] = useState(false)
  const navigate = useNavigate()
  
  //파라미터 : 이미지 주소 갖고오기
  const location = useLocation()
  const image = location.state.src

  //컴포넌트 : 카테고리 버튼
  const Category = (props) => {
    return (
      <button className='w-[200px] h-[50px] xl:w-[180px] xl:h-[150px] lg:text-lg
                         transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110
                       bg-white border-2 border-inherit shadow-lg rounded-xl'
        onClick={() => { navigate('/setting',{state : {category : props.category, character: image}})}}>
        {props.category}
      </button>
    )
  }

  //화면 : CategoryPage
  return (
    <div className='flex w-screen  items-center justify-center h-screen bg-orange-300'>
      <div className=' flex w-5/6 bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
        <div className=' bg-orange-300 w-full p-2 justify-center items-center flex fixed top-0'>
          <div className='w-5/6 mx-auto bg-white p-3 rounded-xl font-bold flex justify-between gap-5 items-center'>
            <img className='w-9 h-8' src={Logo} />
            <div className='flex-1 text-white md:text-black'>  도전하나요 , {user.displayName}</div>
            <div className='flex gap-2'>
              <img alt='Coins' src={Coins} />
              <div>2500</div>
            </div>
            <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
              onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <FaBars className='w-8 h-7' />
            </button>
            {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
          </div>
          {isMenuToggled && (<MenuBar />)}

        </div>
        <div className='w-5/6 h-5/6 bg-white rounded-xl font-bold'>
          <div className='p-8 gap-2 overflow-auto justify-center items-center flex flex-wrap'>
            <img className='w-[180px] h-[150px]' src={image}></img>
            <div className='hidden md:block basis-full'></div>
            <div className='hidden lg:block mt-2 text-2xl'>원하는 토론 주제를 골라주세요!</div>
            <div className='basis-full lg:p-2'></div>
            <Category category="과학과 기술" />
            <Category category="사회문제와 인권" />
            <Category category="자연과 환경" />
            <Category category="경제와 비즈니스" />
            <Category category="교육과 학습" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage

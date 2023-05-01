import React from 'react'

const DebateOrder = {
    subject1: '찬성측 입론',
    subject2: '반대측 질의 및 찬성측 답변',
    subject3: '반대측 입론',
    subject4: '찬성측 질의 및 반대측 답변',
    subject5: '찬성측 반론',
    subject6: '반대측 반론'
  }

function debateState() {
  return (
      <div className='bg-white w-5/6 h-full flex  flex-1 justify-center  mr-2 items-center'>
          <div className='p-2 bg-gray-200 rounded-xl'>완료됌</div>
          <div className='p-0.5 w-6 bg-gray-200 h-1/6'></div>
          <div className='p-1.5 bg-gray-200 rounded-full'></div>
          <div className='p-2 bg-orange-300 rounded-xl'> 진행중</div>
          <div className='p-0.5 w-6  h-1/6 bg-orange-300'></div>
          <div className='p-1.5 bg-orange-300  rounded-full'></div>
          <div className='p-2 bg-gray-200 rounded-xl'> 다음거</div>
    </div>
  )
}

export default debateState

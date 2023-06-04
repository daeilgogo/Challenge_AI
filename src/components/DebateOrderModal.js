import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

function DebateOrderModal({ setOpenDebateOrder, USER_POSITION, CHAT_POSITION }) {
    const { user } = UserAuth()
    const navigate = useNavigate()
    return (
        <div className='justify-center flex'>
            <div className='flex h-full w-full fixed items-center justify-center opacity-80 bg-orange-100 top-0 left-0'></div>
            <motion.div className='flex  border-2 border-slate-100 fixed p-2 bg-white mx-auto w-4/6 h-3/6 lg:h-4/6 rounded-3xl text-center
       shadow-2xl items-center justify-center'
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

                <div className='flex flex-col w-5/6 gap-3  mx-auto  h-5/6 my-auto justify-center items-center'>
                    <div className="text-lg mt-3">토론순서입니다 😺</div>
                    <div className="text-md mb-3">{user.displayName}님은 {USER_POSITION}측이에요 😎</div>
                    <table class="tg table-auto border-collapse border border-slate-100 w-full lg:w-4/6">
                        <thead>
                            <tr>
                                <th colspan="2" class="border bg-slate-300 border-slate-300 tg-0pky">토론순서</th>
                                <th class="border bg-slate-300 border-slate-300 tg-0pky">시간제한</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border bg-slate-100 border-slate-300 tg-0pky">{CHAT_POSITION} 입론</td>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border border-slate-300 tg-0pky">3분</td>
                            </tr>
                            <tr>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border bg-orange-100 border-slate-300 tg-0pky">{USER_POSITION} 질문</td>
                                <td class="border border-slate-300 tg-0pky">1분</td>
                            </tr>
                            <tr>
                                <td class="border bg-slate-100 border-slate-300 tg-0pky">{CHAT_POSITION} 답변</td>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border border-slate-300 tg-0pky">1분</td>
                            </tr>
                            <tr>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border bg-orange-100 border-slate-300 tg-0pky">{USER_POSITION} 입론</td>
                                <td class="border border-slate-300 tg-0pky">3분</td>
                            </tr>
                            <tr>
                                <td class="border bg-slate-100 border-slate-300 tg-0pky">{CHAT_POSITION} 질문</td>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border border-slate-300 tg-0pky">1분</td>
                            </tr>
                            <tr>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border bg-orange-100 border-slate-300 tg-0pky">{USER_POSITION} 답변</td>
                                <td class="border border-slate-300 tg-0pky">1분</td>
                            </tr>
                            <tr>
                                <td class="border bg-slate-100 border-slate-300 tg-0pky">{CHAT_POSITION} 반론</td>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border border-slate-300 tg-0pky">3분</td>
                            </tr>
                            <tr>
                                <td class="border border-slate-300 tg-0pky"></td>
                                <td class="border bg-orange-100 border-slate-300 tg-0lax">{USER_POSITION} 반론</td>
                                <td class="border border-slate-300 tg-0lax">3분</td>
                            </tr>
                            <tr>
                                <td colspan='2' class="border border-slate-300 tg-0lax">평가</td>
                                <td class="border border-slate-300 tg-0lax">-</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className='w-[80px] mt-5 mb-3 p-1 rounded-xl text-lg bg-orange-300 text-white' onClick={() => { setOpenDebateOrder(false) }}>닫기</button>
                </div>
            </motion.div>
        </div>
    )
}

export default DebateOrderModal

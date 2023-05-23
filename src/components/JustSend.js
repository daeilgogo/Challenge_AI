import React, { useState,useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {firebase} from '../firebase'
import { UserAuth } from '../context/AuthContext'


function JustSend() {



   
  return (
    <div className='justify-center flex' >
      <div  className='flex h-10 w-5/6 fixed items-center justify-center opacity-10 bg-orange-100 top-[83%] left-15 p-2 rounded-xl'></div>
  </div>
  )
}

export default JustSend

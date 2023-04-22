import React,{useState,useEffect, useRef} from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const red= '#f54e4e'
const green='#4aec8c'

function Timer(props) {



  return (
    <div className='w-[95%] mx-auto bg-white flex justify-center items-center'>
        <div className='flex w-full justify-between items-center h-5/6 bg-white gap-5'>
          <div>
            <CircularProgressbar  text={props.minutes+':'+ props.seconds} 
                 value={props.percentage}
                 className='w-20 h-20 p-1 ' styles={buildStyles({
                  pathColor:props.setcolor,
                  trailColor:'#CCCBCA',
            })}/>

          </div>
        </div>
        
    </div>
  )
}

export default Timer

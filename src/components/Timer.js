import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function Timer(props) {
  return (
    <div className='w-[70px] h-[70px] bg-white flex justify-center items-center'>
        <div className='flex items-center h-5/6 bg-white'>
          <div>
            <CircularProgressbar  text={props.minutes+':'+ props.seconds} 
                 value={props.percentage}
                 className='p-1' styles={buildStyles({
                  pathColor:props.setcolor,
                  trailColor:'#CCCBCA',
            })}/>
          </div>
        </div>
    </div>
  )
}

export default Timer

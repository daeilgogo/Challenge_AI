import React,{useState,useEffect, useRef} from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const red= '#f54e4e'
const green='#4aec8c'

function Timer() {

    
  const [minute,setMinute]=useState(2);
  const [mode, setMode] = useState('work'); 
  
//useEffect 

const [secondsLeft, setSecondsLeft] = useState(0);

const secondsLeftRef = useRef(secondsLeft);
const modeRef = useRef(mode);


function tick() {
  secondsLeftRef.current--;
  setSecondsLeft(secondsLeftRef.current);
}
 

useEffect(() => {


    function switchMode() {
        const nextMode = 'work'
        const nextSeconds =  minute  * 60 
  
        setMode(nextMode);
        modeRef.current = nextMode;
  
        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
      }
 

    secondsLeftRef.current = minute* 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      
        if (secondsLeftRef.current === 0) {
            return switchMode();
          }
        tick();
      },1000);

    

      return () => clearInterval(interval);
    
  }, []);


 
  const totalSeconds = minute*60
  const percentage = Math.round(secondsLeft / totalSeconds * 100);

  var minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if(minutes < 10){minutes='0'+minutes};
  if(seconds < 10){seconds = '0'+seconds};
  

  var setcolor
  
  if(minutes<=(minutes/2)){
  setcolor='#CC2A0B'
  }else{
  setcolor='#4BCC0B'
  }


  return (
    <div className='w-[95%] mx-auto bg-white flex justify-center items-center'>
        <div className='flex w-full justify-between items-center h-5/6 bg-white gap-5'>
          <div>
            <CircularProgressbar  text={minutes+':'+seconds} 
                 value={percentage}
                 className='w-20 h-20 p-1 ' styles={buildStyles({
                  pathColor:setcolor,
                  trailColor:'#CCCBCA',
            })}/>

          </div>
      
           <div className='bg-white w-5/6 h-full flex  flex-1 justify-center  mr-2 items-center'> 
             <div className='p-2 bg-orange-300 rounded-xl'>
                잔송합니다
             </div>
             <div className='border-4 w-6 border-black h-1/6'></div>
             <div className='p-2 bg-orange-300 rounded-xl'>
                잔송합니다
             </div>
             <div className='border-4 w-6 border-black h-1/6'></div>
             <div className='p-2 bg-orange-300 rounded-xl'>
                잔송합니다
             </div>
             
           </div>

        </div>
        
    </div>
  )
}

export default Timer

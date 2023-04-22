import { useState, useEffect,useRef} from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Timer from '../components/Timer';
import {firebase} from '../firebase'
import ModalScore from '../components/ModalScore';
import { useAsyncError } from 'react-router-dom';



const API_KEY = "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";

///Choose side

// "Explain things like you would to a 10 year old learning how to code."



function ChatBot(props) {
  
  const [messages, setMessages] = useState([
    {
      message: "안녕하세요 오늘의 토론주제의 카테고리는  "+props.categorie+" 입니다.\n\n찬성과 반대를 정하겠습니다. 저는 200글자 이내로 대답하겠습니다.", // ChatGPT가 인사하는 메시지
      sentTime: "just now", // 메시지가 보내진 시간
      sender: "Randa" // 메시지를 보낸 사용자
    }
  ]);

  const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
    "role": "system", "content": "you are the full assistent ",
    "role": "system", "content": "after concluded the debate don't answer any message from the user",
    "role": "system", "content": "When you are answering to the user you should complete your sentences and do not pass 200 caracters",
    "role": "assistant", "content": "Apres que l'utilisateur aie choisi sa postion,il faut lui propose un sujet de debat base sur  "+props.categorie+"et  vous pouvez commencez le debat en lui posant des question"
   
   
   
  }


  const [isTyping, setIsTyping] = useState(false); // 사용자가 메시지를 입력 중인지 여부

  const handleSend = async (message) => { // 메시지를 보내는 함수
    //var m = message+"200글자 이내로 대답해줘"
    const newMessage = {
      message, // 보낼 메시지
      direction: 'outgoing', // 메시지의 방향 (outgoing: 보내는 메시지, incoming: 받는 메시지)
      sender: "user", // 메시지를 보낸 사용자
     
    };
    
    

    
    
    const newMessages = [...messages, newMessage];
    
    console.log(message);
    console.log(newMessages);
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    setMinutes(minutes)
    setSeconds(seconds)
    
   
    
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat
    // 메시지는 메시지 배열입니다.
    // chatGPT API용 메시지 형식 지정
    // API는 { role: "user" 또는 "assistant", "content": "message here"} 형식의 개체를 예상합니다.
    // 따라서 다시 포맷해야 합니다.

    let apiMessages = chatMessages.map((messageObject) => { // chatMessages 배열의 모든 요소에 대해 반복문 실행
      let role = ""; // role 변수 초기화
      if (messageObject.sender === "Randa") { // 만약 sender가 "ChatGPT"이면
        role = "assistant"; // role 변수에 "assistant" 할당
      } else { // 그렇지 않으면
        role = "user"; // role 변수에 "user" 할당
      }
      return { role: role, content: messageObject.message } // role과 messageObject.message를 가진 객체 반환
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    
    // 사용하려는 모델로 설정된 요청 본문을 가져옵니다.
    // 그리고 위에서 포맷한 메시지. 앞에 시스템 메시지를 추가합니다.
    // chatGPT의 작동 방식을 결정합니다.
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // 시스템 메시지는 chatGPT의 논리를 정의합니다
        ...apiMessages // ChatGPT와의 채팅 메시지
      ]
    }

   
await fetch("https://api.openai.com/v1/chat/completions", 
{
  method: "POST",
  headers: {
    "Authorization": "Bearer " + API_KEY, // API_KEY를 Authorization 헤더에 추가
    "Content-Type": "application/json", // JSON 형식으로 요청을 보냄
    
  },
  body: JSON.stringify(apiRequestBody) // 요청 바디에 apiRequestBody를 JSON 형식으로 추가
}).then((data) => {
  return data.json(); // 응답 데이터를 JSON 형식으로 변환하여 반환
}).then((data) => {
  //console.log(data); // 응답 데이터를 콘솔에 출력
  setMessages([...chatMessages, {
    message: data.choices[0].message.content, // 응답 데이터에서 메시지 내용을 추출하여 chatMessages 배열에 추가
    sender: "Randa"
  }]);
  setIsTyping(false); // 타이핑 중인 상태를 false로 변경
  if(isTyping===false){
      setSeconds(sdc)
        setMinutes(min)
        setState(state+1)
  }
});
  }


    ///// Set Timer 
  
   var min =2
   var sdc=30
  const [seconds, setSeconds] = useState(sdc);
  const [minutes, setMinutes] = useState(min);
  const [done,setDone]=useState(false)
  const [state,setState]=useState(1)

  ////done page open 

  
   

  
  useEffect(() => {
    const countdown = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        setSeconds(sdc)
        setMinutes(min)
        setState(state+1)
          if(state===4){
            setDone(!done);
            clearInterval(countdown)
        } 
      }
    
    }, 1000);
   
    return () => clearInterval(countdown);
    
  }, [seconds, minutes]);


 const totalSeconds= (min*60)+sdc
 const totalSecondLeft=(minutes*60)+seconds
 const percentage=Math.round((totalSecondLeft/totalSeconds)*100)
  

 var setcolor
    
 if(minutes<=(minutes/2)){
 setcolor='#CC2A0B'
 }else{
 setcolor='#4BCC0B'
 }
 let  second = ''
 let  minute=''
 if(minutes<10){
   minute ='0'+minutes
 }
 else{
  minute =minutes
 }
 if(seconds<10){
   second ='0'+seconds
 }else{
  second =seconds
 }
  

  return (
    <div className='w-[95%] h-4/6 fixed mt-1'>
            <div className='flex  items-center justify-center  w-full gap-4'>
              <div className=''>{isTyping? (<><Timer minutes={0} seconds={0} percentage={0}/></>):(<Timer minutes={minute} seconds={second} percentage={percentage} setcolor={setcolor}/>)}</div>
              <div className='bg-white w-5/6 h-full flex  flex-1 justify-center  mr-2 items-center'> 
               {state===1 && ( <div className='p-2 bg-orange-300 rounded-xl'>
                {props.position}합니다
               </div>)}
               {state>1 && (<div className='p-1 bg-gray-200 rounded-xl'>
               완료됨
               </div>)}
               <div className='border-4 w-6 border-black h-1/6 bg-black'></div>
               {state===2 &&  (<div className='p-2 bg-orange-300 rounded-xl'>
                답성하세요
               </div>)}
               {state>2 &&(<div className='p-1 bg-gray-200 rounded-xl'>
               완료됨
               </div>)}
               <div className='border-4 w-6 border-black h-1/6 bg-black'></div>
               {state===3 && (<div className='p-2 bg-orange-300 rounded-xl'>
                잔송합니다
               </div>)}
               {state>3 &&(<div className='p-1 bg-gray-200 rounded-xl'>
                완료됨
               </div>)}
               <div className='border-4 w-6 border-black h-1/6 bg-black'></div>
               {state > 3 && (<div className='p-2 bg-orange-300 rounded-xl'>
                끝났습니다
               </div>)}
             
              </div>
             </div>
      <div className='w-[95%] h-4/6  fixed'>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Randa is typing" /> : null}
            >

              {messages.map((message, i) => {
                //console.log(message) // 메시지 출력
                return <Message key={i} model={message} /> // 메시지 출력
              })}
           
            </MessageList>
            <MessageInput placeholder="입력해 주세요" onSend={handleSend} /> 
          </ChatContainer>
        </MainContainer>
      </div>
      {done &&
            (<ModalScore props={props.src} points='80 점' level={props.Level} categorie={props.category} setModal={props.setScore}/>)
            }
    </div>
  )
}

export default ChatBot

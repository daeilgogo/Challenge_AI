import React, {useState} from 'react'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Coins from '../assets/coins.png'
import { FaBars, FaHome, } from 'react-icons/fa'
import MenuBar from '../components/MenuBar'
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "assistant는 대학교 4학년 수준의 토론능력을 가진다.",
  "role": "system", "content": "assistant는 200글자이내로 답변한다."
}

function ChatPage() {
    const {user}=UserAuth()
    const [isMenuToggled,setIsMenuToggled]=useState(false)
    const navigate =useNavigate()
    const [messages, setMessages] = useState([
        {
          
          message: "안녕하세요 오늘의 토론주제는 ''입니다.\n\n찬성과 반대를 정하겠습니다. 저는 200글자 이내로 대답하겠습니다.", // ChatGPT가 인사하는 메시지
          
          sentTime: "just now", // 메시지가 보내진 시간
          sender: "ChatGPT" // 메시지를 보낸 사용자
        }
      ]);
    
      const [isTyping, setIsTyping] = useState(false); // 사용자가 메시지를 입력 중인지 여부
    
      const handleSend = async (message) => { // 메시지를 보내는 함수
        //var m = message+"200글자 이내로 대답해줘"
        const newMessage = {
          message, // 보낼 메시지
          direction: 'outgoing', // 메시지의 방향 (outgoing: 보내는 메시지, incoming: 받는 메시지)
          sender: "user" // 메시지를 보낸 사용자
        };
        
        const newMessages = [...messages, newMessage];
        
        console.log(message);
        console.log(newMessages);
        setMessages(newMessages);
    
        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        setIsTyping(true);
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
          if (messageObject.sender === "ChatGPT") { // 만약 sender가 "ChatGPT"이면
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
        sender: "ChatGPT"
      }]);
      setIsTyping(false); // 타이핑 중인 상태를 false로 변경
    });
      }
  

 
  return (
     <div className='flex w-screen  items-center justify-center h-screen bg-orange-300'>
        <div className=' flex w-5/6 bg-white mx-auto h-5/6 items-center justify-center rounded-2xl 
        gap-10 flex-col'>
          <div className=' bg-orange-300 w-full p-2 justify-center items-center flex fixed top-0'>
            <div className='w-5/6 mx-auto bg-white p-3 rounded-xl font-bold flex justify-between gap-5 items-center'>
                <img className='w-9 h-8' src={Logo}/>
                <div className='flex-1'>  도전하나요 , {user.displayName}</div>
                <div className='flex gap-2'>
                   <img alt='Coins' src={Coins}/>
                   <div>2500</div>
                </div>
                <button className='border-orange-300 border-2 p-1 rounded-full hover:bg-orange-300 hover:text-white'
                onClick={()=>navigate('/home')}>
                   <FaHome className='w-8 h-7'/>
                </button>
                 {/* <button className='border-2 border-orange-300 rounded-xl p-1 hover:bg-orange-300 hover:text-white' onClick={handleLogout}>Log out</button> */}
            </div>
            {isMenuToggled && (<MenuBar/>)}
            
          </div>
          <div className='w-full mx-auto h-full bg-white justify-center items-center flex flex-col gap-5 rounded-xl text-sm'>
          <div className='w-full h-[90%] mt-2 '>
      <div className='w-full h-full'>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
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
    </div>
          </div> 
        </div>
    </div>
  )
}

export default ChatPage

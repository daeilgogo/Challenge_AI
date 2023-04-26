import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
var check = '초등학생';
var check2 = '찬성';
var check3 = '저는 어린아이라서';
var check4 = '의견의 50%는 억지'
var check5 = ['200글자 이내로 대답해줘','2'];
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": ` 당신은 ${check2}입장이고, 저는 ${check2 == '찬성'?'반대':'찬성'} 입장입니다.
  토론의 난이도 조절을 위해 저는 항상 ${check} 수준으로 말합니다. 
  당신은 항상"${check3}"라고 말을 시작해야 합니다. 또한 난이도 조절을 위해  ${check4}를 부를 수도 있습니다.
  ${check2} 입장에서 입론해주세요.`
  //"role": "system", "content": "."
 //"role": "assistant", "content": " 토론의 난이도 조절을 위해 당신은 항상 초등학생 저학년 수준으로말해야 합니다.",
  
}


  function ChatBot() { 
    const [messages, setMessages] = useState([
    {
      
      message: `지금부터 토론을 시작하겠습니다.주제는 "어른은 항상 정의롭다"입니다.`, 
      
      sentTime: "just now", // 메시지가 보내진 시간
      sender: "Randa" // 메시지를 보낸 사용자
    }
  ]);

  const [isTyping, setIsTyping] = useState(false); // 사용자가 메시지를 입력 중인지 여부

  const handleSend = async (message) => { // 메시지를 보내는 함수
    message+="200글자 이내로 대답해줘"
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
      if (messageObject.sender === "Randa") { // 만약 sender가 "Randa"이면
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
    // chatGPT의 작동 방식을 결정
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      //"Temperature" : 0.8,
      //max_tokens: 1000
      //max_tokens = 64
      //top_p = 1.0
      //best_of = 1
      //frequency_penalty = 0.0
      //presence_penalty = 0.0
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
});
  }


  return (
    <div className='w-full h-[100%] mt-1 '>
      <div className='w-full h-full'>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                message.message = message.message.replace(check5[0],'');

                return <Message  key={i} model={message} /> // 메시지 출력
              })}
            </MessageList>
            <MessageInput placeholder="입력해 주세요" onSend={handleSend} /> 
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default ChatBot

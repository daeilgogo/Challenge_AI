import { useState, useEffect, useRef } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.css?ver=1.1.6';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar } from '@chatscope/chat-ui-kit-react';
import Timer from '../components/Timer';
import { firebase } from '../firebase'
import ModalScore from '../components/ModalScore';
import WarningModal from '../components/WarningModal';
import { UserAuth } from '../context/AuthContext'


const API_KEY = "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";

///Choose side

// "Explain things like you would to a 10 year old learning how to code."
let DebateOrder_count = 1; //DebateOrder 인덱스에 활용됨.
let replace_switch = false; //뒷부분 지워주는 조건문 사용시 홀수번일때 true값으로 변함.

function ChatBot(props) {
  const chat_position = props.position == '찬성'?'반대':'찬성'; 


  const DebateOrder = {
    1: `${props.position}측 입론입니다. ${chat_position}측 입장에서 질의해주세요. `,
    3: `${props.position}측 답변입니다. ${chat_position}측 입장에서 입론해주세요.`,
    5: `${props.position}측 질의입니다. ${chat_position}측 입장에서 답변해주세요. `,
    7: `${props.position}측 반론입니다. ${chat_position}측 입장에서 반론해주세요.`,
    9: `${props.position}측 최종 반론입니다. 이제 토론의 사회자 입장에서 이 토론을 평가해주세요.
    토론의 평가는 아래의 각 항목에 대해 각각 20점 만점에 몇점인지 부여하고 총점을 매겨주세요.
    논리력: 토의주제에 대한 개인의 의견이 논리적으로 전개되고 있는가? 
    설득력: 개인의 주장이 설득력을 갖는가? 
    표현력: 자신의 생각을 바르게 설명하는가? 
    적극성: 토의의제에 적극적 동참하고 있는가?
    경청자세: 타인의 의견을 경청하고 있는가? 
    총점 100점 만점에 --점`
  }

  const level = new Map([
    ['Tutorial','유치원생'],
    ['Level_1','초등학생'],
    ['Level_2','고등학생'],
    ['Level_3','대학생']
  ])

  const level_control = new Map([
    ['Tutorial','억지를 50%정도 부려 말'],
    ['Level_1','어휘지식크기 30단어 사용해 말 '],
    ['Level_2','어휘지식크기 30단어 사용하고, 비전문가적인 말'],
    ['Level_3',`어휘지식크기 300단어 사용하고, 
                논리에 벗어나지 않는 말과 전문가적인 말`]
  ])

  const WordCounter_control = new Map([
    ['Tutorial','100글자'],
    ['Level_1','200글자'],
    ['Level_2','300글자'],
    ['Level_3','400글자']
  ])

  const { user } = UserAuth();
  const [messages, setMessages] = useState([
    {
      message: `안녕하세요! 오늘의 토론주제는  "${props.Topic}" 입니다.\n\n지금부터 토론을 시작하겠습니다! 🦊`, // ChatGPT가 인사하는 메시지
      sentTime: "just now", // 메시지가 보내진 시간
      sender: "Randa" // 메시지를 보낸 사용자
    }
  ]);

  const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
    "role": "system", "content": "you are the full assistent",
    "role": "system", "content": "after concluded the debate don't answer any message from the user",
    "role": "system", "content": "When you are answering to the user you should complete your sentences and do not pass 200 caracters",
    "role": "assistant", "content": "Apres que l'utilisateur aie choisi sa postion,il faut lui propose un sujet de debat base sur  " + props.categorie + "et  vous pouvez commencez le debat en lui posant des question",
    "role": "system", "content": ` 당신은 ${chat_position}입장이고, 상대방은 ${props.position} 입장입니다.
    토론의 난이도 조절을 위해 항상 ${level.get(props.Level)} 수준으로 말합니다. 
    당신은 난이도 조절을 위해  ${level_control.get(props.Level)}을 해야합니다.
    당신은 ${WordCounter_control.get(props.Level)} 이내로 대답해야합니다.
    ${chat_position} 입장에서 입론해주세요.`
  
  }

  const [isTyping, setIsTyping] = useState(false); // 사용자가 메시지를 입력 중인지 여부

  const handleSend = async (message) => { // 메시지를 보내는 함수
    message+=DebateOrder[DebateOrder_count];
    DebateOrder_count += 2; //뒷문장을 홀수번 인덱스로 만들어서 +2함.
    const newMessage = {
      message, // 보낼 메시지
      direction: 'outgoing', // 메시지의 방향 (outgoing: 보내는 메시지, incoming: 받는 메시지)
      sender: "user", // 메시지를 보낸 사용자
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    if (isTyping === true) {
      setSeconds(0)
      setMinutes(0)
    }
    setIsActive(true)

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
      });
    setIsActive(false)
  }


  ///// Set State 
  const [TimeState, setState] = useState(0)
  ////initialize timer
  var min = [0, 0, 0, 0, 0, 0, 0, 0]
  var sdc = [20, 20, 20, 20, 20, 20, 20,]
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  // when the the debate is done enable done
  const [done, setDone] = useState(false)
  const [doneButton, setDoneButton] = useState(false)

  /// Set active the timer
  const [isActive, setIsActive] = useState(false);
  //// initialise diffrentes Subject of the TimeState

  const KureungPosition = {

  }


  useEffect(() => {
    let countdown = null

    if (!isActive) {
      countdown = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);

        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);

        } else {
          if (TimeState >= 8) {
            setDone(true);
          } else if (TimeState >= 1) {
            handleSend(`${DebateOrder[TimeState]}: 의견을 쓰지 못했습니다.`)
          }
        }
      }, 1000);

    } else if (!isActive && seconds !== 0) {
      clearInterval(countdown)
    }

    return () => clearInterval(countdown);
  }, [seconds, minutes, isActive, done, TimeState]);

  useEffect(() => {
    if (!done) {
      setState(TimeState + 1)
      setMinutes(min[TimeState])
      setSeconds(sdc[TimeState])
      console.log("timestamp:" + TimeState + " debateState:" + DebateOrder[TimeState] + ' done:' + done)
    }
  }, [isActive])

  const totalSeconds = (min[TimeState] * 60) + sdc[TimeState]
  const totalSecondLeft = (minutes * 60) + seconds
  const percentage = Math.round((totalSecondLeft * 100) / totalSeconds)


  var setcolor

  if (minutes <= (minutes / 2)) {
    setcolor = '#CC2A0B'
  } else {
    setcolor = '#4BCC0B'
  }
  let second = ''
  let minute = ''
  if (minutes < 10) {
    minute = '0' + minutes
  }
  else {
    minute = minutes
  }
  if (seconds < 10) {
    second = '0' + seconds
  } else {
    second = seconds
  }



  return (
    <div className='w-[95%] h-4/6 fixed mt-1'>
      <div className='flex items-center justify-center w-full gap-4'>
        <div className=''><Timer minutes={minute} seconds={second} percentage={percentage} setcolor={setcolor} /></div>
        <div className='bg-white w-5/6 h-full flex  flex-1 justify-center  mr-2 items-center'>
          <div className='p-2 bg-gray-200 rounded-xl'>{DebateOrder[TimeState - 1]}</div>
          <div className='p-0.5 w-6 bg-gray-200 h-1/6'></div>
          <div className='p-1.5 bg-gray-200 rounded-full'></div>
          <div className='p-2 bg-orange-300 rounded-xl'>{DebateOrder[TimeState]}</div>
          <div className='p-0.5 w-6  h-1/6 bg-orange-300'></div>
          <div className='p-1.5 bg-orange-300  rounded-full'></div>
          <div className='p-2 bg-gray-200 rounded-xl'>{DebateOrder[TimeState + 1]}</div>
        </div>
      </div>
      <div className='w-[95%] h-4/6  fixed'>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="쿠룽이가 답변중이에요" /> : null}
            >
              
              {messages.map((message, i) => {
                //사용자 채팅창이 홀수번이기때문에 홀수번일때 true값으로 바꿈.
                if(i%2!==0){
                  replace_switch = true;
                }
                
                //채팅창 뒷부분 넣는거 지워주는 함수. 
                if(replace_switch == true){
                message.message = message.message.replace(DebateOrder[i],"");
                //console.log(message.message," ",message.message,i)
                replace_switch = false;
                }
                return (
                  <div>
                    <Message key={i} model={message} style={{ color: '' }}>
                      {message.sender === "Randa" ? <Avatar className='' src={props.src} name="Randa" /> : <Avatar src={user.photoURL} name="user" />}
                    </Message>
                  </div>
                )
              })}
              
              {/* 토론 끝내기 버튼 (클릭: 모달창 띄우기)*/}
              <div className='flex items-center justify-center'>
                {done && <button className="m-2 p-2 bg-orange-300 rounded-xl" onClick={() => { setDoneButton(true) }}>토론 끝내기</button>}
              </div>

            </MessageList>
            <MessageInput placeholder="입력해 주세요" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      {props.isModal && (<WarningModal setModal={props.Modal} />)}
      {doneButton && <ModalScore src={props.src} points='80 점' level={props.Level} category={props.category} setModal={props.setScore} />}
    </div>
  )
}

export default ChatBot

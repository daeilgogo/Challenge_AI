import { useState, useEffect, useRef } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.css?ver=1.1.6';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar } from '@chatscope/chat-ui-kit-react';
import Timer from '../components/Timer';
import { firebase } from '../firebase'
import ModalScore from '../components/ModalScore';
import WarningModal from '../components/WarningModal';
import { UserAuth } from '../context/AuthContext'
import BuyTime from '../components/BuyTime';
import Confirmation from '../components/Confirmation';



const API_KEY = "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";

///Choose side

// "Explain things like you would to a 10 year old learning how to code."



function ChatBot(props) {
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
    "role": "assistant", "content": "Posez des question a propos du sujet de debat a l'utilisateur",
    "role": "system", "content": "A la fin du debat, tu devra analyse le contenu du debat pour savoir si c'est logique ou pas et ensuite attribue une note sur 100 au user",
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
      });
    setIsActive(false)
    setState(TimeState + 1)
    setMinutes(min[TimeState])
    setSeconds(sdc[TimeState])
  }


  ///// Set State 
  const [TimeState, setState] = useState(0)
  ////initialize timer
  var min = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  var sdc = [30, 40, 20, 40, 30, 40, 40,40]
  const [seconds, setSeconds] = useState(sdc[TimeState]);
  const [minutes, setMinutes] = useState(min[TimeState]);
  const db = firebase.firestore()

  // when the the debate is done enable done
  const [done, setDone] = useState(false)
  const [doneButton, setDoneButton] = useState(false)

  /// Set active the timer
  const [isActive, setIsActive] = useState(false);
  //// initialise diffrentes Subject of the TimeState

  const KureungPosition = {

  }
  const DebateOrder = {
    0: '토론시작',
    1: `${props.position}측 입론`,
    2: '반대측 질의',
    3: '찬성측 답변',
    4: '반대측 입론',
    5: '찬성측 질의',
    6: '반대측 답변',
    7: '찬성측 반론',
    8: '반대측 반론',
    9: '토론끝'
  }
////Confirm to continue when time is finish or buy items.
const [confirm,setConfirm]=useState(false)
const [openBuyTime,setOpenBuyTime]=useState(false)
const [sendmessage,setSendmessage]=useState(false)

const HandleConfirmSubmit=(message)=>{
  // handleSend(`${message}: 의견을 쓰지 못했습니다.`)
  
  setConfirm(!confirm)
}
const HandleConfirmBuyTime=()=>{
  setOpenBuyTime(!openBuyTime)
  setConfirm(!confirm)
}
const GobackTo=()=>{
  setConfirm(true)
}
/////////////////////////////////// 


  useEffect(() => {
    let countdown = null

    if (!isActive) {
      countdown = setInterval((message) => {
        if (seconds > 0) {
          setSeconds(seconds - 1);

        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);

        } else {
          
            clearInterval(countdown)
            setConfirm(!confirm)
            setSendmessage(!sendmessage)

            
            if(TimeState>=8){
              setDone(true)
              clearInterval(countdown)
            }
        }
      }, 1000);

    } else if (!isActive && seconds !== 0) {
      clearInterval(countdown)
    }

    return () => clearInterval(countdown);
  }, [seconds, minutes, isActive, done, TimeState]);

  // ///////////////////
  // useEffect(() => {
  //   if (!done) {
  //     setState(TimeState + 1)
  //     setMinutes(min[TimeState])
  //     setSeconds(sdc[TimeState])
  //     console.log("timestamp:" + TimeState + " debateState:" + DebateOrder[TimeState] + ' done:' + done)
  //   }
  // }, [isActive])


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



  //////////////////////////Open level Done 
  const [newScore,setNewScore]=useState(85)
  
  const Level_Done= async()=>{
    try { const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid).collection(props.Level).doc(props.categorie).collection(props.categorie).doc(props.Topic)
        await userRef.set({
        Score:newScore,
        categorie:props.categorie,
        Debate_Subject:props.Topic,
        Message:messages,
       }, { merge: true });
       setDoneButton(true) 
      }
       catch(error){
        console.log(error)
       }
    }
//////////////// Le code qui Permet de gerer le temps achete
const [selectedValue, setSelectedValue] = useState('');
///////////////////////////////

const handleSelectChange = event => {
   setSelectedValue(event.target.value);
 };

 const [coins, setCoins]=useState('')
 useEffect(()=>{
   const getinfo = db.collection("users").doc(user.uid)
   getinfo.onSnapshot((doc)=>{
    if(doc.exists){
      return  setCoins(doc.data().Coins)
    }
        
       })
   
 },[user.uid])
 const HandleBuyTime =async()=>{
  const send= db.collection('users').doc(user.uid)
      switch (selectedValue) {
          case '2':

          if(coins===0 || coins<3){
              return   alert('Coins 부족합니다')
              
          }else if(coins>=3){
             await send.update({
                  Coins: coins-3,
              })
             setMinutes(0)
             setSeconds(30)
             alert('시간을 추가된 것 성공되었습니다 !')
             setOpenBuyTime(false)
             setSelectedValue('')
          }
          
         
           break;
          case '3':
           
          if(coins===0 || setCoins<5){
              return   alert('Coins 부족합니다')
          }else if(coins>=5){
            await send.update({
                  Coins: coins-5,
              })
              setMinutes(0)
              setSeconds(40)
              alert('시간을 추가된 것 성공되었습니다 !')
              setOpenBuyTime(false)
              setSelectedValue('')
          }
            break;
          case '5':

          if(coins===0 || coins<6){
              return   alert('Coins 부족합니다')
          }else if(coins>6){
            await send.update({
                  Coins: coins-6,
              })
              setMinutes(0)
              setSeconds(50)
              alert('시간을 추가된 것 성공되었습니다 !')
              setOpenBuyTime(false)
              setSelectedValue('')
          }
            break;
           default:
           return alert('시간을 선택하세요!!')
        }
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
                //console.log(message) // 메시지 출력
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
                {done && <button className="m-2 p-2 bg-orange-300 rounded-xl" onClick={() => {Level_Done() }}>토론 끝내기</button>}
              </div>

            </MessageList>
            {isTyping===true? (<MessageInput placeholder="입력해 주세요"/>):(<MessageInput placeholder="입력해 주세요" onSend={handleSend} />)}
            
          </ChatContainer>
        </MainContainer>
      </div>
      {props.isModal && (<WarningModal setModal={props.Modal} />)}
      {doneButton && <ModalScore src={props.src} points='80 점' level={props.Level} category={props.category} setModal={props.setScore} />}
      {openBuyTime && (<BuyTime value={selectedValue} onChange={handleSelectChange} setBuyTime={GobackTo} HandleBuyTime={HandleBuyTime} setOff={setOpenBuyTime}/>)}
      {confirm && (<Confirmation ConfirBuyTime={HandleConfirmBuyTime} ConfirmSubmit={HandleConfirmSubmit} />)}
    </div>
  )
}

export default ChatBot

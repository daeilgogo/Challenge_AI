import { useState, useEffect, useRef } from 'react'
import { firebase } from '../firebase'
import { UserAuth } from '../context/AuthContext'
import {
  MainContainer, ChatContainer, MessageList,
  Message, MessageInput, TypingIndicator, Avatar
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.css?ver=1.1.9';
//import { Prompt_Debate_Order, Prompt_Debate_Command } from '../components/Prompts';
import Timer from '../components/Timer';
import BuyTime from '../components/BuyTime';
import ModalScore from '../components/ModalScore';
import Confirmation from '../components/Confirmation';
import WarningModal from '../components/WarningModal';
import DebateOrderModal from '../components/DebateOrderModal'


const API_KEY = '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'
const db = firebase.firestore()

//*Variables*//
let DebateOrder_count = 0;   //DebateOrder 인덱스
let replace_switch = false;  //중간 프롬프트 삭제 여부

let match = '0'
let matchLogic = 0;
let matchPerPower = 0;
let matchExpress = 0;
let matchPositive = 0;
let matchListPost = 0;

var minus = 0
var finalScore = 0
var count = 0 // 메시지를 못보낸 순간

//DB에서 가져온 프롬프트들을 저장할 변수
let COMMON_PROMPT = '';
let LEVEL_PROMPT_EDUCATION = '';
let LEVEL_PROMPT_EXAMPLE = '';
let LEVEL_PROMPT_MAXWORD = '';

//클리어 점수 기준
const StandardOfClear = {
  'Tutorial': 100,
  'Level_1': 700,
  'Level_2': 800,
  'Level_3': 900
}

//코인 부여 기준 (총점수에서 나누는 정수)
const StandardOfCoin = {
  'Tutorial': 20,
  'Level_1': 15,
  'Level_2': 10,
  'Level_3': 5
}


function ChatBot(props) {

  const { user } = UserAuth();

  //토론 정보 프로퍼티로 받아오기
  const DEBATE_TOPIC = props.Topic;     //토론 주제
  const DEBATE_LEVEL = props.Level;     //토론 난이도
  const USER_POSITION = props.position; //유저 입장
  const CHAT_POSITION = USER_POSITION   //GPT 입장
    == '찬성' ? '반대' : '찬성';

  //토론 순서
  const DebateOrder = {
    0: `토론 준비`,
    1: `${CHAT_POSITION} 입론`,
    2: `${USER_POSITION} 질의`,
    3: `${CHAT_POSITION} 답변`,
    4: `${USER_POSITION} 입론`,
    5: `${CHAT_POSITION} 질의`,
    6: `${USER_POSITION} 답변`,
    7: `${CHAT_POSITION} 반론`,
    8: `${USER_POSITION} 반론`,
    9: '평가',
  }

  //토론 설정에 따른 프롬프트 받아오기
  useEffect(() => {
    DebateOrder_count = 0; //렌더링 시 변수 초기화
    const CommonPromptRef = db.collection('Prompts').doc('CommonPrompt')
    const LevelPromptRef = db.collection('Prompts').doc(DEBATE_LEVEL)

    //난이도별 프롬프트
    LevelPromptRef.onSnapshot((doc) => {
      if (doc.exists) {
        LEVEL_PROMPT_EDUCATION = doc.data().P_education
        LEVEL_PROMPT_EXAMPLE = doc.data().P_example
        LEVEL_PROMPT_MAXWORD = doc.data().P_maxword

        console.log("학력:" + LEVEL_PROMPT_EDUCATION + "\n예시:" + LEVEL_PROMPT_EXAMPLE + "\n최대단어:" + LEVEL_PROMPT_MAXWORD)
      } else {
        console.log('fail with get level data')
      }
    })

    //공통 프롬프트
    CommonPromptRef.onSnapshot((doc) => {
      if (doc.exists) {
        COMMON_PROMPT = doc.data().P_command

        //프롬프트에 난이도, 입장 정보 넣기
        COMMON_PROMPT.map((data, i) => {
          COMMON_PROMPT[i] = data.replace(/학력/g, LEVEL_PROMPT_EDUCATION);
          COMMON_PROMPT[i] = COMMON_PROMPT[i].replace(/쿠룽이입장/g, CHAT_POSITION);
          COMMON_PROMPT[i] = COMMON_PROMPT[i].replace(/사용자입장/g, USER_POSITION);
          COMMON_PROMPT[i] = COMMON_PROMPT[i].replace(/\\n/g, "\n")
        })
        console.log(COMMON_PROMPT)
      } else {
        console.log('fail with get common data')
      }
    })
  }, [])

  //////////////////////
  ///CHATGPT HANDLING///
  //////////////////////

  //[Object] system message for ChatGPT
  const systemMessage = {
    "role": "system",
    "content":
      `지금부터 토론을 시작합니다. 당신은 ${LEVEL_PROMPT_EDUCATION} 토론자입니다. 따라서 다음과 같이 발언합니다.
     \n\n--------------------------------------------
     \n<${LEVEL_PROMPT_EDUCATION} 입장의 토론자 발언 예시>
     \n ${LEVEL_PROMPT_EXAMPLE}
     
     \n\n오늘의 토론 주제는 <b>"${DEBATE_TOPIC}"</b>입니다. 
     \n  당신은 토론 주제에 대해 ${CHAT_POSITION} 입장이고, 상대방은 ${USER_POSITION} 입장입니다.
     \n  단, 발언할 때 ***항상 ${LEVEL_PROMPT_MAXWORD}이내로 말해주세요.***
     \n  만약 상대방이 '의견을 입력하지 못했습니다'라고 말하면 상대방이 시간초과로 의견을 입력하지 못한 것이므로, 
         정해진 순서대로 토론을 진행해주세요.`
  }

  //[Object] state for save the messages
  const [messages, setMessages] = useState([
    {
      message: `안녕하세요! 저는 ${LEVEL_PROMPT_EDUCATION} 쿠룽이입니다. 🦊\n
오늘의 토론주제는 <b>"${DEBATE_TOPIC}"</b> 입니다. 
저는 ${CHAT_POSITION}측이고, <b>${user.displayName}님은 ${USER_POSITION}측</b>입니다.\n
▪️ 토론은 정해진 순서대로 진행되고, 각 순서마다 시간제한이 있어 시간 초과시 감점됩니다.
▪️ 토론을 시작하기 전에 사전 조사를 먼저 하셔도 좋습니다.
▪️ 토론 순서를 확인하시려면 <label style="color:orange;"><b>토론 순서</b></label> 버튼을, 토론을 시작하시려면 <label style="color:orange;"><b>토론 시작</b></label> 버튼을 눌러주세요.`,  // ChatGPT 첫메세지
      sentTime: "just now",                                                                   // 메시지가 보내진 시간
      sender: "Kurung"                                                                        // 메시지를 보낸 사용자
    }
  ]);


  //[STATE] check the GPT is typing
  const [isTyping, setisTyping] = useState(false);

  //[FUNCTION]: send message to ChatGPT, and add prompt
  const handleSend = async (message) => {

    if (message === "") {
      message = "의견을 입력하지 못했습니다. " + COMMON_PROMPT[DebateOrder_count];
    } else {
      message += COMMON_PROMPT[DebateOrder_count];
    }

    DebateOrder_count += 2;
    console.log('DebateOrder_count :' + DebateOrder_count)

    const newMessage = {
      message,
      direction: 'outgoing', // 메시지 방향 (outgoing: 발신, incoming: 수신)
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    console.log(message);      //user input
    console.log(newMessages);  //message array

    setMessages(newMessages);
    setisTyping(true)
    setUserText('')
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {

    // chatGPT API용 메시지 형식 지정
    // chatMessages 배열의 모든 요소에 대해 반복문 실행
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";

      if (messageObject.sender === "Kurung") {
        role = "assistant"
      } else {
        role = "user"
        // role과 messageObject.message를 가진 객체 반환
      } return { role: role, content: messageObject.message }
    });


    // ChatGPT API 요청 바디
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // 시스템 메세지
        ...apiMessages  // 전체 채팅 메시지
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
        if(!data.ok){
          throw Error(data.statusText);
        }else{
          return data.json(); // 응답 데이터를 JSON 형식으로 변환하여 반환
        }
      }).then((data) => {
        console.log(data); // 응답 데이터를 콘솔에 출력
        setMessages([...chatMessages, {
          message: data.choices[0].message.content, // 응답 데이터에서 메시지 내용을 추출하여 chatMessages 배열에 추가
          sender: "Kurung"
        }]);

        setisTyping(false); // 타이핑 중인 상태를 false로 변경
        setMinutes(min[DebateOrderNum])
        setSeconds(sdc[DebateOrderNum])
      }).catch((error) => {
        console.log(error); // 오류를 콘솔에 출력
      });
  }


  //State: 토론 순서 번호
  const [DebateOrderNum, setDebateOrderNum] = useState(0)
  const [isDebateStart, setIsDebateStart] = useState(false)

  //Variable: 시간 제한
  var min = [0, 0, 1, 0, 3, 0, 1, 0, 3, 0, 0]
  var sdc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const [seconds, setSeconds] = useState(sdc[0]);
  const [minutes, setMinutes] = useState(min[0]);


  // when the the debate is done enable done
  const [done, setDone] = useState(false)
  const [doneButton, setDoneButton] = useState(false)

  ////Confirm to continue when time is finish or buy items.
  const [confirm, setConfirm] = useState(false)
  const [openBuyTime, setOpenBuyTime] = useState(false)
  const [sendmessage, setSendmessage] = useState(false)
  const [userText, setUserText] = useState('')

  //시간 초과시 그냥 제출 (-30 감점)
  const HandleConfirmSubmit = () => {
    setConfirm(!confirm)
    handleSend(userText)
    minus = minus - 30
  }

  //시간 초과시 시간 구매 (BuyTime 모달)
  const HandleConfirmBuyTime = () => {
    setOpenBuyTime(!openBuyTime)
    setConfirm(!confirm)
  }

  //시간 구매 중 X버튼
  const GobackTo = () => {
    setConfirm(true)
  }


  useEffect(() => {
    let countdown = null

    if (!isTyping) {
      countdown = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);

        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);

        } else {

          if (DebateOrderNum >= 10) {
            setDone(true)
            clearInterval(countdown)
          } else if (DebateOrderNum < 10) {
            clearInterval(countdown)
            if (!isDebateStart) {
              setConfirm(false)
            } else {
              setConfirm(true)
            }
            count += 1
            setSendmessage(!sendmessage)
          }
        }
      }, 1000);

    } else if (!isTyping && seconds !== 0) {
      clearInterval(countdown)
    }

    return () => clearInterval(countdown);
  }, [seconds, minutes, isTyping, done, DebateOrderNum]);

  ///////////////////
  useEffect(() => {
    if (!done) {
      setDebateOrderNum(DebateOrderNum + 1)
      setMinutes(min[DebateOrderNum])
      setSeconds(sdc[DebateOrderNum])
      console.log("DebateOrderNum:" + DebateOrderNum + " debateState:" + DebateOrder[DebateOrderNum] + ' done:' + done + '디베이트오더넘 -1:' + DebateOrder[DebateOrderNum - 1])
    }
  }, [isTyping])


  const totalSeconds = (min[DebateOrderNum] * 60) + sdc[DebateOrderNum]
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



  //Open level Done 
  const [newScore, setNewScore] = useState(85)
  const [gotCoinNum, setGotCoinNum] = useState(0)

  const Level_Done = async () => {
    try {
      const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid).collection(props.Level).doc(props.categorie).collection(props.categorie).doc('Debate Updated')
      
      await userRef.delete()

      await userRef.set({
        Score: finalScore,
        categorie: props.categorie,
        Debate_Subject: DEBATE_TOPIC,
        Message: messages,
        Score_Logic: parseInt(matchLogic[1], 10),
        Score_PerPower: parseInt(matchPerPower[1], 10),
        Score_Express: parseInt(matchExpress[1], 10),
        Score_Positive: parseInt(matchPositive[1], 10),
        Score_ListPost: parseInt(matchListPost[1], 10),
        isClear: isClear,
      }, { merge: true });

      //코인 개수 = 성공하면, 최종 점수 / 10 (ex. 960점 = 96코인)
      //           실패하면, 코인 부여 없음
      const userReffordone = db.collection('users').doc(user.uid)
      //튜토리얼일 경우
      if(props.Level === 'Tutorial'){
        await userReffordone.update({
          Coins: firebase.firestore.FieldValue.increment(parseInt(match[1] / StandardOfCoin[DEBATE_LEVEL]))
        })
        await userReffordone.update({
          Tutorial: true
        })
      }
      //토론을 성공했을 경우
      else if(isClear){  
        await userReffordone.update({
          Coins: firebase.firestore.FieldValue.increment(parseInt(match[1] / StandardOfCoin[DEBATE_LEVEL]))
        })
        await userReffordone.update({
          [DEBATE_LEVEL]: firebase.firestore.FieldValue.increment(finalScore)
        })

        //난이도별로 코인 개수를 다르게 (어려운 레벨일수록 코인이 더 많음)
        setGotCoinNum(parseInt(match[1] / StandardOfCoin[DEBATE_LEVEL]))
      
      //토론을 실패했을 경우
      } else {    
        console.log('토론 실패')
      }

      setDoneButton(true)
    }
    catch (error) {
      console.log(error)
    }
  }
  //////////////// Le code qui Permet de gerer le temps achete: 구매한 시간을 관리하는 코드
  const [selectedValue, setSelectedValue] = useState(30);
  ///////////////////////////////

  //Buytime에서 선택한 시간을 가져오는 코드
  const handleSelectChange = event => {
    setSelectedValue(event.target.value);
  };





  const [coins, setCoins] = useState('')

  useEffect(() => {
    const getinfo = db.collection("users").doc(user.uid)
    getinfo.onSnapshot((doc) => {
      if (doc.exists) setCoins(doc.data().Coins);
    })
  }, [user.uid])

  //메소드: 시간을 추가하는 메소드
  const HandleBuyTime = async () => {
    const send = db.collection('users').doc(user.uid)
    console.log(Number(selectedValue)+'초 구매')
    if (coins < Number(selectedValue)) {
      return alert('코인이 부족합니다 😢')
    
    } else if (coins >= Number(selectedValue)) {
      await send.update({
        Coins: coins - Number(selectedValue),
      })
        //시간이 분단위면 '분'만 추가, 초단위면 '초'만 추가
        if(Number(selectedValue) > 30){
          setMinutes(Number(selectedValue)/60)
        }else{
          setSeconds(Number(selectedValue))
        }
      alert('시간 추가를 성공했습니다 🙂')
      setOpenBuyTime(false)
      setSelectedValue(30)
    } else {
      return alert('시간을 선택해주세요 🦊')
    }
  }

  //난이도 실패, 성공 useState
  const [isClear, setIsClear] = useState(false)
  useEffect(() => {
    if(finalScore > StandardOfClear[DEBATE_LEVEL]){
      setIsClear(true)
      console.log('난이도 클리어')
    }else{
      console.log('난이도 실패')
    }
   }, [finalScore])

  //토론 순서 버튼 모달 관리 useState
  const [openDebateOrder, setOpenDebateOrder] = useState(false)

  return (
    <div className='w-[95%] h-4/6 fixed mt-1'>
      <div className='flex items-center justify-center w-full gap-4'>
        <Timer minutes={minute} seconds={second} percentage={percentage} setcolor={setcolor} />
        <div className='bg-white w-5/6 h-full flex  flex-1 justify-center  mr-2 items-center'>
          <div className='p-2 bg-gray-200 rounded-xl shrink-0'>{DebateOrder[DebateOrderNum - 2]}</div>
          <div className='p-0.5 w-6 bg-gray-200 h-1/6'></div>
          <div className='p-1.5 bg-gray-200 rounded-full'></div>
          <div className='p-2.5 bg-orange-300 rounded-xl shrink-0 text-lg'>{DebateOrder[DebateOrderNum - 1]}</div>
          <div className='p-0.5 w-6  h-1/6 bg-orange-300'></div>
          <div className='p-1.5 bg-orange-300  rounded-full'></div>
          <div className='p-2 bg-gray-200 rounded-xl shrink-0'>{DebateOrder[DebateOrderNum]}</div>
        </div>
      </div>
      <div className='w-[95%] h-4/6 fixed'>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="쿠룽이가 답변중이에요" /> : null}
            >

              {messages.map((message, i) => {
                //UI에서 보충 프롬프트 숨김처리
                if (i % 2 !== 0) {
                  message.message = message.message.replace(COMMON_PROMPT[i - 1], "");
                  replace_switch = false;
                }
                //메세지에서 점수 추출
                if (i == 10) {
                  const regex = /총점수:\s*(\d+)/;
                  const regexLogic = /논리력:\s*(\d+)/;
                  const regexPerPower = /설득력:\s*(\d+)/;
                  const regexExpress = /표현력:\s*(\d+)/;
                  const regexPostive = /적극성:\s*(\d+)/;
                  const regexLisPost = /경청자세:\s*(\d+)/;

                  //matching
                  match = regex.exec(message.message);
                  matchLogic = regexLogic.exec(message.message);
                  matchPerPower = regexPerPower.exec(message.message);
                  matchExpress = regexExpress.exec(message.message);
                  matchPositive = regexPostive.exec(message.message);
                  matchListPost = regexLisPost.exec(message.message);
                  if (match && match[1]) {
                    finalScore = parseInt(match[1], 10) + minus
                    //난이도 클리어/실패 처리
                    
                    console.log(matchLogic[1])
                  } else {
                    finalScore = 0;
                  }
                }

                return (
                  <div>
                    <Message key={i} model={message} style={{ color: '#F9D8B5', margin: '20px' }}>
                      {message.sender === "Kurung" ?
                        <Avatar className='' src={props.src} name="Kurung" /> : <Avatar src={user.photoURL} name="user" />}
                    </Message>
                  </div>
                )
              })}

              <div id="start_buttons" className='flex items-center ml-16'>
                <div>
                  {DebateOrderNum == 1 &&
                    <button id="debate_order_button"
                      className="m-2 p-2 bg-white rounded-xl border-solid border-2 border-orange-400 shadow-md"
                      onClick={() => { 
                        setOpenDebateOrder(true)}}
                    >토론 순서</button>}
                </div>
                <div>
                  {DebateOrderNum == 1 &&
                    <button id="debate_start_button"
                      className="m-2 p-2 bg-orange-300 rounded-xl shadow-md"
                      onClick={() => { handleSend('이해했습니다! 시작해요🙂'); setIsDebateStart(true) }}
                    >토론 시작</button>}
                </div>
              </div>

              {/* 토론 끝내기 버튼 (클릭: 모달창 띄우기)*/}
              <div id='final_button' className='flex items-center justify-center'>
                {done &&
                  <button
                    className="m-2 p-2 bg-orange-300 rounded-xl"
                    onClick={() => { Level_Done() }}
                  >토론 끝내기</button>}
              </div>

            </MessageList>
            {isTyping === true || isDebateStart === false || confirm === true || done === true ?
              (<MessageInput placeholder="지금은 작성할 수 없습니다" disabled />)
              : (<MessageInput onChange={(value) => setUserText(value)} placeholder="입력해 주세요" onSend={handleSend} />)}
          </ChatContainer>
        </MainContainer>
      </div>
      {props.isModal && (<WarningModal setModal={props.Modal} />)} 
      {openDebateOrder && <DebateOrderModal setOpenDebateOrder={setOpenDebateOrder} USER_POSITION={USER_POSITION} CHAT_POSITION={CHAT_POSITION}/> }
      {openBuyTime && (<BuyTime value={selectedValue} onChange={handleSelectChange} setBuyTime={GobackTo} HandleBuyTime={HandleBuyTime} setOff={setOpenBuyTime} />)}
      {confirm && (<Confirmation ConfirBuyTime={HandleConfirmBuyTime} ConfirmSubmit={HandleConfirmSubmit} />)}
      {doneButton && <ModalScore src={props.src} points={finalScore} Level={props.Level} category={props.category} 
                                 setModal={props.setScore} count={count} minus={minus} coinNum={gotCoinNum} isClear={isClear}/>}

    </div>
  )
}

export default ChatBot

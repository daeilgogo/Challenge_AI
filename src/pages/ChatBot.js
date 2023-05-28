import { useState, useEffect } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.css?ver=1.1.9';
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
let DebateOrder_count = 1; //DebateOrder 인덱스에 활용됨.
let replace_switch = false; //뒷부분 지워주는 조건문 사용시 홀수번일때 true값으로 변함.
let match='0'

let matchLogic = 0;
let matchPerPower = 0;
let matchExpress = 0;
let matchPositive = 0;
let matchListPost = 0;
                  
var minus=0
var finalScore=0
var count =0 //// 메시지를 못보낸ㄴ 순간


function ChatBot(props) {

  const chat_position = props.position == '찬성'?'반대':'찬성'; 
  
  const Debate_command = { //점수를 너무 높게 줌.. 변별력있는 평가지를 만들어야함.
    1: `${props.position}측 입론입니다. ${chat_position}측 입장에서 질의해주세요. `,
    3: `${props.position}측 답변입니다. ${chat_position}측 입장에서 입론해주세요.`,
    5: `${props.position}측 질의입니다. ${chat_position}측 입장에서 답변해주세요. `,
    7: `${props.position}측 반론입니다. ${chat_position}측 입장에서 반론해주세요.`,
    9: `${props.position}측 최종 반론입니다. 
    지금부터 당신은 세계 최고의 토론 전문가로써 토론에 대해 평가할 수 있습니다.
    토론 ${props.position}측에 대해 다음 5가지 항목을 기준으로 각각 0~200점 (최대 200점) 사이 점수를 매겨주고,
    점수를 매긴 이유를 설명해주세요. 그리고 5가지 점수를 총합해서 1000점 만점에 몇점인지 총점수를 환산해주세요. 마지막으로 가장 낮은 점수를 매긴 항목을 보완하기 위한 팁을 전달해주세요.
    
    평가 기준으로 글은 명확하고 논리적인 구조를 갖추어야 하며, 문법적 오류나 맞춤법 실수가 없어야 합니다. 또한, 주어진 주제에 충실히 대답하고 주장은 근거와 함께 명확하게 전달되어야 합니다. 최대한 편견 없이 평가해주세요.

    논리력: 토의주제에 대한 개인의 의견이 논리적으로 전개되고 있는가? (0~200점)
    설득력: 개인의 주장이 설득력을 갖는가? (0~200점)
    표현력: 자신의 생각을 바르게 설명하는가? (0~200점)
    적극성: 토의의제에 적극적 동참하고 있는가? (0~200점)
    경청자세: 타인의 의견을 경청하고 있는가? (0~200점)
    
    ---
    출력 예시:
    논리력: x/200
    설득력: x/200
    표현력: x/200
    적극성: x/200
    경청자세: x/200
    
    따라서 총점수는 x점입니다!
    
    가장 약한 ...항목을 보완하려면 ...하는 것이 좋을 것입니다.`
  }

  const DebateOrder = { //늘려야함.
    0: '토론시작',
    1: `${props.position}측 입론`,
    2: `${chat_position}측 질의`,
    3: `${props.position} 답변`,
    4: `${chat_position}측 입론`,
    5: `${props.position}측 질의`,
    6: `${chat_position}측 답변`,
    7: `${props.position}측 반론`,
    8: `${chat_position}측 반론`,
    9: '평가',
    10: '평가2'
  }

  const level = new Map([ // 학력도 중요하지만 행동의 범주를 정하는 프롬프트가 필요함... 
    ['Tutorial','유치원생'],
    ['Level_1','초등학교'],
    ['Level_2','고등학생'],
    ['Level_3','대학생']
  ])

  const level_control = new Map([
    ['Tutorial','억지를 50%정도 부려 말'],
    ['Level_1','어휘지식크기 10단어 사용해 말 '],
    ['Level_2',`고등학생 말투 특징 :

    반말과 존댓말의 혼용: 고등학생들은 친한 친구나 동급생들과 대화할 때 반말을 사용하는 경향이 있습니다. 그러나 선생님, 어른, 상대방과의 존댓말을 적절하게 구사할 수 있어야 합니다.
    
    입체감과 활기찬 표현: 고등학생들은 자신의 생각과 감정을 적극적으로 표현하려는 경향이 있습니다. 따라서 활기찬 어투와 표현을 사용하여 대화를 진행할 수 있습니다.
    
    특정 어휘와 표현의 사용: 일부 고등학생들은 자신들만의 어휘와 표현을 사용하는 경우가 있습니다. 이는 대화 상황에 따라 다를 수 있으며, 특정 학교, 동네, 혹은 인터넷 커뮤니티에서 사용되는 슬랭이나 줄임말 등이 포함될 수 있습니다.
    
    문법과 어휘 선택: 고등학생들은 학교에서 국어 수업을 통해 어느 정도의 문법과 어휘를 배우게 됩니다. 따라서 올바른 문법과 적절한 어휘 선택에 주의해야 합니다. 그러나 완벽한 문법과 어휘 사용은 요구되지 않으며, 일상적인 대화에서는 언어의 흐름과 의사전달이 중요합니다.
    
    관심사와 주제에 대한 이해: 고등학생들은 다양한 관심사와 주제에 관심을 가지고 있습니다. 그들의 대화에는 학교 생활, 친구, 취미, 엔터테인먼트, 스포츠 등 다양한 주제가 포함될 수 있으며, 이에 대한 이해와 관련된 표현을 사용할 수 있어야 합니다.`],
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
  const [getMessage,setGetMessgae]=useState('')
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
    ${level.get(props.Level)} 수준이란,  ${level_control.get(props.Level)}을 해야합니다.
    당신은 ${WordCounter_control.get(props.Level)} 이내로 대답해야합니다.
    ${chat_position} 입장에서 입론해주세요.`
  
  }

  const [isTyping, setIsTyping] = useState(false); // 사용자가 메시지를 입력 중인지 여부

  const handleSend = async (message) => { // 메시지를 보내는 함수
    //var m = message+"200글자 이내로 대답해줘"
    message+=Debate_command[DebateOrder_count];
    DebateOrder_count += 2; //뒷문장을 홀수번 인덱스로 만들어서 +2함.
    console.log(message)

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
    setUserText('')
    await processMessageToChatGPT(newMessages);
  
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages

    // chatGPT API용 메시지 형식 지정

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
    setMinutes(min[TimeState])
    setSeconds(sdc[TimeState])
  }


  ///// Set State 
  const [TimeState, setState] = useState(0)
  ////initialize timer
  var min = [0, 0, 0, 0, 0, 0, 0, 0, 0,0,0]
  var sdc = [30, 40, 20, 40, 30, 40, 40,40,0,0]
  const [seconds, setSeconds] = useState(sdc[0]);
  const [minutes, setMinutes] = useState(min[0]);
  const db = firebase.firestore()

  // when the the debate is done enable done
  const [done, setDone] = useState(false)
  const [doneButton, setDoneButton] = useState(false)

  /// Set active the timer
  const [isActive, setIsActive] = useState(false);

////Confirm to continue when time is finish or buy items.
const [confirm,setConfirm]=useState(false)
const [openBuyTime,setOpenBuyTime]=useState(false)
const [sendmessage,setSendmessage]=useState(false)
const [userText,setUserText] = useState('')




const HandleConfirmSubmit=()=>{

  if(userText===''){
    alert('꼭 의견을 작성하셔야 제출 가능합니다. 그래서 시간을 구매하세요')
  }else{
    setConfirm(!confirm)
    handleSend(userText)
    minus=minus-30 
  }

 
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
      countdown = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);

        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);

        } else {

            if(TimeState>=10){
              setMinutes(0)
              setSeconds(0)
              setDone(true)
              clearInterval(countdown)
            }else if (TimeState<9){
              clearInterval(countdown)
              setConfirm(!confirm)
              count+=1
              setSendmessage(!sendmessage)
            }
        }
      }, 1000);

    } else if (!isActive && seconds !== 0) {
      clearInterval(countdown)
    }

    return () => clearInterval(countdown);
  }, [seconds, minutes, isActive, done, TimeState]);

  ///////////////////
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



  //////////////////////////Open level Done 
  const [newScore,setNewScore]=useState(85)
  
  const Level_Done= async()=>{
    try { const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid).collection(props.Level).doc(props.categorie).collection(props.categorie).doc(props.Topic)
      await userRef.set({
        Score:finalScore,
        categorie:props.categorie,
        Debate_Subject:props.Topic,
        Message:messages,
        Score_Logic:parseInt(matchLogic[1],10),
        Score_PerPower:parseInt(matchPerPower[1],10),
        Score_Express:parseInt(matchExpress[1],10),
        Score_Positive:parseInt(matchPositive[1],10),
        Score_ListPost:parseInt(matchListPost[1],10),
       }, { merge: true });
       setDoneButton(true) 
//////////////////When the level is done increase value of Coins in the DB
       if(match[1]<='500'){
        const SetCoins = db.collection('users').doc(user.uid)
        await SetCoins.update({
          Coins:firebase.firestore.FieldValue.increment(50)
        })
       }else if(match[1]>'500' && match[1]<='600'){
        const SetCoins = db.collection('users').doc(user.uid)
        await SetCoins.update({
          Coins:firebase.firestore.FieldValue.increment(100)
        })

       }else if(match[1]>'600' && match[1]<='700'){
        const SetCoins = db.collection('users').doc(user.uid)
        await SetCoins.update({
          Coins:firebase.firestore.FieldValue.increment(150)
        })
       }
       else if(match[1]>'700' && match[1]<='850'){
        const SetCoins = db.collection('users').doc(user.uid)
        await SetCoins.update({
          Coins:firebase.firestore.FieldValue.increment(200)
        })
       }
       else if(match[1]>'850'){
        const SetCoins = db.collection('users').doc(user.uid)``
        await SetCoins.update({
          Coins:firebase.firestore.FieldValue.increment(250)
        })
       }
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
                  Coins: coins-15,
              })
             setMinutes(0)
             setSeconds(30)
             alert('시간을 추가된 것 성공되었습니다 !')
             minus=minus-20 
             setOpenBuyTime(false)
             setSelectedValue('')
          }
          
         
           break;
          case '3':
           
          if(coins===0 || setCoins<5){
              return   alert('Coins 부족합니다')
          }else if(coins>=5){
            await send.update({
                  Coins: coins-30,
              })
              setMinutes(0)
              setSeconds(40)
              alert('시간을 추가된 것 성공되었습니다 !')
              setOpenBuyTime(false)
              minus=minus-20 
              setSelectedValue('')
          }
            break;
          case '5':

          if(coins===0 || coins<6){
              return   alert('Coins 부족합니다')
          }else if(coins>6){
            await send.update({
                  Coins: coins-35,
              })
              setMinutes(0)
              setSeconds(50)
              alert('시간을 추가된 것 성공되었습니다 !')
              setOpenBuyTime(false)
              minus=minus-20 
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
      {/* <div className='bg-red-300 mt[50%]'>
        총점수: {finalScore} ; {matchLogic[1]} ,{matchPerPower[1]} ,{matchExpress[1]},,{matchPositive[1]} ,{matchListPost[1]}
      </div> */}
      </div>
      <div className='w-[95%] h-4/6  fixed'>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="쿠룽이가 답변중이에요" /> : null}
            >

              {messages.map((message, i) => {
                //사용자 채팅창이 홀수번이기때문에 홀수번일때 true값으로 바꿈.'
                console.log(message.message,"-------------")
                if(i%2!==0){
                  replace_switch = true;
                }
                if(i == 10){
                  const regex = /총점수는\s*(\d+)/;
                  const regexLogic = /논리력:\s*(\d+)/;
                  const regexPerPower = /설득력:\s*(\d+)/;
                  const regexExpress = /표현력:\s*(\d+)/;
                  const regexPostive = /적극성:\s*(\d+)/;
                  const regexLisPost = /경청자세:\s*(\d+)/;
                  

                  //////////matching------------
                  matchLogic=regexLogic.exec(message.message);
                  matchPerPower=regexPerPower.exec(message.message)
                  matchExpress=regexExpress.exec(message.message)
                  matchPositive=regexPostive.exec(message.message)
                  matchListPost=regexLisPost.exec(message.message)
                 ///////////////////////

                  match = regex.exec(message.message)
                  finalScore=parseInt(match[1],10)+minus
                
                  console.log(matchLogic[1])
                }
                
                //채팅창 뒷부분 넣는거 지워주는 조건문. 
                if(replace_switch == true){
                  console.log(message.message,i)
                  message.message = message.message.replace(Debate_command[i],"");
                  replace_switch = false;
                }
                //console.log(message) // 메시지 출력
                return (
                  <div>
                    <Message key={i} model={message} style={{ color: '#F9D8B5' }}>
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
            {isTyping===true? (<MessageInput placeholder="입력해 주세요"/>):(<MessageInput onChange={(value) => setUserText(value)}   placeholder="입력해 주세요" onSend={handleSend}  />)}   
           
          </ChatContainer>
        </MainContainer>
      </div>
      {props.isModal && (<WarningModal setModal={props.Modal} />)}
      {doneButton && <ModalScore src={props.src} points={finalScore} level={props.Level} category={props.category} setModal={props.setScore} count={count} minus={minus}/>}
      {openBuyTime && (<BuyTime value={selectedValue} onChange={handleSelectChange} setBuyTime={GobackTo} HandleBuyTime={HandleBuyTime} setOff={setOpenBuyTime}/>)&&<MessageInput/>}
      {confirm && (<Confirmation ConfirBuyTime={HandleConfirmBuyTime} ConfirmSubmit={HandleConfirmSubmit} />)}

    </div>
  )
}

export default ChatBot

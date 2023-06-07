import { useState, useEffect, useRef } from 'react'
import { firebase } from '../firebase'
import { UserAuth } from '../context/AuthContext'
import {
    MainContainer, ChatContainer, MessageList,
    Message, MessageInput, TypingIndicator, Avatar
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.css?ver=1.1.9';
import { useLocation, useNavigate } from 'react-router-dom'
//import { Prompt_Debate_Order, Prompt_Debate_Command } from '../components/Prompts';

const db = firebase.firestore()

function Review(props) {

    const navigate = useNavigate()
    const { user } = UserAuth();
    const [DebateInfo, setDebateInfo] = useState([]);

    const location = useLocation()
    const category = props.category
    const image = props.src
    const Level = props.Level
    const score = props.score

    //토론 내용 불러오기
    useEffect(() => {
        const debateinfo = db.collection("users").doc(user.uid).collection(Level).doc(category).collection(category).doc('Debate Updated')

        debateinfo.onSnapshot((doc) => {
            if (doc.exists) {
                setDebateInfo(doc.data().Message)
                console.log(doc.data().Message)
            }
        })
    }, [user.uid])

    const saveToTxt=()=>{
        const debateinfo = db.collection("users").doc(user.uid).collection(Level)
        .doc(category).collection(category).doc('Debate Updated')

        debateinfo.onSnapshot((doc) => {
            if (doc.exists) {
                setDebateInfo(doc.data().Message)
                console.log(doc.data().Message)

                const dataString = JSON.stringify(DebateInfo, null, 2);
                const element = document.createElement('a');
                const file = new Blob([dataString], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = `${category}`+'.txt';
                element.click();
            }
        })

    }

    return (
        <div className='w-[95%] h-4/6 fixed mt-1'>
            <div className='flex items-center justify-center w-full gap-4'>
                <div className='bg-white w-5/6 h-full flex  flex-1 justify-center  mr-2 items-center'>
                </div>
            </div>
            <div className='w-[95%] h-4/6 fixed'>
                <MainContainer>
                    <ChatContainer>
                        <MessageList scrollBehavior="smooth">

                            {DebateInfo.map((message, i) => {

                                return (
                                    <div>
                                        <Message key={i} model={message} style={{ color: '#F9D8B5', margin: '20px' }}>
                                            {message.sender === "Kurung" ?
                                                <Avatar className='' src={props.src} name="Kurung" /> : <Avatar src={user.photoURL} name="user" />}
                                        </Message>
                                    </div>
                                )
                            })}


                            {/* 토론 끝내기 버튼 (클릭: 모달창 띄우기)*/}
                            <div id='final_button' className='flex items-center justify-center'>
                                <button
                                    className="m-2 p-2 bg-orange-300 rounded-xl"
                                    onClick={() => { navigate('/IsClear', { state: { category: category, character: image, Level: Level, score: score } }) }}
                                >토론 다시보기 마치기</button>
                                <button className="m-2 p-2 bg-orange-300 rounded-xl" onClick={saveToTxt}>내용 다운로드하기 📃</button>
                            </div>
                        </MessageList>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default Review

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Level(props) {
    const navigate = useNavigate()
    const LevelName = {
        "튜토리얼": "Tutorial",
        "LEVEL 1": "Level_1",
        "LEVEL 2": "Level_2",
        "LEVEL 3": "Level_3"
    }

    

    return (
        <button className='lg:transition lg:ease-in-out lg:delay-150 lg:hover:-translate-y-1 lg:hover:scale-110
                           shrink-0 mr-10 w-[240px] h-[400px] shadow-lg border-2 border-inherit rounded-2xl'
            disabled={!props.complete}
            onClick={() => {
                navigate('/category', { state: { src: props.src, Level: LevelName[props.title] } })
            }}>
            {/* complete가 true면 배경색이 바뀜 (난이도별 다른 배경색) */}
            <div className={`w-full h-3/5 rounded-t-2xl flex justify-center items-center
                            ${ props.name === "Kinder" ? 'bg-[#F29104]' :
                            props.complete && props.name === "Elementary" ? 'bg-[#F2CC04]' :
                            props.complete && props.name === "High" ? 'bg-[#D1F204]' :
                            props.complete && props.name === "Univ" ? 'bg-[#1ae5e2]' : 'bg-gray-200'}`}>
                <img className="w-5/7 h-4/6" src={props.src}></img>
            </div>
            <div className='w-full h-2/5 bg-gray-100 rounded-b-2xl text-center'><br />
                <div className=' text-2xl text-bold'>{props.title}</div><br />
                <div className='text-xl'>{props.content}</div>
            </div>
        </button>
    )
}

export default Level

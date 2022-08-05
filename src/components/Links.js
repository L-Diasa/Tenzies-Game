import React from "react"
import {Link} from "react-router-dom"

import useSound from "use-sound"
import startGame from "../sounds/startGame.wav"
import records from "../sounds/records.wav"

function LinkGame({text, newGame}) {
    const [playStart] = useSound(startGame, { volume: "0.2" });

    function start() {
        playStart()
        if(newGame) {
            newGame()
        }
    }
    
    return (
        <Link 
            to="/tenzies"
            onClick={start}
            className="link-button">
                {text}
        </Link>
    )
}

function LinkRecords() {
    const [playRecords] = useSound(records, { volume: "0.2" });
    return (
        <Link 
            to="/records" 
            onClick={playRecords}
            className="link-button">
                Records
        </Link>
    )
}

export {LinkGame, LinkRecords}
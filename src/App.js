import React, {useState, useEffect} from "react"
import {Routes, Route} from "react-router-dom"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import useSound from "use-sound"

import Die from "./components/Die"
import Records from "./components/Records"
import StartScreen from "./components/StartScreen"
import {LinkRecords} from "./components/Links"

import startGame from "./sounds/startGame.wav"
import endGame from "./sounds/endGame.wav"
import freeze from "./sounds/freeze.wav"
import unfreeze from "./sounds/unfreeze.wav"
import roll from "./sounds/roll.wav"
import newRecord from "./sounds/newRecord.wav"

export default function App() {
    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)

    const [time, setTime] = useState(0)
    const [rolls, setRolls] = useState(0)
    const [records, setRecords] = useState(
         () => JSON.parse(localStorage.getItem("records")) || null)
    const [newRecordText, setNewRecordText] = useState("")

    const [playFreeze] = useSound(freeze, { volume: "0.2" })
    const [playUnfreeze] = useSound(unfreeze, { volume: "0.2" })
    const [playStart] = useSound(startGame, { volume: "0.2" })
    const [playEnd] = useSound(endGame, { volume: "0.2" })
    const [playRoll] = useSound(roll, { volume: "0.2" })
    const [playNewRecord] = useSound(newRecord, { volume: "0.2" })

    useEffect(() => {
        console.log(dice)
        let recordTimer
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            const newRecord = {
                id: nanoid(),
                time: time,
                rolls: rolls
            }
            setRecords(prevRecords => 
                prevRecords
                ? 
                {
                    bests: {
                        bestTime: time < prevRecords.bests.bestTime ? 
                            time : prevRecords.bests.bestTime,
                        bestRolls: rolls < prevRecords.bests.bestRolls ? 
                                rolls : prevRecords.bests.bestRolls
                    },
                    allRecords: [newRecord, ...prevRecords.allRecords]
                }
                :
                {
                    bests: {
                        bestTime: time, 
                        bestRolls: rolls
                    },
                    allRecords: [newRecord]
                }
            )
            recordTimer = setTimeout(() => newRecordCheck(), 700);
        }
        return () => {
            setNewRecordText("")
            clearTimeout(recordTimer)
        }
    }, [dice])

    useEffect(() => {
        let interval
        if(!tenzies) {
            interval = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000)
        }
        return () => {
            if(interval !== null) {
                clearInterval(interval)
            }
        }
    }, [tenzies])

    useEffect(() => {
        localStorage.setItem("records", JSON.stringify(records))
    }, [records])


    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRolls(prevRollCount => prevRollCount + 1)
            playRoll()
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
            setTime(0)
            playStart()
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            if(die.id === id) {
                if(die.isHeld) {
                    playUnfreeze()
                } else {
                    playFreeze()
                }
                return {...die, isHeld: !die.isHeld}
            }
            return die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    function newRecordCheck() {
        const timeRecord = time < records.bests.bestTime
        const rollsRecord = rolls < records.bests.bestRolls
        if(timeRecord || rollsRecord) {
            setNewRecordText(
                <div className="newRecords">
                    {timeRecord &&
                    <p className="blue">New Time Record!
                    </p>
                    }
                    {rollsRecord  &&
                    <p className="blue">New Rolls Record!
                    </p>
                    }
                </div>
            )
            playNewRecord()
        } else {
            setNewRecordText("")
            playEnd()
        }
    }
    
    return (
        <main>
            <Routes>
                <Route 
                    path="*" 
                    element={<StartScreen />}
                />
                <Route 
                    exact 
                    path="/records" 
                    element={<Records 
                                records={records}
                                newGame={rollDice}
                            />}
                />
                <Route 
                    exact 
                    path="/game" 
                    element={
                    <>
                        {tenzies &&
                        <>
                            <Confetti />
                            <div className="text-center">
                                <h1 className="blue">Awesome!</h1>
                                {newRecordText}
                                <h3>You took only {time} seconds and {rolls} rolls</h3>
                            </div>
                        </>
                        } 
                        {!tenzies && 
                        <>
                            <h1 className="title blue">Tenzies</h1>
                            <p className="instructions">Roll until all dice are the same. 
                            Click each die to freeze it at its current value between rolls.</p>
                            <div className="dice-container">
                                {diceElements}
                            </div>
                        </>
                        }     
                        <div className="buttons-div">
                            <button 
                                className="link-button" 
                                onClick={rollDice}
                            >
                                {tenzies ? "New Game" : "Roll"}
                            </button>
                            {tenzies && 
                                <LinkRecords />
                            }
                        </div>
                    </>
                    }
                />
            </Routes>
        </main>
    )
}
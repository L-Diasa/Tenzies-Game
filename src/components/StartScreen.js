import React from "react"
import {LinkGame, LinkRecords} from "./Links"

export default function StartScreen() {
    return (
        <>
            <h1 className="title blue">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</p>
               <LinkGame text="Start Game" />
               <LinkRecords />
        </>
    )
}

import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#5035FF" : "white"
    }
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            <img src={`/dice/${props.value}.png`} alt="" />
        </div>
    )
}
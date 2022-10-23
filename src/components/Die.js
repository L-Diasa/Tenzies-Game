import React from "react"
import images from '../images';

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
            <img src={images[`i${props.value}`]} alt="" />
        </div>
    )
}
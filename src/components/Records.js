import React from "react"
import {LinkGame} from "./Links"

export default function Records({records, newGame}) {
    const allRecords = records ? 
        records.allRecords.map((record, key) => {
            return (
                <tr key={key}>
                <td>{record.time} seconds</td>
                <td>{record.rolls}</td>
                </tr>
            )
            })
        : null

    return (
        <>
            <div className="text-center">
                <h1 className="title blue">Records</h1>
                {allRecords
                    ?
                    <>
                        <p className="blue">Time Record: {records.bests.bestTime} seconds</p>
                        <p className="blue">Rolls Record: {records.bests.bestRolls}</p>
                    </>
                    :
                        <p className="blue">You have no records</p>
                } 
            </div>
            {allRecords && 
                <div className="allRecords">
                    <table>
                        <thead>
                            <tr className="blue">
                                <th>Time</th>
                                <th>Rolls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allRecords}
                        </tbody>
                    </table>
                </div> 
            }
                <br />
                <LinkGame 
                    newGame={newGame}
                    text={allRecords 
                        ? "New Game" 
                        : "Create One Now"
                    } 
                />
        </>
    )
}
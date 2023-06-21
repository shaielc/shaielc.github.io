import React from "react";
import './ServerMode.css'

import LiteIcon from './icons/lite.png'
import BinderIcon from './icons/binder.png'

export type ServerModeType = "Binder" | "Lite" | "Local"
const modes: ServerModeType[] = ["Lite", "Binder", "Local"]

const icons: {[mode: string]: string} = {
    "Lite": LiteIcon,
    "Binder": BinderIcon,
    "Local": 'jupyter.svg'
}
export function ModeChooser({ mode, setMode }: { mode: ServerModeType, setMode: (mode: ServerModeType) => void }) {
    return (<div className="modeChooser">
        {modes.map((modeOption: ServerModeType) => {
             return (
             <div onClick={() => setMode(modeOption)} key={modeOption} className={`modeChoice ${mode === modeOption ? "activeMode" : ""}`}>
                {
                    icons[modeOption] ?
                    <div className="modeChoiceIcon">
                        <img src={icons[modeOption]}></img>
                    </div>
                    : modeOption
                }
            </div>) })}
    </div>)
}
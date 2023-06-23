import React from "react";
import './ServerMode.css'

import LiteIcon from './icons/lite.png'
import BinderIcon from './icons/binder.png'
import {ReactComponent as JupyterIcon} from './icons/jupyter.svg'
import { JsxElement } from "typescript";

export type ServerModeType = "Binder" | "Lite" | "Local"
const modes: ServerModeType[] = ["Lite", "Binder", "Local"]

const icons: {[mode: string]: React.ReactNode} = {
    "Lite": <img src={LiteIcon}></img>,
    "Binder": <img src={BinderIcon}></img>,
    "Local": <JupyterIcon />
}
export function ModeChooser({ mode, setMode }: { mode: ServerModeType, setMode: (mode: ServerModeType) => void }) {
    return (<div className="modeChooser">
        {modes.map((modeOption: ServerModeType) => {
             return (
             <div onClick={() => setMode(modeOption)} key={modeOption} className={`modeChoice ${mode === modeOption ? "activeMode" : ""}`}>
                {
                    icons[modeOption] ?
                    <div className="modeChoiceIcon">
                        {icons[modeOption]}
                    </div>
                    : modeOption
                }
            </div>) })}
    </div>)
}
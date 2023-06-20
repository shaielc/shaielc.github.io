import React from "react";
import './ServerMode.css'

export type ServerModeType = "Binder" | "Lite"
const modes: ServerModeType[] = ["Binder", "Lite"]
export function ModeChooser({ mode, setMode }: { mode: ServerModeType, setMode: (mode: ServerModeType) => void }) {
    return (<div className=".modeChooser">
        {modes.map((modeOption: ServerModeType) => {
             return (
             <div onClick={() => setMode(modeOption)} className={`modeChoice ${mode === modeOption ? "activeMode" : ""}`}>
                {modeOption}
            </div>) })}
    </div>)
}
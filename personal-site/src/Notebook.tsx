import React, { useEffect, useMemo, useState } from 'react';
import { ThebeSessionProvider, ThebeRenderMimeRegistryProvider, useThebeServer, useNotebook } from 'thebe-react';

export function NotebookProvider({ name, children }: React.PropsWithChildren<{ name: string }>) {
    const { ready } = useThebeServer();

    if (!ready) return null;
    return (
        <ThebeRenderMimeRegistryProvider>
            <ThebeSessionProvider start name={name}>
                {children}
            </ThebeSessionProvider>
        </ThebeRenderMimeRegistryProvider>
    );
}

function notebookSource({ source }: { source: string }) {
    return async (n: string) => {
        const url = `${source}/${n}.ipynb`;
        const resp = await fetch(url);
        if (!resp.ok) throw Error(`Could not load ${url}`);
        return resp.json();
    }
}


export default function JupyterOutputDecoration({
    children,
    idx,
}: React.PropsWithChildren<{ idx?: number }>) {
    return (
        <div className="mx-2 my-8 relative border rounded py-3">
            <div className="absolute -top-3 -left-2 z-10 bg-white flex items-center">
                {idx && <div className="ml-1 text-sm text-gray-500">cell #: {idx}</div>}
            </div>
            <div className="mx-3">{children}</div>
        </div>
    );
}



export function NotebookHandler({ source, name }: { source: string, name: string }) {
    const [running, setRunning] = useState(0)
    const [installing, setInstalling] = useState(0)
    const { ready, executing, executeAll, errors, cellRefs, cellIds, session } = useNotebook(
        name,
        notebookSource({ source }),
        { refsForWidgetsOnly: false },
    );

    async function run() {
        await executeAll();
    }


    async function install() {
        
        await session?.kernel?.requestExecute({code: "%pip install jupyter-utility-widgets\n", silent: true}).done;
        
const code = `
import ipywidgets as widgets
import matplotlib.pyplot as plt
import numpy as np      
from ipywidgets import Output, FloatSlider, Layout
from IPython.display import clear_output
`
        await session?.kernel?.requestExecute({code, silent: true}).done;
        setInstalling(2)
    }

    useEffect(() => {
        if (!ready) return;
        if (installing !== 0) return;
        setInstalling(1);
        install().then(() => setInstalling(2)).catch(() => setInstalling(-1))
    }, [ready])

    useEffect(() => {
        if(installing !== 2) return
        if(running !== 0) return
        setRunning(1)
        run().then(() => setRunning(2))
    }, [installing])


    return (<div>
        <div> {ready ? "READY" : "Waiting"} </div>
        <div> {installing === 1 ? "Installing" : (installing === 2 ? "Installed": "")} </div>
        <div> {running === 2 ? "Executed" : (running === 1? "Executing": "")} </div>
        <div> {`${cellRefs.length}`}</div>
        <div className="m-auto max-w-3xl">

            {cellRefs.map((ref, idx) => {
                return (
                    <JupyterOutputDecoration key={idx}><div  ref={ref}>[output]</div></JupyterOutputDecoration>
                )
            })}
        </div>
    </div>)
}

export function Notebook({ source, name }: { source: string, name: string }) {
    return (
        <NotebookProvider name={name}>
            <NotebookHandler name={name} source={source}></NotebookHandler>
        </NotebookProvider>
    )
}
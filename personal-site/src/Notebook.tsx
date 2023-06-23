import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        const url = `${source}/${n}`;
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
        { refsForWidgetsOnly: true },
    );

    async function run() {
        await executeAll();
    }


    async function install() {
        let execution = session?.kernel?.requestExecute({code: "%pip install jupyter-utility-widgets\n", silent: false})
        if (!execution) {
            throw "Execution Failed"
        }
        execution.onIOPub = console.debug
        execution.onReply = console.debug
        await execution.done;
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
        run().then(() => setRunning(2)).catch(() => setRunning(-1))
    }, [installing])


    return (<div>
        <div> {ready ? "READY" : "Waiting"} </div>
        <div> {installing === 1 ? "Installing" : (installing === 2 ? "Installed": "")} </div>
        <div> {running === 2 ? "Executed" : (running === 1? "Executing": "")} </div>
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

export function NotebookPage({ source }: {source: string}) {
    const params = useParams<{notebookName: string}>()
    
    const {notebookName} = params
    if (!notebookName) {
        return <div></div>
    }
    console.log(params)
    return (<div>
        <span>{notebookName}</span>
        <Notebook name={notebookName} source={source}></Notebook>
    </div>)
}
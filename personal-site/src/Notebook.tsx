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
    const [executed, setExecuted] = useState(false)
    const { ready, executing, executeAll, errors, cellRefs, cellIds, session } = useNotebook(
        name,
        notebookSource({ source }),
        { refsForWidgetsOnly: false },
    );

    async function run() {
        await session?.kernel?.requestExecute({code: "%pip install jupyter-utility-widgets\n", silent: true}).done;
        await executeAll();
        setExecuted(true);
    }
    useEffect(() => {
        if (!ready) return;
        if (executed) return
        if (executing) return;
        run().catch(async () => await session?.restart())
    })
    return (<div>
        <div> {ready ? "READY" : "Waiting"} </div>
        <div> {executed ? "Executed" : ""} </div>
        <div> {executing ? "Executing" : ""} </div>
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
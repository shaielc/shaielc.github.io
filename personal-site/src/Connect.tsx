import React, { useContext, useEffect, useState } from 'react'
import { makeBinderOptions, makeConfiguration } from 'thebe-core'
import { useThebeLoader, useThebeServer } from 'thebe-react'
import './Connect.css'

enum ConnectionState {
    DISCONNECTED,
    CONNECTED,
    CONNECTING
}

function getConnectionState({ready, connecting}: {ready: boolean,connecting: boolean}) {
    if (ready) {
        return ConnectionState.CONNECTED
    }
    if (connecting) {
        return ConnectionState.CONNECTING
    }
    return ConnectionState.DISCONNECTED
}

const state_to_text = {
    [ConnectionState.CONNECTED] : "Connected",
    [ConnectionState.DISCONNECTED] : "Connect",
    [ConnectionState.CONNECTING] : "Connecting",
}

const state_to_css = {
    [ConnectionState.CONNECTED] : "connected",
    [ConnectionState.DISCONNECTED] : "disconnected",
    [ConnectionState.CONNECTING] : "connecting",
}

export function ConnectionHeader() {
    const { core, loading, load } = useThebeLoader();
    const { ready, connecting, connect } = useThebeServer();

    useEffect(() => {
        if (core || loading) return;
        load();
    }, [core, load, loading]);

    const clickConnect = () => {
        if (!core) return;
        connect();
    };

    const connection_state = getConnectionState({ready, connecting})

    return (
        <div onClick={clickConnect} className={`connectionElement ` + state_to_css[connection_state]}>
            {state_to_text[connection_state]}
        </div>
    );
}

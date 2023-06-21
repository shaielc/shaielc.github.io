import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ConnectionHeader } from './Connect'
import { ThebeServerProvider, ThebeBundleLoaderProvider } from 'thebe-react'
import {makeConfiguration} from 'thebe-core'
import { Notebook} from './Notebook'
import { ServerModeType, ModeChooser } from './ServerMode'

const options = {
  kernelOptions: {
    name: 'Python 3'
  },
  binderOptions: {
      repo: "shaielc/jupyter-utility-widgets",
      ref: "HEAD"
  }
}


const JUPYTER_UTILITY_WIDGETS_SOURCE = 'https://raw.githubusercontent.com/shaielc/jupyter-utility-widgets/main/examples/'

function App() {
  const [mode, setMode] = useState<ServerModeType>("Lite")

  return (
    <ThebeBundleLoaderProvider loadThebeLite publicPath='./thebe'>
      <ThebeServerProvider connect={false} options={options} useBinder={mode === "Binder"} useJupyterLite={mode === "Lite"}>
        <div className="App">
          <header className="App-header">
            <div style={{flexGrow:1}}></div>
            <ModeChooser mode={mode} setMode={setMode}></ModeChooser>
            <ConnectionHeader></ConnectionHeader>
          </header>
          <main className='App-main'>
            <Notebook name='filter_design' source={JUPYTER_UTILITY_WIDGETS_SOURCE}></Notebook>
          </main>
        </div>
      </ThebeServerProvider>
    </ThebeBundleLoaderProvider>
  );
}

export default App;

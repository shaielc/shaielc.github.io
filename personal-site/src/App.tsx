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
            <span>Jupyter Utility Widgets</span>
            <div style={{flexGrow:1}}></div>
            <ModeChooser mode={mode} setMode={setMode}></ModeChooser>
            <ConnectionHeader></ConnectionHeader>
          </header>
          <main className='App-main'>
            <Notebook name='filter_design' source={JUPYTER_UTILITY_WIDGETS_SOURCE}></Notebook>
          </main>
          <footer className='App-footer'>
          <div style={{flexGrow:1}}></div>
          {/* TODO: Move into a component file */}
            <div style={{marginLeft: "auto", alignItems: "center", display: "flex"}}>
              <span> Powered by:</span>
              <a href='https://mystmd.org/thebe/' style={{display: "flex"}}>
                <img src="thebe_react_wide_logo.png" style={{height:"1em"}}></img>
              </a>
            </div>
          </footer>
        </div>
      </ThebeServerProvider>
    </ThebeBundleLoaderProvider>
  );
}

export default App;

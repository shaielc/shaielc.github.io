import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ConnectionHeader } from './Connect'
import { ThebeServerProvider, ThebeBundleLoaderProvider } from 'thebe-react'
import {makeConfiguration} from 'thebe-core'
import { Notebook} from './Notebook'
import { ServerModeType, ModeChooser } from './ServerMode'
import {NavLink, Outlet} from 'react-router-dom'
import { AppMenu } from './AppMenu';
import {ThemeProvider, createTheme} from '@mui/material/styles'

import { common } from '@mui/material/colors';
import ThebeReact from './icons/thebe_react_wide_logo.png'

const theme = createTheme({
  palette: {
    primary: {
      main: common['white'],
    },
    secondary: {
      main: common['black'],
    },
  },
});

const options = {
  kernelOptions: {
    name: 'Python 3'
  },
  binderOptions: {
      repo: "shaielc/jupyter-utility-widgets",
      ref: "HEAD"
  }
}

function App() {
  const [mode, setMode] = useState<ServerModeType>("Lite")

  return (
    <ThemeProvider theme={theme}>
    <ThebeBundleLoaderProvider loadThebeLite publicPath='../thebe'>
      <ThebeServerProvider connect={false} options={options} useBinder={mode === "Binder"} useJupyterLite={mode === "Lite"}>
        <div className="App">
          <header className="App-header">
            <AppMenu></AppMenu>
            <span>Jupyter Utility Widgets</span>
            <div style={{flexGrow:1}}></div>
            <ModeChooser mode={mode} setMode={setMode}></ModeChooser>
            <ConnectionHeader></ConnectionHeader>
          </header>
          <main className='App-main'>
            <Outlet />
            
          </main>
          <footer className='App-footer'>
          <div style={{flexGrow:1}}></div>
          {/* TODO: Move into a component file */}
            <div style={{marginLeft: "auto", alignItems: "center", display: "flex"}}>
              <span> Powered by:</span>
              <a href='https://mystmd.org/thebe/' style={{display: "flex"}}>
                <img src={ThebeReact} style={{height:"1em"}}></img>
              </a>
            </div>
          </footer>
        </div>
      </ThebeServerProvider>
    </ThebeBundleLoaderProvider>
    </ThemeProvider>
  );
}

export default App;

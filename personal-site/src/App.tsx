import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ConnectionHeader } from './Connect'
import { ThebeServerProvider, ThebeBundleLoaderProvider } from 'thebe-react'
import {makeConfiguration} from 'thebe-core'
import { Notebook} from './Notebook'

const config = makeConfiguration({

  binderOptions: {
      repo: "shaielc/jupyter-utility-widgets",
      ref: "HEAD"
  }
})


const JUPYTER_UTILITY_WIDGETS_SOURCE = 'https://raw.githubusercontent.com/shaielc/jupyter-utility-widgets/main/examples/'

function App() {
  // useEffect(
  //   () => {
  //       for (var i = 0; i < localStorage.length; i++) {
  //           let key = localStorage.key(i)
  //           if (!key) return;
  //           if (key.startsWith('thebe')) {
  //               localStorage.removeItem(key)
  //           }
  //       }
  //   }
  //   ,[])
  return (
    <ThebeBundleLoaderProvider>
      <ThebeServerProvider connect={false} config={config} useBinder={true} useJupyterLite={false} options={{savedSessionOptions: {enabled: false}}}>
        <div className="App">
          <header className="App-header">
            <div style={{flexGrow:1}}></div>
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

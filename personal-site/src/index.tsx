import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RouterProvider, createBrowserRouter, redirect} from 'react-router-dom'
import { NotebookPage } from './Notebook';
import { notebookSource } from './externalSources';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        path: '/site/nb/:notebookName',
        element: (
          <NotebookPage source={notebookSource['jupyter-utility-widgets'].source}></NotebookPage>
        )
      },
      {
        path: '/site/index.html'
      },
      {
        path: '/',
        loader: () => redirect('/site/')
      },
      {
        path: '/site/'
      }
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<div>FAIL</div>} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

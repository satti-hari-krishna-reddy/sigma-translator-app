import ReactDOM from 'react-dom/client';
import React from 'react';
import Header from './Header';
import DropDown from './DropDown';
import EditorResult from './CodeEditorWithResult';
import { GlobalStateProvider } from '../hooks/globalState';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalStateProvider>
    <Header />
    <DropDown />
    <EditorResult/>
  </GlobalStateProvider>
);


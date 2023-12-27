import React, { useState } from 'react';
import AceEditorComponent from './AceEditor';
import { useDropdownState } from '../hooks/globalStateHook';

function Editor() {
  const [code, setCode] = useState();
  const{val}=useDropdownState();
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <div>
      <AceEditorComponent code={code} onChange={handleCodeChange} />
    </div>
  );
}

export default Editor;

import React from "react";
import Editor from '../components/Editor';
import QueryResult from "../components/QueryResult";
const containerStyle = {
    display: 'flex',
    gap: '10px',
  };
  
  const componentStyle = {
    flex: '1', 
    minWidth: 0,
  };

 const EditorResult=()=>{
    return (
        <div style={containerStyle}>
          <div style={componentStyle}>
             <Editor/>
          </div>
        <div style={componentStyle}>
          <QueryResult />
        </div>
      </div>
      );
 };
export default EditorResult;
  
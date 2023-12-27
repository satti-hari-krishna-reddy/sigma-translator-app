import React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useDropdownState } from '../hooks/globalStateHook';

const QueryResult = () => {
  const { result } = useDropdownState();

  const containerStyle = {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #f0f0f0',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    position: 'relative', 
    borderRadius:'15px'
  };

  const textStyles = {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: '14px',
    minHeight: '100px',
    minWidth: '50px',
  };

  const copyIconStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px', 
    cursor: 'pointer',
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(result)
      .catch(err => console.error('Unable to copy to clipboard', err));
  };

  return (
    <div style={containerStyle}>
      <Tooltip title="Copy to Clipboard">
        <FileCopyIcon onClick={handleCopyClick} style={copyIconStyle} />
      </Tooltip>
      <Typography variant="body1" style={textStyles}>
        {result}
      </Typography>
    </div>
  );
};

export default QueryResult;

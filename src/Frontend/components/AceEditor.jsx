import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { Button, Menu, MenuItem, Input, Alert,CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useGlobalState } from '../hooks/globalState';

const AceEditorComponent = ({ code, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2,setIsLoading2] = useState(false);
  const{setResult,pipelines,val}=useGlobalState();

  const ValidateRule = async () => {
    try {

      setIsLoading(true);
      const apiUrl = 'http://127.0.0.1:5000/validate_rules';
      if(code === undefined){
        setResult('please upload or enter a sigma rule');
        setIsLoading(false);
        return;
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ yamlContent:code }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const resultData = await response.json();
      
      if (resultData.error) {
        setResult(resultData.error);
      } else {
        setResult(resultData.validation_result);
      }
      setIsLoading(false);
  
    } catch (error) {
      setResult(error.message);
      setIsLoading(false);
    }
  };
      
  const translateQuery = async () => {
    try {
      setIsLoading2(true);
      const apiUrl = 'http://127.0.0.1:5000/convert_rules';
    
      if (val === '' || code === undefined) {
        setResult('please select the backend or enter the sigma rule');
        setIsLoading2(false);
        return;

      } else {
        // Construct the command with processing pipelines
      }
    
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetBackend: val,
          pipelineIds: pipelines || null,  // Set to null if pipelines is undefined
          inputFiles: [code],  // Assuming code is the Sigma rule content
        }),
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      const resultData = await response.json();
    
      if (resultData.error) {
        setResult(resultData.error);
      } else {
        setResult(resultData.result);
      }
      setIsLoading2(false);
  
    } catch (error) {
      setResult(error.message);
      setIsLoading2(false);
    }
  };
  

  const [error, setError] = useState('');
  const [filename, setFilename] = useState('file.yaml');
  const [anchorEl, setAnchorEl] = useState(null);

  const editorStyle = {
    width: '100%',
    border: '1px solid #f0f0f0',
    backgroundColor: '#f0f0f0',
    fontFamily: 'monospace', 
    fontWeight: 'bold',  
    fontSize: '14px',
    borderRadius:'10px'
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          onChange(fileContent);
          setError(''); // Clear any previous errors
        };
        reader.readAsText(file);
      } else {
        setError('Invalid file format. Please upload a .yaml or .yml file.');
      }
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setAnchorEl(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="file"
          accept=".yaml, .yml"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            color="primary"
            style={{ marginBottom: '10px' }}
          >
            Upload Sigma Rule File
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          aria-controls={anchorEl ? 'save-menu' : undefined}
          aria-haspopup="true"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          style={{ marginBottom: '10px' }}
        >
          Save as ▼
        </Button>

        <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '10px' }}
        onClick={ValidateRule}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <>
            Validate
            <SearchIcon />
          </>
        )}
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={translateQuery}
        disabled={isLoading2}
        style={{ marginBottom: '10px' }}
        >
        {isLoading2 ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
          <>
            Translate <SwapHorizIcon />
          </>
        )}
      </Button>
      </div>

      <Menu
        id="save-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <Input
            placeholder="Enter filename with extension"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </MenuItem>
        <MenuItem>
          <Button onClick={handleDownload}>Download</Button>
        </MenuItem>
      </Menu>
      {error && <Alert severity="error">{error}</Alert>}
     
      <AceEditor
        mode="yaml"
        theme="t`morrow"
        value={code}
        onChange={onChange}
        style={editorStyle}
      />
    </div>
  );
};

export default AceEditorComponent;

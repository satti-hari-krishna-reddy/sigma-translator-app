import React from 'react';
import { useDropdownState } from '../hooks/globalStateHook';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Checkbox,
  OutlinedInput,
  ListItemText,
} from '@mui/material';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 3;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const names = [
  'crowdstrike_fdr',
  'sysmon',
  'powershell',
  'splunk_windows',
  'splunk_sysmon_acceleration',
  'splunk_cim ',
  'loki_grafana_logfmt ',
  'loki_promtail_sysmon',
  'loki_okta_system_log',
  'ecs_windows',
  'insight_idr'
];

const MultipleSelectCheckmarks = () => {
  const {pipelines, setPipelines} = useDropdownState();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPipelines(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center',margin: '10px'}}>
      <Typography sx={{ color: 'blue' }}>Pipelines: </Typography>
     <FormControl sx={{ m: 1, width: 200 }} size="small">
     <InputLabel id="demo-select-small-label">Select</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={pipelines}
        onChange={handleChange}
        input={<OutlinedInput label="Tag" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            <Checkbox checked={pipelines.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    </Box>
  );
};

const DropDown = () => {
  const {val, setVal} = useDropdownState();

  const handleChange = (event) => {
    setVal(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center',margin: "10px"}}>
      <Typography sx={{ color: 'blue' }}>Backend: </Typography>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-small-label">Select</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={val}
          label="value"
          onChange={handleChange}
        >
          {[
            'splunk',
            'opensearch_lucene',
            'loki',
            'datadog',
            'insight_idr',
            'elasticsearch',
            'power_shell',
            'eql',
            'lucene',
            'sqlite'
          ].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MultipleSelectCheckmarks /> 
    </Box>
  );
};

export default DropDown;

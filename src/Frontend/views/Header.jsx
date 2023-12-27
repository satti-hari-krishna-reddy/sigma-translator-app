import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const headerStyle = css`
  display: flex;
  justify-content: center;
`;

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar css={headerStyle}>
        <Typography variant="h6" component="div">
          Sigma Rule Converter
        </Typography>
      </Toolbar>
    </AppBar>
  );
};


export default Header;

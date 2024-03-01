import React, { useState } from 'react';
import { Button as BTNMUI, Box, useTheme, useMediaQuery, TextField, Typography, TextareaAutosize, Input, Modal } from '@mui/material';

function Unauthorized() {

  const theme = useTheme();

  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  return (
    <Box m={isNonMediumScreens ? "1.5rem 1.5rem 0rem" : "1.5rem 1.5rem 0rem"}
    >
      <Box
        gridColumn="span 12"
        gridRow="span 5"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
        width="100%"
      >
        <Typography>Unauthorized Access</Typography>
      </Box>
    </Box>
  )
}

export default Unauthorized
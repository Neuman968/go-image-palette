import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/system';
import { SwatchesPicker } from 'react-color';
import axios from 'axios';
import { ImagePalette, RGBAResult } from './types/ImagePalette';

function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function toSwatchFormat(arr: Array<RGBAResult>): Array<string> {
  return arr.map((color: RGBAResult) => `rgb(${color.R}, ${color.G}, ${color.B})`)
}

function App() {

  const [ palette, setPalette ] = React.useState<ImagePalette | undefined>()
  axios.get<ImagePalette>('http://localhost:8000/colors.json')
    .then((resp) => setPalette(resp.data))

  return (
    <React.Fragment>
      <ButtonAppBar />
      <Container>
      {/* <SwatchesPicker colors={[
        ['rgb(244,235,234)', 'pink', 'darkred'],
        ['blue', 'lightblue', 'cyan'],
      ]}/> */}
      { palette && <SwatchesPicker colors={[
        toSwatchFormat(palette.Red),
        toSwatchFormat(palette.Green),
        toSwatchFormat(palette.Blue),
        toSwatchFormat(palette.Yellow),
        toSwatchFormat(palette.Orange),
        toSwatchFormat(palette.Purple),
        toSwatchFormat(palette.Black),
        toSwatchFormat(palette.White),
        toSwatchFormat(palette.Brown),
        toSwatchFormat(palette.Gray),
        toSwatchFormat(palette.Pink),

      ]}/>
      }
      </Container>
    </React.Fragment>
  );
}

export default App;

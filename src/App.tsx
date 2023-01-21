import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/system';
import { CirclePicker, ColorResult, RGBColor, SwatchesPicker } from 'react-color';
import axios from 'axios';
import { ImagePalette, RGBAResult } from './types/ImagePalette';
import { Grid, Palette, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PaletteCard from './components/PaletteCard';
import { PaletteState } from './types/Palette';
import TopDistinctSwatches from './components/TopDistinctSwatches';
import { useLoadedWasm, WasmProvider } from './context/LoadedWasm';
import ViewImagePalette from './pages/ViewImagePalette';
import { rgbResultToHex } from './utils/colorUtils';
import { ReactComponent as Logo } from './assets/logo.svg'
import UploadPhotoDisplay from './components/UploadPhotoDisplay';

type GoFns = {
  SayHi?: () => void,
}

function Heading() {
  return <Box sx={{ flexGrow: 1 }}>
    <AppBar style={{ backgroundColor: '#333340' }} position="static">
      <Toolbar>
        <Logo style={{ width: '40px', height: '40px' }} />
        <Typography>
          Pic Palette
        </Typography>
      </Toolbar>
    </AppBar>
  </Box>
}

function App() {

  const [imagePalette, setImagePalette] = React.useState<ImagePalette | undefined>()

  const theme = React.useMemo(() => createTheme(
    imagePalette ? {
      palette: {
        primary: {
          main: rgbResultToHex(imagePalette?.Primary),
        },
        secondary: {
          main: rgbResultToHex(imagePalette?.Secondary),
        }
      },
    } : {}
  ), [imagePalette])

  return <ThemeProvider theme={theme}>
    <WasmProvider fetchParams="go-wasm.wasm">
      {/* <ViewImagePalette imagePalette={imagePalette} setImagePalette={setImagePalette} /> */}
      <Heading />
      <UploadPhotoDisplay />
    </WasmProvider>
  </ThemeProvider>
}

export default App;


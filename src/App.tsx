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
import ViewImagePalette from './pages/ViewImagePalette';
import { rgbResultToHex } from './utils/colorUtils';
import { ReactComponent as Logo } from './assets/logo.svg'
import UploadPhotoDisplay from './components/UploadPhotoDisplay';
import { Routes, Route, redirect, useNavigate } from "react-router-dom";
import { defaultPalette } from './types/DefaultPaletteOptions'
import { useLoadedWasm } from './context/LoadedWasm';
type GoFns = {
  SayHi?: () => void,
}

function Heading() {
  return <Box sx={{ flexGrow: 1 }}>
    <AppBar style={{ backgroundColor: '#333340' }} position="static">
      <Toolbar>
        <Logo style={{ width: '40px', height: '40px' }} />
        <Typography style={{ color: 'white' }}>
          Pic Palette
        </Typography>
      </Toolbar>
    </AppBar>
  </Box>
}

type GoWasmBinding = {
  GetJsonForImage: (byteArr: Uint8Array) => string
}

function App() {

  const [imagePalette, setImagePalette] = React.useState<ImagePalette | undefined>()

  const [file, setFile] = React.useState<File | undefined>()

  const loadedWasm = useLoadedWasm<GoWasmBinding>()

  const navigate = useNavigate()

  const setFileAndProcess = (file: File) => {
    setFile(file)
    file.arrayBuffer().then((arr: ArrayBuffer) => {
      const now = new Date()
      console.log('Loading File... ', now)
      const resultJson = loadedWasm?.GetJsonForImage(new Uint8Array(arr))
      if (resultJson) {
        console.log('Elapsed ', new Date().getTime() - now.getTime(), new Date())
        const iamgePaletteResp = JSON.parse(resultJson)
        setImagePalette(iamgePaletteResp)
        navigate('/view')
      }
      console.log('Result Json is ', resultJson)
    })
  }

  const theme = React.useMemo(() => createTheme(
    {
      palette: imagePalette ? {
        primary: {
          main: rgbResultToHex(imagePalette?.Primary),
        },
        secondary: {
          main: rgbResultToHex(imagePalette?.Secondary),
        }
      } : defaultPalette,
    }
  ), [imagePalette])

  return <ThemeProvider theme={theme}>
      <Heading />
      <Routes>
        <Route index element={<UploadPhotoDisplay setFile={setFileAndProcess} />} />
        <Route path="/examples" element={<></>} />
        <Route path="/view" element={<ViewImagePalette file={file!!} imagePalette={imagePalette!!} setImagePalette={setImagePalette} />} />
      </Routes>
  </ThemeProvider>
}

export default App;


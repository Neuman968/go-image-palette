import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ImagePalette, RGBAResult } from './types/ImagePalette';
import { Grid, Palette, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PaletteCard from './components/PaletteCard';
import { rgbResultToHex } from './utils/colorUtils';
import { ReactComponent as Logo } from './assets/logo.svg'
import UploadPhotoDisplay from './components/UploadPhotoDisplay';
import { Routes, Route, redirect, useNavigate } from "react-router-dom";
import { defaultPalette } from './types/DefaultPaletteOptions'
import { useLoadedWasm } from './context/LoadedWasm';
import ImagePaletteController from './pages/ImagePaletteController';
import LoadingWheel from './components/LoadingWheel';
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

  const [imagePalette, setImagePalette] = React.useState<ImagePalette>()

  const [file, setFile] = React.useState<File>()

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
        console.log('Logging response... Top Blue')
        console.log(iamgePaletteResp?.Blue)
        console.log('Logging Top Distinct Blue', iamgePaletteResp?.TopDistinctBlue)
        setImagePalette(iamgePaletteResp)
        navigate('/view')
      }
      // console.log('Result Json is ', resultJson)
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
        <Route path="/view" element={<ImagePaletteController file={file!!} imagePalette={imagePalette!!} setImagePalette={setImagePalette} />} />
      </Routes>
  </ThemeProvider>

}

export default App;


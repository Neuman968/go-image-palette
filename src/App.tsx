import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ImagePalette } from './types/ImagePalette';
import { Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { rgbResultToHex } from './utils/colorUtils';
import { ReactComponent as Logo } from './assets/logo.svg'
import UploadPhotoDisplay from './components/UploadPhotoDisplay';
import { Routes, Route, useNavigate } from "react-router-dom";
import { defaultPalette } from './types/DefaultPaletteOptions'
import { useLoadedWasm } from './context/LoadedWasm';
import ImagePaletteController from './pages/ImagePaletteController';
import LoadingPage from './pages/LoadingPage';

function Heading() {
  return <Box sx={{ flexGrow: 1 }}>
    <AppBar style={{ backgroundColor: '#333340' }} position="static">
      <Toolbar>
        <Logo style={{ width: '40px', height: '40px' }} />
        <Typography style={{ color: 'white' }}>
          Palette Picker
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
    navigate('/loading')
    file.arrayBuffer().then((arr: ArrayBuffer) => {
      const resultJson = loadedWasm?.GetJsonForImage(new Uint8Array(arr))
      if (resultJson) {
        const iamgePaletteResp = JSON.parse(resultJson)
        setImagePalette(iamgePaletteResp)
      } else {
      }
      navigate('/view')
    }).catch((err) => {
      console.error(err)
      navigate('/')
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
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/view" element={<ImagePaletteController file={file!!} imagePalette={imagePalette!!}
        // setImagePalette={setImagePalette}
      />} />
    </Routes>
  </ThemeProvider>

}

export default App;


import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ImagePalette } from './types/ImagePalette';
import { IconButton, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getPaletteStateFromImage, rgbResultToHex } from './utils/colorUtils';
import { ReactComponent as Logo } from './assets/logo.svg'
import UploadPhotoDisplay from './components/UploadPhotoDisplay';
import { Routes, Route, useNavigate } from "react-router-dom";
import { defaultPalette } from './types/DefaultPaletteOptions'
import { useLoadedWasm } from './context/LoadedWasm';
import ImagePaletteController from './pages/ImagePaletteController';
import LoadingPage from './pages/LoadingPage';
import GitHubIcon from '@mui/icons-material/GitHub';
import { PaletteState } from './types/Palette';

function Heading() {
  return <Box>
    <AppBar style={{ backgroundColor: '#333340' }} position="static">
      <Toolbar>
        <Logo style={{ width: '40px', height: '40px' }} />
        <Typography style={{ color: 'white' }}>
          Palette Picker
        </Typography>
        <Box sx={{ ml: 'auto' }} >
          <IconButton onClick={() => {
            window.location.href = "https://github.com/Neuman968/go-image-palette"
          }}>
            <GitHubIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  </Box>
}

type GoWasmBinding = {
  GetJsonForImage: (byteArr: Uint8Array) => string
}

function App() {

  const [imagePalette, setImagePalette] = React.useState<ImagePalette>()

  const [palette, setPalette] = React.useState<PaletteState | undefined>()

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
        setPalette(getPaletteStateFromImage(iamgePaletteResp))
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
      palette: palette ? {
        primary: {
          main: rgbResultToHex(palette?.Primary),
        },
        secondary: {
          main: rgbResultToHex(palette?.Secondary),
        }
      } : defaultPalette,
    }
  ), [palette])

  return <ThemeProvider theme={theme}>
    <Heading />
    <Routes>
      <Route index element={<UploadPhotoDisplay setFile={setFileAndProcess} />} />
      <Route path="/examples" element={<></>} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/view" element={<ImagePaletteController file={file!!} imagePalette={imagePalette!!}
        paletteState={palette}
        setPalette={setPalette}
      // setImagePalette={setImagePalette}
      />} />
    </Routes>
  </ThemeProvider>

}

export default App;

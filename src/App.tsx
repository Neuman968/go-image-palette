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
import ImagePalettePage from './pages/ImagePalettePage';
import LoadingPage from './pages/LoadingPage';
import GitHubIcon from '@mui/icons-material/GitHub';
import { PaletteState } from './types/Palette';
import { useNotifications } from '@toolpad/core';

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
  PaletteFromImage: (byteArr: Uint8Array) => string
}

function App() {

  const [imagePalette, setImagePalette] = React.useState<ImagePalette>()

  const [palette, setPalette] = React.useState<PaletteState | undefined>()

  const [file, setFile] = React.useState<File>()

  const loadedWasm = useLoadedWasm<GoWasmBinding>()

  const navigate = useNavigate()

  const notifications = useNotifications()

  const setFileAndProcess = (file: File) => {
    setFile(file)
    file.arrayBuffer().then((arr: ArrayBuffer) => {
      const resultJson = loadedWasm?.PaletteFromImage(new Uint8Array(arr))
      if (resultJson) {
        const imagePaletteResp = JSON.parse(resultJson)
        if (imagePaletteResp.Error) {
          notifications.show(`Error Loading Image ${imagePaletteResp.Error}`, {
            severity: 'error',
            autoHideDuration: 3000,
          });
          return
        }
        setImagePalette(imagePaletteResp)
        setPalette(getPaletteStateFromImage(imagePaletteResp))
      } else {
      }
      navigate('/view')
    }).catch((err) => {
      notifications.show(`Error Loading Image ${err}`, {
        severity: 'error',
        autoHideDuration: 3000,
      });
      console.error(err)
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
      <Route path="/view" element={<ImagePalettePage file={file!!} imagePalette={imagePalette!!}
        paletteState={palette}
        setPalette={setPalette}
      // setImagePalette={setImagePalette}
      />} />
      <Route path="*" element={<UploadPhotoDisplay setFile={setFileAndProcess} />} />
    </Routes>
  </ThemeProvider>

}

export default App;


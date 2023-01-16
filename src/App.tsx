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
import { Grid, Palette } from '@mui/material';
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

function ButtonAppBar({ primary, secondary, tertiary, fourth, fifth }: { primary: string, secondary: string, tertiary: string, fourth: string, fifth: string }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundImage: `linear-gradient(144deg,${primary}, ${secondary}, ${tertiary}, ${fourth}, ${fifth})`
        }}
      >
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
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function componentToHex(c: number): string {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbResultToHex(clrResult: RGBAResult): string {
  return rgbToHex(clrResult.R, clrResult.G, clrResult.B)
}

const newCacheFromResult = (arr: Array<Array<RGBAResult>>): Map<string, RGBAResult> => {
  const newCache = new Map<string, RGBAResult>()

  arr.forEach((rgbArray) => {
    rgbArray.forEach((rgb) => {
      newCache.set(rgbToHex(rgb.R, rgb.G, rgb.B), rgb)
    })
  })

  return newCache
}

type GoFns = {
  SayHi?: () => void,
}

function TheComponent() {
  const wasm = useLoadedWasm<GoFns>()
  wasm?.SayHi?.()
  return <p>{wasm ? 'Loaded!! ' : 'Loading....'}</p>
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
      <ViewImagePalette imagePalette={imagePalette} setImagePalette={setImagePalette} />
    </WasmProvider>
  </ThemeProvider>
}

export default App;

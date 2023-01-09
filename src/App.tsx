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

function toSwatchFormat(arr: Array<RGBAResult>): Array<string> {
  return arr.map((color: RGBAResult) => `rgb(${color.R}, ${color.G}, ${color.B})`)
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

function TopDistinctSwatches({ imagePalette, onClick }: { imagePalette: ImagePalette, onClick: (clr: ColorResult, ev: React.ChangeEvent) => void }) {
  const [selected, setSelected] = React.useState<ColorResult | undefined>()
  return <SwatchesPicker
    styles={{
      default: {
        picker: {
          display: 'flex',
          justifyContent: 'center',
        },
      }
    }}
    onChange={(clr: ColorResult, ev: React.ChangeEvent) => {
      setSelected(clr)
      onClick(clr, ev)
    }}
    onSwatchHover={(color: ColorResult, event: MouseEvent) => {
      // console.log(event.target)
      if (event.target instanceof HTMLElement) {
        // event.target.style.transform = 'translateY(-3%)'
        // event.target.style.boxShadow = `20px 20px 10px grey !important;`
        event.target.classList.add('selected-swatch')
        event.target.onmouseleave = (ev) => {
          if (ev.target instanceof HTMLElement) {
            // ev.target.style.transform = 'unset'
            ev.target.classList.remove('selected-swatch')
          }
        }
      }
    }}
    height={450}
    width={520}
    color={selected?.hex}
    colors={[
      toSwatchFormat(imagePalette.TopDistinctRed),
      toSwatchFormat(imagePalette.TopDistinctGreen),
      toSwatchFormat(imagePalette.TopDistinctBlue),
      toSwatchFormat(imagePalette.TopDistinctYellow),
      toSwatchFormat(imagePalette.TopDistinctOrange),
      toSwatchFormat(imagePalette.TopDistinctPurple),
      toSwatchFormat(imagePalette.TopDistinctPink),
      toSwatchFormat(imagePalette.TopDistinctBrown),
      toSwatchFormat(imagePalette.TopDistinctGray),
      toSwatchFormat(imagePalette.TopDistinctBlack),
    ]} />
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

function App() {

  const [imagePalette, setImagePalette] = React.useState<ImagePalette | undefined>()

  const [palette, setPalette] = React.useState<PaletteState | undefined>()

  const [selectedColor, setSelectedColor] = React.useState<keyof PaletteState | undefined>()

  const [rgbCache, setRgbCache] = React.useState<Map<string, RGBAResult>>()

  // hack in order to remove the box shadow from swatches-picker lol.
  React.useEffect(() => {
    return () => {
      const elem = document.getElementsByClassName('swatches-picker')
      const [first] = elem
      if (first && first instanceof HTMLElement) {
        const firstChild = first.childNodes[0]
        if (firstChild && firstChild instanceof HTMLElement) {
          const second = firstChild.firstElementChild
          if (second && second instanceof HTMLElement) {
            second.classList.add('no-box')
          }
        }
      }
    }

  }, [])

  React.useEffect(() => {
    axios.get<ImagePalette>('http://localhost:8000/colors.json')
      .then((resp) => {
        setImagePalette(resp.data)
        setPalette({ 
          Primary: resp.data.Primary,
          Secondary: resp.data.Secondary,
          Tertiary: resp.data.Tertiary,
          Fourth: resp.data.Fourth,
          Fifth: resp.data.Fifth,
         })
        const cacheMap = newCacheFromResult([
          resp.data.TopDistinctRed,
          resp.data.TopDistinctGreen,
          resp.data.TopDistinctBlue,
          resp.data.TopDistinctYellow,
          resp.data.TopDistinctOrange,
          resp.data.TopDistinctPurple,
          resp.data.TopDistinctPink,
          resp.data.TopDistinctBrown,
          resp.data.TopDistinctGray,
          resp.data.TopDistinctBlack,
          resp.data.TopDistinctWhite,
        ])
        setRgbCache(cacheMap)
      })
    return () => { }
  }, [])

  const handleColorClick = (clr: ColorResult, ev: React.ChangeEvent) => {
    console.log('Color Click Event... ', clr, rgbCache?.get(clr.hex), ev)
  }

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

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        {
          imagePalette &&
          <ButtonAppBar
            secondary={rgbToHex(imagePalette.Secondary.R, imagePalette.Secondary.G, imagePalette.Secondary.B)}
            primary={rgbToHex(imagePalette.Primary.R, imagePalette.Primary.G, imagePalette.Primary.B)}
            tertiary={rgbToHex(imagePalette.Tertiary.R, imagePalette.Tertiary.G, imagePalette.Tertiary.B)}
            fourth={rgbResultToHex(imagePalette.Fourth)}
            fifth={rgbResultToHex(imagePalette.Fifth)}
          />
        }
        <Container sx={{ overflowX: 'hidden' }}>
          {imagePalette &&
            <Grid sx={{ paddingTop: '1.5em', paddingBottom: '1.5em' }} container spacing={2} justifyContent="center">
              {/* //   <Grid item>
                //     <PaletteCard color={rgbResultToHex(palette?.Primary)} />
                //   </Grid>
                //   <Grid item>
                //     <PaletteCard color={rgbResultToHex(palette?.Secondary)}/>
                //   </Grid> */}
              {palette && 
                Object.keys(palette)
                .map((key: string) => key as keyof PaletteState)
                .map((key: keyof PaletteState) =>
                  <Grid item>
                    <PaletteCard
                      onClick={() => setSelectedColor(key !== selectedColor ? key : undefined)}
                      selected={selectedColor === key}
                      color={rgbResultToHex(imagePalette[key])}
                    />
                  </Grid>)
              }
            </Grid>
          }
          <Card sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'row',
          }}>
            <CardMedia
              sx={{
                height: 450,
                objectFit: 'contain',
              }}
              image="http://localhost:8000/BEACH.jpg"
              component="img"
              title=""
            />
            <CardContent sx={{ padding: '0px' }}>
              {imagePalette && <TopDistinctSwatches
                imagePalette={imagePalette}
                onClick={handleColorClick}
              />}
              <CardActions>
                <Button variant="contained" size="small">Share</Button>
                <Button variant="contained" size="small">Upload Another</Button>
              </CardActions>
            </CardContent>
          </Card>
          {/* {palette &&
              <CirclePicker
                onChange={handleColorClick}
                circleSize={60}
                styles={{
                  default: {
                    card: {
                      justifyContent: 'center',
                      width: '100%',
                      margin: '32px',
                    }
                  }
                }}
                colors={[
                  rgbResultToHex(palette.Primary),
                  rgbResultToHex(palette.Secondary),
                  rgbResultToHex(palette.Tertiary),
                  rgbResultToHex(palette.Fourth),
                  rgbResultToHex(palette.Fifth),
                ]} />
            } */}

          <Box display="flex" justifyContent="center">


          </Box>
        </Container>

      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;

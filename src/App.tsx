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
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PaletteCard from './components/PaletteCard';

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

  const [palette, setPalette] = React.useState<ImagePalette | undefined>()

  const [rgbCache, setRgbCache] = React.useState<Map<string, RGBAResult>>()

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
        setPalette(resp.data)
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
        console.log('Primary ', resp.data.Primary)
        console.log('Secondary ', resp.data.Secondary)

      })
    return () => { }
  }, [])

  const handleColorClick = (clr: ColorResult, ev: React.ChangeEvent) => {
    console.log('Color Click Event... ', clr, rgbCache?.get(clr.hex), ev)
  }

  const theme = React.useMemo(() => createTheme(
    palette ? {
      palette: {
        primary: {
          main: rgbResultToHex(palette?.Primary),
        },
        secondary: {
          main: rgbResultToHex(palette?.Secondary),
        }
      },
    } : {}
  ), [palette])


  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        {
          palette &&
          <ButtonAppBar
            secondary={rgbToHex(palette.Secondary.R, palette.Secondary.G, palette.Secondary.B)}
            primary={rgbToHex(palette.Primary.R, palette.Primary.G, palette.Primary.B)}
            tertiary={rgbToHex(palette.Tertiary.R, palette.Tertiary.G, palette.Tertiary.B)}
            fourth={rgbResultToHex(palette.Fourth)}
            fifth={rgbResultToHex(palette.Fifth)}
          />
        }
        <Container sx={{ overflowX: 'hidden' }}>
          {palette &&
            <Grid sx={{ paddingTop: '1.5em', paddingBottom: '1.5em' }} container spacing={2} justifyContent="center">
              {/* //   <Grid item>
                //     <PaletteCard color={rgbResultToHex(palette?.Primary)} />
                //   </Grid>
                //   <Grid item>
                //     <PaletteCard color={rgbResultToHex(palette?.Secondary)}/>
                //   </Grid> */}
              {
                [palette.Primary, palette.Secondary, palette.Tertiary, palette.Fourth, palette.Fifth].map((colr: RGBAResult) =>
                  <Grid item>
                    <PaletteCard color={rgbResultToHex(colr)} />
                  </Grid>)
              }
            </Grid>
          }
          <Card sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'row',
            // 'background': 'linear-gradient(to left, #f7ba2b 0%, #ea5358 100%)',
            // 'box-shadow': 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px',
          }}>
            <CardMedia
              sx={{
                height: 450,
                objectFit: 'contain',
              }}
              image="http://localhost:8000/IMG_5467.jpg"
              component="img"
              title=""
            />
            <CardContent sx={{ padding: '0px' }}>
              {palette && <TopDistinctSwatches
                imagePalette={palette}
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

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/system';
import { CirclePicker, ColorResult, SwatchesPicker } from 'react-color';
import axios from 'axios';
import { ImagePalette, RGBAResult } from './types/ImagePalette';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function ButtonAppBar({ primary, secondary }: { primary: string, secondary: string }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundImage: `linear-gradient(144deg,${primary}, ${secondary} 50%)`
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

function toColorMap(palette: ImagePalette): Record<string, Array<string>> {
  return {
    'Red': toSwatchFormat(palette.TopDistinctRed),
    'Green': toSwatchFormat(palette.TopDistinctGreen),
    'Blue': toSwatchFormat(palette.TopDistinctBlue),
    'Yellow': toSwatchFormat(palette.TopDistinctYellow),
    'Orange': toSwatchFormat(palette.TopDistinctOrange),
    'Purple': toSwatchFormat(palette.TopDistinctPurple),
    'Black': toSwatchFormat(palette.TopDistinctBlack),
    'White': toSwatchFormat(palette.TopDistinctWhite),
    'Brown': toSwatchFormat(palette.TopDistinctBrown),
    'Gray': toSwatchFormat(palette.TopDistinctGray),
    'Pink': toSwatchFormat(palette.TopDistinctPink),
  }
}

type SwatchProp = {
  color: string,
  rgbas: Array<string>,
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

function Swatch(props: SwatchProp) {
  return <Grid item>
    <SwatchesPicker colors={[props.rgbas]} />
    <Typography>{props.color}</Typography>
  </Grid>
}

function TopDistinctSwatches({ imagePalette, onClick }: { imagePalette: ImagePalette, onClick: (clr: ColorResult, ev: React.ChangeEvent) => void }) {
  return <SwatchesPicker
    styles={{
      default: {
        picker: {
          display: 'flex',
          justifyContent: 'center'
        }
      }
    }}
    onChange={onClick}
    height={200}
    width={1000}
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
    console.log('Color Click Event... ', clr, rgbCache?.get(clr.hex))
  }

  return (
    <React.Fragment>
      {
        palette &&
        <ButtonAppBar
          secondary={rgbToHex(palette.Secondary.R, palette.Secondary.G, palette.Secondary.B)}
          primary={rgbToHex(palette.Primary.R, palette.Primary.G, palette.Primary.B)}
        />
      }
      <Container>
        {palette &&
          <CirclePicker 
          onChange={handleColorClick}
          colors={[rgbResultToHex(palette.Primary), rgbResultToHex(palette.Secondary)]} />
        }
        <Card sx={{
          marginTop: 5,
          // 'background': 'linear-gradient(to left, #f7ba2b 0%, #ea5358 100%)',
          // 'box-shadow': 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px',
        }}>
          <CardMedia
            // sx={{
            //   height: 800,
            // }}
            image="http://localhost:8000/IMG_5467.jpg"
            component="img"
            title=""
          />
          <CardContent>
            <Box display="flex" justifyContent="center">
              {palette && <TopDistinctSwatches
                imagePalette={palette}
                onClick={handleColorClick}
              />}
            </Box>

          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Upload Another</Button>
          </CardActions>
        </Card>
      </Container>
    </React.Fragment>
  );
}

export default App;

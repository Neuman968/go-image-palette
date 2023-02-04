import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/system';
import { CirclePicker, ColorResult, RGBColor, SwatchesPicker } from 'react-color';
import axios from 'axios';
import { ImagePalette, RGBAResult } from '../types/ImagePalette';
import { AppBar, Grid, Palette, Theme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PaletteCard from '../components/PaletteCard';
import { PaletteState } from '../types/Palette';
import TopDistinctSwatches from '../components/TopDistinctSwatches';
import { useNavigate } from 'react-router';
import ToolDrawer from '../components/ToolDrawer';

function ButtonViewImagePaletteBar({ primary, secondary, tertiary, fourth, fifth }: { primary: string, secondary: string, tertiary: string, fourth: string, fifth: string }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    backgroundImage: `linear-gradient(144deg,${primary}, ${secondary}, ${tertiary}, ${fourth}, ${fifth})`,
                    height: '15px',
                }}
            >
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}
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

type Props = {
    file: File,
    imagePalette: ImagePalette,
    setImagePalette: (palette: ImagePalette) => void,
}

function ViewImagePalettePage(props: Props) {

    const [palette, setPalette] = React.useState<PaletteState | undefined>()

    const [selectedColor, setSelectedColor] = React.useState<keyof PaletteState | undefined>()

    const [selectedRgbaColor, setSelectedRgbaColor] = React.useState<RGBAResult | undefined>(undefined)

    const [rgbCache, setRgbCache] = React.useState<Map<string, RGBAResult>>()

    const navigate = useNavigate()

    React.useEffect(() => {
        const cacheMap = newCacheFromResult([
            props.imagePalette.TopDistinctRed,
            props.imagePalette.TopDistinctGreen,
            props.imagePalette.TopDistinctBlue,
            props.imagePalette.TopDistinctYellow,
            props.imagePalette.TopDistinctOrange,
            props.imagePalette.TopDistinctPurple,
            props.imagePalette.TopDistinctPink,
            props.imagePalette.TopDistinctBrown,
            props.imagePalette.TopDistinctGray,
            props.imagePalette.TopDistinctBlack,
            props.imagePalette.TopDistinctWhite,
        ])
        setRgbCache(cacheMap)
    }, [])

    React.useEffect(() => {
        setPalette({
            Primary: props.imagePalette.Primary,
            Secondary: props.imagePalette.Secondary,
            Tertiary: props.imagePalette.Tertiary,
            Fourth: props.imagePalette.Fourth,
            Fifth: props.imagePalette.Fifth,
        })
        const cacheMap = newCacheFromResult([
            props.imagePalette.TopDistinctRed,
            props.imagePalette.TopDistinctGreen,
            props.imagePalette.TopDistinctBlue,
            props.imagePalette.TopDistinctYellow,
            props.imagePalette.TopDistinctOrange,
            props.imagePalette.TopDistinctPurple,
            props.imagePalette.TopDistinctPink,
            props.imagePalette.TopDistinctBrown,
            props.imagePalette.TopDistinctGray,
            props.imagePalette.TopDistinctBlack,
            props.imagePalette.TopDistinctWhite,
        ])
        setRgbCache(cacheMap)
        // const canvas = document.getElementById('card-canvas') as HTMLCanvasElement
        // const img = new window.Image()
        // img.src = URL.createObjectURL(props.file)

        // var hRatio = canvas.width / img.width;
        // var vRatio = canvas.height / img.height;
        // var ratio = Math.min(hRatio, vRatio);
        // var centerShift_x = (canvas.width - img.width * ratio) / 2;
        // var centerShift_y = (canvas.height - img.height * ratio) / 2;
        // var ctx = canvas.getContext('2d')!!

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        // img.onload = () => {
        //     ctx.drawImage(img, 0, 0, img.width, img.height,
        //         centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        // }
        // var img = new Image();
        // img.src = URL.createObjectURL(props.file);
        // img.onload = function() {
        //     ctx?.drawImage(img, 0, 0, 400, 450);
        // }

        return () => { }
    }, [])

    const handleColorClick = (clr: ColorResult, ev: React.ChangeEvent) => {
        const selectedSwatch = { R: clr.rgb.r, G: clr.rgb.g, B: clr.rgb.b, A: clr.rgb.a || 0, Count: 0 }
        if (selectedColor && props.imagePalette) {
            const newState = props.imagePalette
            newState[selectedColor] = selectedSwatch
            props.setImagePalette(newState)
            setSelectedColor(undefined)
        } else {
            setSelectedRgbaColor(selectedSwatch)
        }
    }

    const paletteCardOnClick = (paletteKey: keyof PaletteState) => {
        if (selectedRgbaColor) {
            const newState = props.imagePalette
            newState[paletteKey] = selectedRgbaColor
            props.setImagePalette(newState)
            setSelectedColor(undefined)
            setSelectedRgbaColor(undefined)
        } else {
            setSelectedColor(paletteKey !== selectedColor ? paletteKey : undefined)
        }
    }

    return (
        <React.Fragment>
            {
                props.imagePalette &&
                <ButtonViewImagePaletteBar
                    secondary={rgbToHex(props.imagePalette.Secondary.R, props.imagePalette.Secondary.G, props.imagePalette.Secondary.B)}
                    primary={rgbToHex(props.imagePalette.Primary.R, props.imagePalette.Primary.G, props.imagePalette.Primary.B)}
                    tertiary={rgbToHex(props.imagePalette.Tertiary.R, props.imagePalette.Tertiary.G, props.imagePalette.Tertiary.B)}
                    fourth={rgbResultToHex(props.imagePalette.Fourth)}
                    fifth={rgbResultToHex(props.imagePalette.Fifth)}
                />
            }
            <Container sx={{ overflowX: 'hidden' }}>
                {props.imagePalette &&
                    <Grid sx={{ paddingTop: '1em', paddingBottom: '.2em' }} container spacing={2} justifyContent="center">
                        {palette &&
                            Object.keys(palette)
                                .map((key: string) => key as keyof PaletteState)
                                .map((key: keyof PaletteState) =>
                                    <Grid item>
                                        <PaletteCard
                                            onClick={() => paletteCardOnClick(key)}
                                            selected={selectedColor === key}
                                            color={rgbResultToHex(props.imagePalette!![key])}
                                        />
                                    </Grid>)
                        }
                    </Grid>
                }
                <Card sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <CardMedia
                        sx={{
                            height: 450,
                            objectFit: 'contain',
                        }}
                        component="img"
                        src={URL.createObjectURL(props.file)}
                        title=""
                    />
                    <CardContent sx={{ padding: '0px' }}>
                        {props.imagePalette && <TopDistinctSwatches
                            imagePalette={props.imagePalette}
                            onClick={handleColorClick}
                        />}
                        <CardActions>
                            <Button variant="contained" size="small">Share</Button>
                            <Button variant="contained" size="small" onClick={() => navigate('/')}>Upload Another</Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </Container>
        </React.Fragment>
    );
}

type ViewImageProps = {
    file: File | undefined,
    imagePalette: ImagePalette | undefined,
    setImagePalette: (palette: ImagePalette) => void,
}

function ViewImagePalette(props: ViewImageProps) {
    const navigate = useNavigate()

    const shouldRedirect = !props.file || !props.imagePalette

    if (shouldRedirect) {
        navigate('/')
    }

    return !shouldRedirect
        ? <React.Fragment>
            <ToolDrawer/>
            <ViewImagePalettePage file={props.file!!} imagePalette={props.imagePalette!!} setImagePalette={props.setImagePalette} />
        </React.Fragment>
        : <></>
}

export default ViewImagePalette;

import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/system';
import { CirclePicker, ColorResult, RGBColor, SwatchesPicker, Color } from 'react-color';
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
import { ColorItem } from '../types/ColorItem';

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

type Props = {
    file: File,
    imagePalette: ImagePalette,
    palette: PaletteState,
    setPaletteState: (palette: PaletteState) => void,
    rgbCache: Map<string, RGBAResult>,
    // setImagePalette: (palette: ImagePalette) => void,
    colorToolOnSelect: (color: ColorItem) => void,
}

function ViewImagePalette(props: Props) {

    const [selectedColor, setSelectedColor] = React.useState<keyof PaletteState | undefined>()

    const [selectedRgbaColor, setSelectedRgbaColor] = React.useState<RGBAResult | undefined>(undefined)

    const navigate = useNavigate()

    const handleColorClick = (clr: ColorResult, ev: React.ChangeEvent) => {
        const selectedSwatch = { R: clr.rgb.r, G: clr.rgb.g, B: clr.rgb.b, A: clr.rgb.a || 0, Count: 0 }
        if (selectedColor && props.imagePalette) {
            const newState = props.imagePalette
            newState[selectedColor] = selectedSwatch
            // props.setImagePalette(newState)
            setSelectedColor(undefined)
        } else {
            setSelectedRgbaColor(selectedSwatch)
        }
        props.colorToolOnSelect({ hex: clr.hex, rgbResult: selectedSwatch, reactColor: clr })
    }

    const paletteCardOnClick = (paletteKey: keyof PaletteState) => {
        if (selectedRgbaColor) {
            const newState = props.imagePalette
            newState[paletteKey] = selectedRgbaColor
            // props.setImagePalette(newState)
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
                        {props.palette &&
                            Object.keys(props.palette)
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
                            width: '45%',
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

export default ViewImagePalette


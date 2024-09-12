import React from 'react';
import { Container } from '@mui/system';
import { ColorResult } from 'react-color';
import { ImagePalette, RGBAResult } from '../types/ImagePalette';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import PaletteCard from '../components/PaletteCard';
import { PaletteState } from '../types/Palette';
import TopSwatches from '../components/TopSwatches';
import { useNavigate } from 'react-router';
import { ColorItem } from '../types/ColorItem';

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


function rgbaResultToReactColor(color: RGBAResult): ColorResult {
    return {
        hex: rgbResultToHex(color),
        rgb: { r: color.R, g: color.G, b: color.B, a: color.A },
        hsl: { h: color.H, s: color.S, l: color.L },
    }
}


function reactColorToRGBAResult(clr: ColorResult): RGBAResult {
    return { R: clr.rgb.r, G: clr.rgb.g, B: clr.rgb.b, A: clr.rgb.a || 0, H: clr.hsl.h, S: clr.hsl.s, L: clr.hsl.l || 0, Count: 0 }
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

    const [editingColor, setEditingColor] = React.useState<keyof PaletteState | undefined>()

    const [selectedRgbaColor, setSelectedRgbaColor] = React.useState<RGBAResult | undefined>(undefined)

    const navigate = useNavigate()

    const handleColorClick = (clr: ColorResult, ev: React.ChangeEvent) => {
        const selectedSwatch = reactColorToRGBAResult(clr)
        if (selectedColor && props.imagePalette) {
            if (editingColor === selectedColor) {

                const newState = props.imagePalette
                newState[selectedColor] = selectedSwatch
            }
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
            if (editingColor === paletteKey) {
                console.log('editing color', editingColor)
                newState[paletteKey] = selectedRgbaColor
            }
            // props.setImagePalette(newState)
            setSelectedColor(undefined)
            setSelectedRgbaColor(undefined)
        } else {
            setSelectedColor(paletteKey !== selectedColor ? paletteKey : undefined)
        }

        const paletteColor = props.imagePalette[paletteKey]
        const reactColor = rgbaResultToReactColor(paletteColor)

        props.colorToolOnSelect({ hex: reactColor.hex, rgbResult: paletteColor, reactColor: reactColor })
    }

    return (
        <React.Fragment>
            <Container sx={{ overflowX: 'hidden' }}>
                {props.imagePalette &&
                    <Grid sx={{ paddingTop: '1em', paddingBottom: '.2em' }} container spacing={2} justifyContent="center">
                        {props.palette &&
                            Object.keys(props.palette)
                                .map((key: string) => key as keyof PaletteState)
                                .map((key: keyof PaletteState) =>
                                    <Grid key={key} item>
                                        <PaletteCard
                                            onSelect={() => paletteCardOnClick(key)}
                                            onEdit={() => setEditingColor(editingColor === key ? undefined : key)}
                                            selected={selectedColor === key}
                                            editing={editingColor === key}
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
                        {props.imagePalette && <TopSwatches
                            imagePalette={props.imagePalette}
                            onClick={handleColorClick}
                        />}
                        <CardActions>
                            <Button variant="contained" size="small">Share</Button>
                            <Button color="secondary" variant="contained" size="small" onClick={() => navigate('/')}>Upload Another</Button>
                        </CardActions>
                    </CardContent>
                </Card>
            </Container>
        </React.Fragment>
    );
}

export default ViewImagePalette


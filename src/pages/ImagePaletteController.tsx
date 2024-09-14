import React from 'react'
import { ImagePalette, RGBAResult } from '../types/ImagePalette';
import { useNavigate } from 'react-router';
import ToolDrawer from '../components/ToolDrawer';
import { ColorItem } from '../types/ColorItem';
import { rgbToHex, rgbResultToHex } from '../utils/colorUtils';
import { PaletteState } from '../types/Palette';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid } from '@mui/material';
import PaletteAppBar from '../components/PaletteAppBar';
import PaletteCard from '../components/PaletteCard';
import TopSwatches from '../components/TopSwatches';
import { ColorResult } from 'react-color';
import tinycolor from 'tinycolor2';

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

function hexToColorResult(hex: string): ColorResult {
    const color = tinycolor(hex);
    const rgb = color.toRgb();
    const hsl = color.toHsl();

    return {
        hex: color.toHexString(),
        rgb: { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a },
        hsl: { h: hsl.h, s: hsl.s, l: hsl.l },
    };
}

type Props = {
    file: File | undefined,
    imagePalette: ImagePalette | undefined,
    // setImagePalette: (palette: ImagePalette) => void,
}


const newCacheFromResult = (arr: Array<Array<RGBAResult>>): Map<string, RGBAResult> => {
    const newCache = new Map<string, RGBAResult>()

    arr.forEach((rgbArray) => {
        rgbArray?.forEach((rgb) => {
            newCache.set(rgbToHex(rgb.R, rgb.G, rgb.B), rgb)
        })
    })

    return newCache
}

function ImagePaletteController(props: Props) {
    const navigate = useNavigate()

    const shouldRedirect = !props.file || !props.imagePalette

    const [selectedColor, _setSelectedColor] = React.useState<ColorItem | undefined>(undefined)

    const [selectedPalette, _setSelectedPalette] = React.useState<keyof PaletteState | undefined>()

    const [editingPalette, setEditingPalette] = React.useState<keyof PaletteState | undefined>()

    const [palette, setPalette] = React.useState<PaletteState>({
        Primary: props.imagePalette?.Primary!!,
        Secondary: props.imagePalette?.Secondary!!,
        Tertiary: props.imagePalette?.Tertiary!!,
        Fourth: props.imagePalette?.Fourth!!,
        Fifth: props.imagePalette?.Fifth!!
    })


    const handleColorChange = (_colorItem: ColorItem) => {

        const rgbColorResult : (RGBAResult | undefined) = _colorItem.rgbResult || rgbCache.get(_colorItem.hex)

        const reactColor = hexToColorResult(_colorItem.hex)

        const colorItem = { 
            hex: _colorItem.hex,
            reactColor: reactColor,
            rgbResult: rgbColorResult
        }

        _setSelectedColor(colorItem)
        if (editingPalette) {
            setPalette({ ...palette, [editingPalette]: colorItem.rgbResult || reactColorToRGBAResult(colorItem.reactColor!!) })
            setEditingPalette(undefined)
            _setSelectedPalette(undefined)
        }
    }

    const setSelectedPalette = (key: keyof PaletteState | undefined) => {
        _setSelectedPalette(key)
        if (key) {
            const color = palette[key]
            _setSelectedColor({
                hex: rgbResultToHex(color),
                reactColor: rgbaResultToReactColor(color),
                rgbResult: color
            })
        }
    }

    // Map lookup of all RGBAResults derived from image keyed by Hex code.
    const rgbCache: Map<string, RGBAResult> = React.useMemo(() => {
        if (props.imagePalette) {
            const cacheMap = newCacheFromResult([
                [props.imagePalette.Primary, props.imagePalette.Secondary, props.imagePalette.Tertiary, props.imagePalette.Fourth, props.imagePalette.Fifth],
                props.imagePalette.PrimarySimilar, props.imagePalette.SecondarySimilar, props.imagePalette.TertiarySimilar, props.imagePalette.FourthSimilar, props.imagePalette.FifthSimilar
            ])
            return cacheMap
        }
        return new Map()
    }, [props.imagePalette])

    if (shouldRedirect) {
        navigate('/')
    }

    return <React.Fragment>
        {
            props.imagePalette &&
            <PaletteAppBar
                colorHexes={
                    [rgbResultToHex(props.imagePalette.Primary),
                    rgbResultToHex(props.imagePalette.Secondary),
                    rgbResultToHex(props.imagePalette.Tertiary),
                    rgbResultToHex(props.imagePalette.Fourth),
                    rgbResultToHex(props.imagePalette.Fifth)]
                }
            />
        }
        {!shouldRedirect
            ? <Box display="flex">
                <Container sx={{ overflowX: 'hidden' }}>
                    {palette &&
                        <Grid sx={{ paddingTop: '1em', paddingBottom: '.2em' }} container spacing={2} justifyContent="center">
                            {palette &&
                                Object.keys(palette)
                                    .map((key: string) => key as keyof PaletteState)
                                    .map((key: keyof PaletteState) =>
                                        <Grid key={key} item>
                                            <PaletteCard
                                                onSelect={() => setSelectedPalette(selectedPalette === key ? undefined : key)}
                                                onEdit={() => setEditingPalette(editingPalette === key ? undefined : key)}
                                                selected={selectedPalette === key}
                                                editing={editingPalette === key}
                                                color={rgbResultToHex(palette!![key])}
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
                        {props.file && <CardMedia
                            sx={{
                                height: 450,
                                objectFit: 'contain',
                                width: '45%',
                            }}
                            component="img"
                            src={URL.createObjectURL(props.file)}
                            title=""
                        />
                        }
                        <CardContent sx={{ padding: '0px' }}>
                            {props.imagePalette && <TopSwatches
                                colorColumns={[props.imagePalette.PrimarySimilar, props.imagePalette.SecondarySimilar, props.imagePalette.TertiarySimilar, props.imagePalette.FourthSimilar, props.imagePalette.FifthSimilar]}
                                onClick={(colorResult: ColorResult, _: React.ChangeEvent) => {
                                    const colorFromImage = rgbCache.get(colorResult.hex)
                                    handleColorChange({
                                        hex: colorResult.hex,
                                        reactColor: colorResult,
                                        rgbResult: colorFromImage
                                    })
                                }}
                            />}
                            <CardActions>
                                <Button variant="contained" size="small">Share</Button>
                                <Button color="secondary" variant="contained" size="small" onClick={() => navigate('/')}>Upload Another</Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                </Container>
                <ToolDrawer
                    color={selectedColor}
                    handleSketchPickerChange={handleColorChange}
                    presetColors={[rgbResultToHex(palette.Primary),
                    rgbResultToHex(palette.Secondary),
                    rgbResultToHex(palette.Tertiary),
                    rgbResultToHex(palette.Fourth),
                    rgbResultToHex(palette.Fifth),
                    ]}
                />
            </Box>
            : <></>}
    </React.Fragment>
}

export default ImagePaletteController;
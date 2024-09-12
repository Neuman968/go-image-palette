import React from 'react'
import { ImagePalette, RGBAResult } from '../types/ImagePalette';
import { useNavigate } from 'react-router';
import ToolDrawer from '../components/ToolDrawer';
import ViewImagePalette from './ViewImagePalette';
import { ColorItem } from '../types/ColorItem';
import { rgbToHex, rgbResultToHex } from '../utils/colorUtils';
import { PaletteState } from '../types/Palette';
import { Box } from '@mui/material';
import PaletteAppBar from '../components/PaletteAppBar';

type Props = {
    file: File | undefined,
    imagePalette: ImagePalette | undefined,
    setImagePalette: (palette: ImagePalette) => void,
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

    const [selectedColor, setSelectedColor] = React.useState<ColorItem | undefined>(undefined)

    const [palette, setPalette] = React.useState<PaletteState>({
        Primary: props.imagePalette?.Primary!!,
        Secondary: props.imagePalette?.Secondary!!,
        Tertiary: props.imagePalette?.Tertiary!!,
        Fourth: props.imagePalette?.Fourth!!,
        Fifth: props.imagePalette?.Fifth!!
    })

    const rgbCache = React.useMemo(() => {
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
                <ViewImagePalette
                    file={props.file!!}
                    imagePalette={props.imagePalette!!}
                    palette={palette}
                    setPaletteState={setPalette}
                    colorToolOnSelect={setSelectedColor}
                    rgbCache={rgbCache || new Map()}
                />
                <ToolDrawer
                    color={selectedColor}
                    colorCount={rgbCache.get(selectedColor?.hex)?.Count}
                    handleSketchPickerChange={setSelectedColor}
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
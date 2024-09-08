import React from 'react'
import { ImagePalette, RGBAResult } from '../types/ImagePalette';
import { useNavigate } from 'react-router';
import ToolDrawer from '../components/ToolDrawer';
import ViewImagePalette from './ViewImagePalette';
import { ColorItem } from '../types/ColorItem';
import { rgbToHex, rgbResultToHex } from '../utils/colorUtils';
import { PaletteState } from '../types/Palette';

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

    console.log('Rendering Palette Controller')

    const rgbCache = React.useMemo(() => {
        console.log('Computing rgb cache')
        if (props.imagePalette) {
            const cacheMap = newCacheFromResult([
                // props.imagePalette.TopDistinctRed,
                // props.imagePalette.TopDistinctGreen,
                // props.imagePalette.TopDistinctBlue,
                // props.imagePalette.TopDistinctYellow,
                // props.imagePalette.TopDistinctOrange,
                // props.imagePalette.TopDistinctPurple,
                // props.imagePalette.TopDistinctPink,
                // props.imagePalette.TopDistinctBrown,
                // props.imagePalette.TopDistinctGray,
                // props.imagePalette.TopDistinctBlack,
                // props.imagePalette.TopDistinctWhite,
                // props.imagePalette.Red,
                // props.imagePalette.Green,
                // props.imagePalette.Blue,
                // props.imagePalette.Yellow,
                // props.imagePalette.Orange,
                // props.imagePalette.Purple,
                // props.imagePalette.Pink,
                // props.imagePalette.Brown,
                // props.imagePalette.Gray,
                // props.imagePalette.Black,
                // props.imagePalette.White,
                [props.imagePalette.Primary, props.imagePalette.Secondary, props.imagePalette.Tertiary, props.imagePalette.Fourth, props.imagePalette.Fifth],
            ])
            return cacheMap
        }
        return new Map()
        // setRgbCache(cacheMap)
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

    }, [props.imagePalette])

    if (shouldRedirect) {
        navigate('/')
    }

    return !shouldRedirect
        ? <React.Fragment>
            <ToolDrawer
                color={selectedColor}
                colorCount={rgbCache.get(selectedColor?.hex)?.Count}
                handleSketchPickerChange={setSelectedColor}
                presetColors={[rgbResultToHex(palette.Primary), 
                    rgbResultToHex(palette.Secondary),
                    rgbResultToHex(palette.Tertiary),
                    rgbResultToHex(palette.Tertiary),
                    rgbResultToHex(palette.Fourth),
                    rgbResultToHex(palette.Fifth),
                ]}
            />
            <ViewImagePalette
                file={props.file!!}
                imagePalette={props.imagePalette!!}
                palette={palette}
                setPaletteState={setPalette}
                colorToolOnSelect={setSelectedColor}
                rgbCache={rgbCache || new Map()}
            />
        </React.Fragment>
        : <></>
}

export default ImagePaletteController;
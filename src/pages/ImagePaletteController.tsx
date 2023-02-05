import React from 'react'
import { ColorResult } from 'react-color';
import { ImagePalette, RGBAResult } from '../types/ImagePalette';
import { useNavigate } from 'react-router';
import ToolDrawer from '../components/ToolDrawer';
import ViewImagePalette from './ViewImagePalette';

type Props = {
    file: File | undefined,
    imagePalette: ImagePalette | undefined,
    setImagePalette: (palette: ImagePalette) => void,
}

function ImagePaletteController(props: Props) {
    const navigate = useNavigate()

    const shouldRedirect = !props.file || !props.imagePalette

    const [ color, setColor ] = React.useState<ColorResult | undefined>(undefined)

    if (shouldRedirect) {
        navigate('/')
    }

    return !shouldRedirect
        ? <React.Fragment>
            <ToolDrawer color={color?.hex} handleSketchPickerChange={(clr) => setColor(clr)}/>
            <ViewImagePalette file={props.file!!} imagePalette={props.imagePalette!!} setImagePalette={props.setImagePalette} />
        </React.Fragment>
        : <></>
}

export default ImagePaletteController;
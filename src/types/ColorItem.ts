import { ColorResult } from "react-color"
import { RGBAResult } from "./ImagePalette"

export type ColorItem = {
    hex: string,
    rgbResult?: RGBAResult | undefined,
    reactColor?: ColorResult | undefined,
}
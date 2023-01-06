import { RGBAResult } from '../types/ImagePalette'

export function componentToHex(c: number): string {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function rgbResultToHex(clrResult: RGBAResult): string {
    return rgbToHex(clrResult.R, clrResult.G, clrResult.B)
}

/*
 content: "Add to Cart";
 padding-top: 1.25em;
 padding-left: 1.25em;
 position: absolute;
 left: 0;
 bottom: -60px;
 background: #00AC7C;
 color: #fff;
 height: 2.5em;
 width: 100%;
 transition: all 80ms;
 font-weight: 600;
 text-transform: uppercase;
*/
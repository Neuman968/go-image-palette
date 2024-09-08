import React from 'react'
import { CirclePicker, ColorResult, RGBColor, SwatchesPicker } from 'react-color';
import { ImagePalette, RGBAResult } from '../types/ImagePalette';


function toSwatchFormat(arr: Array<RGBAResult>): Array<string> {
    return arr.map((color: RGBAResult) => `rgb(${color.R}, ${color.G}, ${color.B})`)
}

function TopDistinctSwatches({ imagePalette, onClick }: { imagePalette: ImagePalette, onClick: (clr: ColorResult, ev: React.ChangeEvent) => void }) {

    return <></>
    // const [selected, setSelected] = React.useState<ColorResult | undefined>()

    // // hack in order to remove the box shadow from swatches-picker lol.
    // React.useEffect(() => {
    //     return () => {
    //         const elem = document.getElementsByClassName('swatches-picker')
    //         const [first] = elem
    //         if (first && first instanceof HTMLElement) {
    //             const firstChild = first.childNodes[0]
    //             if (firstChild && firstChild instanceof HTMLElement) {
    //                 const second = firstChild.firstElementChild
    //                 if (second && second instanceof HTMLElement) {
    //                     second.classList.add('no-box')
    //                 }
    //             }
    //         }
    //     }

    // }, [])


    // return <SwatchesPicker
    //     styles={{
    //         default: {
    //             picker: {
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //             },
    //         }
    //     }}
    //     onChange={(clr: ColorResult, ev: React.ChangeEvent) => {
    //         setSelected(clr)
    //         onClick(clr, ev)
    //     }}
    //     onSwatchHover={(color: ColorResult, event: MouseEvent) => {
    //         // console.log(event.target)
    //         if (event.target instanceof HTMLElement) {
    //             // event.target.style.transform = 'translateY(-3%)'
    //             // event.target.style.boxShadow = `20px 20px 10px grey !important;`
    //             event.target.classList.add('selected-swatch')
    //             event.target.onmouseleave = (ev) => {
    //                 if (ev.target instanceof HTMLElement) {
    //                     // ev.target.style.transform = 'unset'
    //                     ev.target.classList.remove('selected-swatch')
    //                 }
    //             }
    //         }
    //     }}
    //     height={450}
    //     width={520}
    //     color={selected?.hex}
    //     colors={[
    //         toSwatchFormat(imagePalette.TopDistinctRed),
    //         toSwatchFormat(imagePalette.TopDistinctGreen),
    //         toSwatchFormat(imagePalette.TopDistinctBlue),
    //         toSwatchFormat(imagePalette.TopDistinctYellow),
    //         toSwatchFormat(imagePalette.TopDistinctOrange),
    //         toSwatchFormat(imagePalette.TopDistinctPurple),
    //         toSwatchFormat(imagePalette.TopDistinctPink),
    //         toSwatchFormat(imagePalette.TopDistinctBrown),
    //         toSwatchFormat(imagePalette.TopDistinctGray),
    //         toSwatchFormat(imagePalette.TopDistinctBlack),
    //     ]} />
}

export default TopDistinctSwatches

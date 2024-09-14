import React from 'react'
import { ColorResult, SwatchesPicker } from 'react-color';
import { RGBAResult } from '../types/ImagePalette';


function toSwatchFormat(arr: Array<RGBAResult>): Array<string> {
    return arr.map((color: RGBAResult) => `rgb(${color.R}, ${color.G}, ${color.B})`)
}

type Props = {
    colorColumns: Array<Array<RGBAResult>>,
    onClick: (clr: ColorResult, ev: React.ChangeEvent) => void
}

function TopSwatches(props: Props) {

    const [selected, setSelected] = React.useState<ColorResult | undefined>()

    // hack in order to remove the box shadow from swatches-picker lol.
    React.useEffect(() => {
        return () => {
            const elem = document.getElementsByClassName('swatches-picker')
            const [first] = elem
            if (first && first instanceof HTMLElement) {
                const firstChild = first.childNodes[0]
                if (firstChild && firstChild instanceof HTMLElement) {
                    const second = firstChild.firstElementChild
                    if (second && second instanceof HTMLElement) {
                        second.classList.add('no-box')
                    }
                }
            }
        }

    }, [])


    return <SwatchesPicker
        styles={{
            default: {
                picker: {
                    display: 'flex',
                    justifyContent: 'center',
                },
            }
        }}
        onChange={(clr: ColorResult, ev: React.ChangeEvent) => {
            setSelected(clr)
            props.onClick(clr, ev)
        }}
        onSwatchHover={(color: ColorResult, event: MouseEvent) => {
            if (event.target instanceof HTMLElement) {
                event.target.classList.add('selected-swatch')
                event.target.onmouseleave = (ev) => {
                    if (ev.target instanceof HTMLElement) {
                        // ev.target.style.transform = 'unset'
                        ev.target.classList.remove('selected-swatch')
                    }
                }
            }
        }}
        height={450}
        width={520}
        color={selected?.hex}
        colors={props.colorColumns.map((column) => toSwatchFormat(column))} />
}

export default TopSwatches

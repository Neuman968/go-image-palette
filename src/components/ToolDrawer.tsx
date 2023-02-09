import { Drawer, Typography } from '@mui/material'
import { Box, colorChannel } from '@mui/system'
import React from 'react'
import { SketchPicker } from 'react-color'
import { ColorItem } from '../types/ColorItem'

type Props = {
    handleSketchPickerChange: (color: ColorItem, event: React.ChangeEvent<HTMLInputElement>) => void,
    color?: ColorItem,
    colorCount: number | undefined,
    presetColors: Array<string>,
}

function ToolDrawer(props: Props) {
    const colorCount = props.colorCount || 0

    return <Drawer
        anchor='right'
        open={true}
        variant='permanent'
    >
        <Box p={1}>
            <SketchPicker
                onChangeComplete={(colr, ev) => props.handleSketchPickerChange({ hex: colr.hex }, ev)}
                color={props.color?.hex}
                presetColors={props.presetColors}
            />
            <Typography>{colorCount} times in image</Typography>
        </Box>
    </Drawer>
}

export default ToolDrawer
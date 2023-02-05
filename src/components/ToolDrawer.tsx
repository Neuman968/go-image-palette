import { Drawer } from '@mui/material'
import React from 'react'
import { SketchPicker, ColorResult, Color } from 'react-color'

type Props = {
    handleSketchPickerChange: (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => void,
    color? : string 
}

function ToolDrawer(props: Props) {
    return <Drawer
        anchor='right'
        open={true}
        variant='permanent'
    >
        <SketchPicker
            onChangeComplete={props.handleSketchPickerChange}
            color={props.color}
        />
    </Drawer>
}

export default ToolDrawer
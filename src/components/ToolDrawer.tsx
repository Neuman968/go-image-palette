import { Button, Drawer, IconButton, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'
import React from 'react'
import { SketchPicker } from 'react-color'
import { ColorItem } from '../types/ColorItem'
import EyeDropperButton from './EyeDropperButton'
type Props = {
    handleSketchPickerChange: (color: ColorItem) => void,
    color?: ColorItem,
    colorCount: number | undefined,
    presetColors: Array<string>,
}

const drawerWidth = 220

function ToolDrawer(props: Props) {
    const colorCount = props.colorCount || 0

    return <Drawer
        anchor='right'
        open={true}
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
        }}
        variant='permanent'
    >
        <Stack>
            <SketchPicker
                onChangeComplete={(colr, ev) => props.handleSketchPickerChange({ hex: colr.hex })}
                color={props.color?.hex}
                presetColors={props.presetColors}
            />
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <EyeDropperButton onColorSelect={(hex: string) => props.handleSketchPickerChange({ hex: hex })} />
                        </TableCell>
                        <TableCell />
                    </TableRow>
                    {colorCount > 0 ? <TableRow>
                        <TableCell>{colorCount}</TableCell>
                        <TableCell>Occurrances</TableCell>
                    </TableRow> : <></>}
                    {props.color?.reactColor ? <><TableRow>
                        <TableCell>{props.color?.reactColor?.hsl.h.toFixed(2)}</TableCell>
                        <TableCell>Hue</TableCell>
                    </TableRow>
                        <TableRow>
                            <TableCell>{props.color?.reactColor?.hsl.s.toFixed(2)}</TableCell>
                            <TableCell>Saturation</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{props.color?.reactColor?.hsl.l.toFixed(2)}</TableCell>
                            <TableCell>Luminance</TableCell>
                        </TableRow></> : <></>}
                </TableBody>
            </Table>
        </Stack>
    </Drawer>
}

export default ToolDrawer
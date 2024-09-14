import { alpha, Drawer, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material'
import { SketchPicker } from 'react-color'
import { ColorItem } from '../types/ColorItem'
import EyeDropperButton from './EyeDropperButton'
import { styled } from '@mui/material/styles';
type Props = {
    handleSketchPickerChange: (color: ColorItem) => void,
    color?: ColorItem,
    presetColors: Array<string>,
}

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       backgroundColor: theme.palette.primary.light,
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14,
//     },
//   }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: alpha(theme.palette.secondary.light, 0.8),
    },
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.primary.light,
      },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const drawerWidth = 220

function ToolDrawer(props: Props) {
    const colorCount = props.color?.rgbResult?.Count || 0

    console.log('Draw color', props.color)

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
                    <StyledTableRow>
                        <TableCell>
                            <EyeDropperButton onColorSelect={(hex: string) => props.handleSketchPickerChange({ hex: hex })} />
                        </TableCell>
                        <TableCell/>
                    </StyledTableRow>
                    {colorCount > 0 ? <StyledTableRow>
                        <TableCell>{colorCount}</TableCell>
                        <TableCell>Occurrances</TableCell>
                    </StyledTableRow> : <></>}
                    {props.color?.reactColor ? <><StyledTableRow>
                        <TableCell>{props.color?.reactColor?.hsl.h.toFixed(2)}</TableCell>
                        <TableCell>Hue</TableCell>
                    </StyledTableRow>
                        <StyledTableRow>
                            <TableCell>{props.color?.reactColor?.hsl.s.toFixed(2)}</TableCell>
                            <TableCell>Saturation</TableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                            <TableCell>{props.color?.reactColor?.hsl.l.toFixed(2)}</TableCell>
                            <TableCell>Luminance</TableCell>
                        </StyledTableRow></> : <></>}
                </TableBody>
            </Table>
        </Stack>
    </Drawer>
}

export default ToolDrawer
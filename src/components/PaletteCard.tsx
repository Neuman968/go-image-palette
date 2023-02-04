import { Box, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'

type Props = {
    color: string,
    selected: boolean,
    onClick: () => void,
}

function PaletteCard(props: Props) {

    return <Card
        onClick={props.onClick}
        sx={{
            width: '8.875em',
            height: '6.875em',
            '&:hover': {
                boxShadow: !props.selected ? `${props.color} 0px 13px 47px -5px, rgba(180, 71, 71, 0.3) 0px 8px 16px -8px` : ''
            },
            boxShadow: props.selected ? 'gold 0px 9px 43px -2px, rgba(180, 71, 71, 0.3) 0px 4px 12px -4px' : '',
            transform: props.selected ? 'translateY(-10%)' : '',
        }}>
        <CardContent sx={{ padding: '8px' }}>
            <Box sx={{
                backgroundColor: props.color,
                height: '5.875em',
                width: '100%',
                borderRadius: '8px',
            }}>
            </Box>
            {/* <Typography align='center' variant="body1">
                {props.color}
            </Typography> */}
        </CardContent>

    </Card>
}

export default PaletteCard
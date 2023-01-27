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
            height: '8.5em',
            '&:hover': {
                boxShadow: !props.selected ? `${props.color} 0px 13px 47px -5px, rgba(180, 71, 71, 0.3) 0px 8px 16px -8px` : ''
            },
            boxShadow: props.selected ? 'gold 0px 9px 43px -2px, rgba(180, 71, 71, 0.3) 0px 4px 12px -4px' : '',
            transform: props.selected ? 'translateY(-10%)' : '',
        }}>
        <CardContent>
            <Box sx={{
                backgroundColor: props.color,
                height: '4.5em',
                width: '100%',
                borderRadius: '8px',
            }}>
            </Box>
        </CardContent>
        <CardActions>
            <Typography variant="body1">
                {props.color}
            </Typography>
        </CardActions>
    </Card>
}

export default PaletteCard
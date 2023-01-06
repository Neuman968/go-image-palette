import { Box, Card, CardActions, CardContent, Typography } from '@mui/material'
import React from 'react'

type Props = {
    color: string,
}

function PaletteCard(props: Props) {

    return <Card sx={{
        width: '8.875em',
        height: '11.5em',
        '&:hover': {
            transform: 'translateY(-10%);',
            boxShadow: `${props.color} 0px 13px 47px -5px, rgba(180, 71, 71, 0.3) 0px 8px 16px -8px`
        },
        // boxShadow: '0px 1px 13px rgba(0,0,0,0.1)',
        // cursor: 'pointer',
        // transition: 'all 120ms',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        // background: '#fff',
        // padding: '0.5em',
        // paddingBottom: '3.4em',
    }}>
        <CardContent>
            <Box sx={{
                backgroundColor: props.color,
                height: '6.5em',
                width: '100%',
                borderRadius: '8px',

                // hover: {
                //     transform: 'translateY(-25%)',

                // }
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
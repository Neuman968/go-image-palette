import { Badge, Box, Card, CardActions, CardContent, IconButton, Typography } from '@mui/material'
import React from 'react'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
type Props = {
    color: string,
    editing: boolean,
    selected: boolean,
    onSelect: () => void,
    onEdit: () => void,
}

function PaletteCard(props: Props) {

    return <Badge
        color='secondary'
        invisible={!props.selected}
        badgeContent={
            <IconButton sx={{ width: 20 }} onClick={props.onEdit}>
                <ModeEditOutlineIcon sx={{ fontSize: 20 }} />
            </IconButton>
        }
    >
        <Card
            onClick={props.onSelect}
            sx={{
                backgroundColor: props.color,
                borderRadius: '20px',
                width: '8.875em',
                height: '4.875em',
                '&:hover': {
                    boxShadow: !props.selected ? `${props.color} 0px 13px 47px -5px, rgba(180, 71, 71, 0.3) 0px 8px 16px -8px` : ''
                },
                boxShadow: props.selected ? `${props.editing ? 'gold' : props.color} 0px 9px 43px -2px, rgba(180, 71, 71, 0.3) 0px 4px 12px -4px` : '',
                transform: props.selected ? 'translateY(-10%)' : '',
            }}>
            <CardContent sx={{ padding: '8px' }}>
            </CardContent>

        </Card>
    </Badge>
}

export default PaletteCard
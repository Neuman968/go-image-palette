import { Drawer } from '@mui/material'
import React from 'react'

function ToolDrawer() {
    return <Drawer
        anchor='right'
        open={true}
        variant='permanent'
    >
        <p>Hello!</p>
    </Drawer>
}

export default ToolDrawer
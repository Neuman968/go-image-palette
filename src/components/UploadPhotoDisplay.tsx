import { Button, ButtonGroup, Grid, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import beachImage from '../assets/BEACH.jpg'
import React from 'react'

function UploadPhotoDisplay() {
    return <Container>
        <Grid container pt={10} justifyContent="center" spacing={10}>
            <Grid item xs={4} sx={{ boxSizing: 'content-box' }}>
                <Box justifyContent="center" sx={{ width: '100%' }}>
                    <Typography pt={3} pb={3} align="center" variant="h4">Generate a Color Palette from any photo.</Typography>
                    <Typography align="left" variant="body1">
                        Draw inspiration from the colors of your photos. All processing is done using your device's browser, so your picture is never uploaded anywhere!
                    </Typography>
                    <Box pt={2} display="flex" justifyContent="center">
                        <Box pr={2}>
                            <Button variant="contained">Upload</Button>
                        </Box>
                        <Box pl={2}>
                            <Button variant="contained">Examples</Button>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box>
                    <img alt="Beach picture" style={{ width: '300px', height: '300px', borderRadius: '8px' }} src={beachImage} />
                </Box>
            </Grid>
        </Grid>
    </Container>
}

export default UploadPhotoDisplay
import { Button, Grid, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import beachImage from '../assets/BEACH.jpg'
import React from 'react'
import LoadingPage from '../pages/LoadingPage'

type Props = {
    setFile: (file: File) => void,
    loading: boolean
}

function UploadPhotoDisplay(props: Props) {


    return <Container>
        {props.loading === true && <LoadingPage />}
        {props.loading === false && <Grid container pt={10} justifyContent="center" spacing={10}>
            <Grid item xs={4} sx={{ boxSizing: 'content-box' }}>
                <Box justifyContent="center" sx={{ width: '100%' }}>
                    <Typography pt={6} pb={6} align="center" variant="h4">Generate a Color Palette from any photo.</Typography>
                    <Typography pb={3} align="left" variant="body1">
                        Draw inspiration from the colors of your photos. All processing is done using your device's browser, so your picture never leaves your device!
                    </Typography>
                    <Box pt={2} display="flex" justifyContent="center">
                        <Box pr={2}>
                            <input
                                style={{ display: "none" }}
                                id="contained-button-file"
                                type="file"
                                accept='image/png, image/jpeg'
                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = ev.target?.files?.[0]
                                    if (file) {
                                        props.setFile(file)
                                    }
                                }}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" component="span">Upload</Button>
                            </label>
                        </Box>
                        {/* <Box pl={2}>
                            <Button color="secondary" variant="contained">Examples</Button>
                        </Box> */}
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={4}>
                <Box>
                    <img alt="Beach" style={{ width: '450px', height: '400px', borderRadius: '8px' }} src={beachImage} />
                </Box>
            </Grid>
        </Grid>
        }
    </Container>
}

export default UploadPhotoDisplay
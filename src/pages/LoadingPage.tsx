import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

function GradientCircularProgress() {
    return (
        <React.Fragment>
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="rainbow_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="red" />
                        <stop offset="15%" stopColor="orange" />
                        <stop offset="30%" stopColor="yellow" />
                        <stop offset="45%" stopColor="green" />
                        <stop offset="60%" stopColor="blue" />
                        <stop offset="75%" stopColor="indigo" />
                        <stop offset="90%" stopColor="violet" />
                        <stop offset="100%" stopColor="red" />
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress
                size={100}
                thickness={5}
                sx={{ 'svg circle': { stroke: 'url(#rainbow_gradient)' } }} />
        </React.Fragment>
    );
}

function LoadingPage() {

    console.log("Rendering Loading Page.")
    return (
        <Stack spacing={6} sx={{
            marginTop: '20vh',
            alignItems: 'center',
        }}>
            <Typography variant="h2">Loading</Typography>
            <GradientCircularProgress />
        </Stack>
    )
}

export default LoadingPage
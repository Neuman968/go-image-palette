import { styled, Theme, useTheme } from '@mui/material'
import React from 'react'

type SpinnerProps = {
    theme: Theme,
}


const Spinner = styled('div') ((props: SpinnerProps) => ({
    width: '1.5em',
    height: '1.5em',
    borderRadius: '50%',
    border: '2px solid #444',
    boxShadow: '-10px -10px 10px #6359f8, 0px -10px 10px 0px #9c32e2, 10px -10px 10px #f36896, 10px 0 10px #ff0b0b, 10px 10px 10px 0px#ff5500, 0 10px 10px 0px #ff9500, -10px 10px 10px 0px #ffb700;',
    '@keyframes rot55': {
        'to': {
          transform: 'rotate(360deg)'
        }
      },
    animation: 'rot55 0.7s linear infinite',
    backgroundColor: props.theme.palette.secondary.main, // todo set background color.
}))

function LoadingWheel() {
    const theme = useTheme()
    return <Spinner theme={theme}/>
}

export default LoadingWheel
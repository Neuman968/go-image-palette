import { AppBar, Box } from "@mui/material";


function PaletteAppBar({ colorHexes }: { colorHexes: Array<string> }) {
    colorHexes.join(', ')
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="relative"
                sx={{
                    backgroundImage: `linear-gradient(144deg,${colorHexes})`,
                    height: '15px',
                }}
            >
            </AppBar>
        </Box>
    );
}

export default PaletteAppBar;
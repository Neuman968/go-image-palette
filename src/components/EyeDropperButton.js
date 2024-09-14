import { Button, Tooltip } from "@mui/material";
import ColorizeIcon from '@mui/icons-material/Colorize';


function EyeDropperButton({ onColorSelect }) {

    const supported = window.EyeDropper;


    const eyeDropperOnClick = () => {
        if (supported) {
            const eyeDropper = new window.EyeDropper();
            eyeDropper
                .open()
                .then((result) => {
                    onColorSelect(result.sRGBHex)
                })
                .catch((e) => {
                });
        }
    }

    return <Tooltip title={supported ? "Eyedropper" : "Unsupported. Use Chrome or Edge"} placement="bottom">
        <Button size="small" variant="contained" onClick={eyeDropperOnClick}>
            <ColorizeIcon fontSize="small"/>
        </Button>
    </Tooltip>

}

export default EyeDropperButton;
import { IconButton, Tooltip } from "@mui/material";
import ColorizeIcon from '@mui/icons-material/Colorize';


function EyeDropperButton({ onColorSelect }) {

    const supported = window.EyeDropper;

    if (supported) {
        return <IconButton onClick={() => {
            const eyeDropper = new window.EyeDropper();
            eyeDropper
                .open()
                .then((result) => {
                    onColorSelect(result.sRGBHex)
                })
                .catch((e) => {
                });
        }} color="primary">
            <ColorizeIcon />
        </IconButton>
    }

    return <Tooltip title="Unsupported. Use Chrome or Edge" placement="bottom">
        <IconButton>
            <ColorizeIcon />
        </IconButton>
    </Tooltip>

}

export default EyeDropperButton;
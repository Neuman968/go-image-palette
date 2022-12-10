export type ImagePalette = {
    Red: Array<RGBAResult>,
    Green: Array<RGBAResult>,
    Blue: Array<RGBAResult>,
    Yellow: Array<RGBAResult>,
    Orange: Array<RGBAResult>,
    Purple: Array<RGBAResult>,
    Black: Array<RGBAResult>,
    White: Array<RGBAResult>,
    Brown: Array<RGBAResult>,
    Gray: Array<RGBAResult>,
    Pink: Array<RGBAResult>,
    Primary: RGBAResult,
}

export type RGBAResult = {
    R: number,
    G: number,
    B: number,
    A: number,
    Count: number,
}
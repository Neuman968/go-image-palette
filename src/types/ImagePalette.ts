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

    TopDistinctRed: Array<RGBAResult>,
    TopDistinctGreen: Array<RGBAResult>,
    TopDistinctBlue: Array<RGBAResult>,
    TopDistinctYellow: Array<RGBAResult>,
    TopDistinctOrange: Array<RGBAResult>,
    TopDistinctPurple: Array<RGBAResult>,
    TopDistinctBlack: Array<RGBAResult>,
    TopDistinctWhite: Array<RGBAResult>,
    TopDistinctBrown: Array<RGBAResult>,
    TopDistinctGray: Array<RGBAResult>,
    TopDistinctPink: Array<RGBAResult>,

    Primary: RGBAResult,
    Secondary: RGBAResult,
}

export type RGBAResult = {
    R: number,
    G: number,
    B: number,
    A: number,
    Count: number,
}
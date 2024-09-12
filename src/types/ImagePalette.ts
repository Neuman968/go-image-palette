export type ImagePalette = {

    Primary: RGBAResult,
    Secondary: RGBAResult,
    Tertiary: RGBAResult,
    Fourth: RGBAResult,
    Fifth: RGBAResult,

    PrimarySimilar: Array<RGBAResult>,
    SecondarySimilar: Array<RGBAResult>,
    TertiarySimilar: Array<RGBAResult>,
    FourthSimilar: Array<RGBAResult>,
    FifthSimilar: Array<RGBAResult>,

}

export type RGBAResult = {
    R: number,
    G: number,
    B: number,
    A: number,
    H: number,
    S: number,
    L: number
    Count: number,
}
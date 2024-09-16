import React from 'react'

const WasmContext = React.createContext<Window | undefined>(undefined)

type ProviderProps = {
    onFailure?: (e: Error) => void,
    fetchParams: RequestInfo | URL,
    init?: RequestInit
}

export function WasmProvider (props: ProviderProps & React.PropsWithChildren) {
    const [wasm, setWasm] = React.useState<Window | undefined>() 

    React.useEffect(() => {
        const go = new Go()
        const load = async () => {
            const source = await WebAssembly.instantiateStreaming(fetch(props.fetchParams, props.init), go.importObject)
            setWasm(window)
            console.log("WASM loaded")
            await go.run(source.instance)
        }
        load().catch((e) => {
            console.log("Failed to load WASM", e)
            props?.onFailure?.(e)
        })
    }, [ props ])

    return <WasmContext.Provider value={wasm}>{props.children}</WasmContext.Provider>
}

export function useLoadedWasm<T>(): T | undefined {
    const context = React.useContext(WasmContext)
    return context ? context as unknown as T : undefined
}

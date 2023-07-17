import { useEffect, useState } from "react"

export const useStateUpdate = <S,>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>] => {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (initialState != state) {
            setState(initialState)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState])

    return [state, setState]
}
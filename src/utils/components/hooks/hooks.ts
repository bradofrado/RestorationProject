import { useEffect, useState } from "react"

export const useStateUpdate = <S,>(initialStateProps: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>] => {
    const [initialState, setInitialState] = useState(initialStateProps);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (!equals(initialState, initialStateProps)) {
            setState(initialStateProps)
            setInitialState(initialStateProps);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState, initialStateProps])

    return [state, setState]
}

const equals = <T>(obj1: T, obj2: T) => {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length != obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
            if (!equals(obj1[i], obj2[i])) return false;
        }

        return true;
    }

    return obj1 === obj2;
}
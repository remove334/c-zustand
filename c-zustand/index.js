import { useState, useEffect } from "react"

const createStore = (createState) => {
    let state;

    const listeners = new Set();

    const setState = (partial, isReplace) => {
        const nextState = typeof partial === "function" ? partial(state) : partial

        if (!Object.is(nextState, state)) {
            const previousState = state;

            if (!isReplace) {
                state = (typeof nextState !== "object" || nextState === null) ? nextState : { ...state, ...nextState }
            } else {
                state = nextState
            }

            listeners.forEach(listener => listener(state, previousState))
        }
    }

    const getState = () => {
        return state
    }

    const subscribe = (listener) => {
        listeners.add(listener)
        return () => listeners.delete(listener)
    }

    const destroy = () => {
        listeners.clear()
    }

    const api = {
        setState,
        getState,
        subscribe,
        destroy
    }

    state = createState(setState, getState, api)

    return api

}


function useStore(api, selector) {

    const [, forceRender] = useState([])

    useEffect(() => {
        api.subscribe((state, prevState) => {
            if (selector(state) !== selector(prevState)) {
                forceRender([])
            }
        })
    }, [])
    return selector(api.getState())
}


export const create = (createState) => {
    const api = createStore(createState)
    const useBoundStore = (selector) => useStore(api, selector)
    Object.assign(useBoundStore, api)
    return useBoundStore
}
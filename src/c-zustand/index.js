import { useState, useEffect,useSyncExternalStore } from "react"

const createStore = (createState) => {
    /* 当前最新的state 数据 */
    let state;

    /* 回调函数的存储 */
    const listeners = new Set();

    const setState = (partial, isReplace) => {
        /* 如果 这个 set 是个function的话就拿到对应的返回值*/
        const nextState = typeof partial === "function" ? partial(state) : partial
        /* 判断两个对象是否相等 相等就不会去更新 */
        if (!Object.is(nextState, state)) {
            const previousState = state;
            /* 是否是将数据直接进行替换 */
            if (!isReplace) {
                state = (typeof nextState !== "object" || nextState === null) ? nextState : { ...state, ...nextState }
            } else {
                state = nextState
            }
            /*
             state 更新后 依次去触发对应的监听函数 
             比如a 组件用到了 这个state 就会去触发a组件state 的gengxin
             */
            listeners.forEach(listener => listener(state, previousState))
        }
    }
    /* 获取最新的state */
    const getState = () => {
        return state
    }

    /* 和当前的store进行监听 */
    const subscribe = (listener) => {
        listeners.add(listener)
        return () => listeners.delete(listener)
    }
    /* 销毁 */
    const destroy = () => {
        listeners.clear()
    }

    const api = {
        setState,
        getState,
        subscribe,
        destroy
    }
    /* 获取state */
    state = createState(setState, getState, api)

    return api

}

/* 与对应的函数建立起来监听关系 */
function useStoreUseSyncExternalStore(api, selector){
    return useSyncExternalStore(api.subscribe, ()=>selector(api.getState()))
}

/* 创建函数 */
export const create = (createState) => {
    /* 先创建store 生成 api */
    const api = createStore(createState)
    /* 然后用 包装一个函数  接受一个selector 去主动的选择数据 */
    const useBoundStore = (selector) => useStoreUseSyncExternalStore(api, selector)
    /* 
        将操作方法绑定到这个函数上面
        
     */
    Object.assign(useBoundStore, api)
    return useBoundStore
}
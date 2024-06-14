import logo from './logo.svg';
import './App.css';
import { create } from "./c-zustand/index"
import { useEffect } from 'react';


const useSelfStore = create((set) => {
  return {
    a: "1",
    b: "2",
    c: "3",
    updateA: (v) => set({ a: v }),
    updateB: (v) => set({ b: v }),

  }
})

function App2() {
  const updateA = useSelfStore(state => state.updateA)
  const updateB = useSelfStore(state => state.updateB)

  const a = useSelfStore(state => state.a)
  const b = useSelfStore(state => state.b)
  const c = useSelfStore(state => state.c)
  return <>
    <p>
      content: {a} - {b} - {c}
    </p>
    <button onClick={() => updateA("996")}>
      testA
    </button>
    <button onClick={() => updateB("007")}>
      testB
    </button>

    <button onClick={() => {
      updateA("1")
      updateB("2")
    }}>
      reset
    </button>
  </>
}

function App3() {
  const c = useSelfStore(state => state.c)

  useEffect(() => {
    console.log("app3 update")
  })
  return <>
    <div>app3 -{c}</div>
  </>
}

function App() {


  return (
    <div >
      <App2 />
      <App3 />

    </div>
  );
}

export default App;

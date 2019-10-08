import React, { useState , createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import Child from './Child.js'
const CountContext = createContext();
function App() {
  const [ count , setCount ] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={()=>{setCount(count+1)}}>click me</button>
            {/*======关键代码 */}
            <CountContext.Provider value={count}>
              <Child/>
            </CountContext.Provider>

        </div>
    )
}
export {CountContext};
export default App;

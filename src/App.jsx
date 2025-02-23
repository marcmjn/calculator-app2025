import { useState, useEffect, useCallback } from "react"
import "./App.css"

//calculator component
function Calculator() {
  const [ input, setInput ] = useState("")

  //function to handle button clicks
  const handleClick = useCallback((value) => {
    if (value === "=") {
      try {
        if (!input || /[^0-9/*\-+.]/.test(input)) {
          setInput("Error");
        } else if (input.includes("/0")) { // Prevents division by zero
          setInput("Error");
        } else {
          setInput(eval(input).toString()); // Safe evaluation of input
        }
      } catch {
        setInput("Error");
      }
    } else if (value === "C") {
      setInput(""); // Clears input
    } else if (value === "Backspace") {
      setInput(input.length > 1 ? input.slice(0,-1) : "") //remove last character or clear
    } else {
      if (/[/*\-+]$/.test(input) && /[/*\-+]/.test(value)) {
        return; // Prevent multiple operators
      }
      setInput(input + value);
    }
  }, [input])
  

  // function to handle keyboard input
  const handleKeyPress = useCallback((event) => {
    const keyMap = {
      Enter: "=",
      Backspace: "Backspace",
      Escape: "C",
      c: "C"
    }

    const value = keyMap[event.key] || event.key
      if ("0123456789/*-+".includes(value) || value === "=" || value === "Backspace" || value === "C") {
        handleClick(value)
      }
  }, [handleClick])

  //attach and remove event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

  return (
      <div className="calculator">
        <div className="display">{input || "0" }</div>
        <div className="buttons">
          {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "=", "+"].map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)}>
              {btn}
            </button>
          ))}
        </div>
      </div>
  )
}

//Main App Component
export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark" //get saved theme or default to dark
  })

  useEffect(() => {
    document.body.className = theme // Apply theme class to body
    localStorage.setItem("theme", theme) //save preference
  }, [theme])

  return (
    <div className={`App ${theme}`}>
      <button 
        className="theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
      <h1>React Calculator</h1>
      <Calculator />
    </div>
  )
}
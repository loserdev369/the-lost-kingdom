import React from 'react'
import ReactDOM from 'react-dom'
import Home from './pages/Home.jsx'
import { ChakraProvider } from "@chakra-ui/react"

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

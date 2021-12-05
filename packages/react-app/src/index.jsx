import React from 'react'
import ReactDOM from 'react-dom'
import Home from './pages/Home.jsx'
import { ChakraProvider } from "@chakra-ui/react"

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

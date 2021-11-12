import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";
import "./index.css";
import Plausible from 'plausible-tracker'

const { enableAutoPageviews } = Plausible({
  domain: 'mint.desperateapewives.com'
})

enableAutoPageviews();

ReactDOM.render(
  <App />
  , document.getElementById("root"));

import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "./store"
import App from "./App"
import "./bootstrap.min.css"
import "react-checkbox-tree/lib/react-checkbox-tree.css"
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)

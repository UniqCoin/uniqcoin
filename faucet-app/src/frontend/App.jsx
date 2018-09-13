import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import { Faucet, styles } from './components/Faucet/'
import 'bootstrap/dist/css/bootstrap.min.css'

const render = (Component) => {
  ReactDOM.render(
    <Component />,
    document.getElementById('root'),
  )
}

render(Faucet)

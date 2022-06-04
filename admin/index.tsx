import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import store from './application/store'
import './index.scss'

const rootDiv = document.getElementById('root')
if ( rootDiv ) {
    const root = createRoot(rootDiv)
    root.render(
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    )
}
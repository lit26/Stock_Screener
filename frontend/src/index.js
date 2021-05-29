import React from "react";
import { render } from "react-dom";
import App from './App';
import { createStore } from 'redux'
import allReducers from './redux/reducers'
import {Provider} from 'react-redux'

const store = createStore(
    allReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css'
import routers from './routes';
import {Provider} from 'mobx-react'
import Carts from './stores/Carts'

const stores = {
    carts: new Carts()
};

if (module.hot)
    module.hot.accept();

ReactDOM.render(<Provider {...stores}>{routers}</Provider>, document.getElementById('root'));
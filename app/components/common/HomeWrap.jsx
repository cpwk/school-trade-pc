import React from 'react';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import '../../assets/css/common/common.scss'
import '../../assets/css/home/home-wrap.scss'
import {Footer, Header} from "./Comps";
import {inject, observer} from 'mobx-react'
import {App} from "../../common";
import CarUtils from "../car/CarUtils";

@inject("carts")
@observer
class HomeWrap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let token = App.getCookie('admin-token');
        if (token) {
            CarUtils.load().then((carts) => {
                this.props.carts.setCarts(carts);
            });
        }
    }

    render() {
        return <ConfigProvider locale={zhCN} style={{height: '100%'}}>

            <div className='home-wrap'>
                <Header/>
                <div className='inner-page'>
                    {this.props.children}
                </div>
                <Footer/>
            </div>

        </ConfigProvider>
    }
}

export default HomeWrap;
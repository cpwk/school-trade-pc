import React from 'react';
import {Card, ConfigProvider, Icon, Menu, Modal} from 'antd';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from './BreadcrumbCustom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import '../../assets/css/common/common.scss'
import '../../assets/css/home/home-wrap.scss'
import '../../assets/css/user/user-wrap.scss'
import {App} from '../../common'
import {Footer, Header} from "./Comps";
import CarUtils from "../car/CarUtils";

import {inject, observer} from 'mobx-react'

@inject("carts")
@observer
class UserWrap extends React.Component {

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

        const logout = () => {
            Modal.confirm({
                title: '确定要退出吗?',
                content: null,
                onOk() {
                    App.logout();
                    App.go('/');
                },
                onCancel() {
                },
            });
        };

        return <ConfigProvider locale={zhCN} style={{height: '100%'}}>
            <div className='home-wrap trainee-wrap'>
                <Header/>
                <div className='inner-content'>
                    <div className='left-menu'>

                        <Menu mode='inline'>
                            <Menu.Item>
                                <Link to={'/user/profile'}><Icon type="home"/><span>个人中心</span></Link>
                            </Menu.Item>

                            <Menu.Item>
                                <Link to={'/user/usercoupon'}><Icon type="tags"/><span>我的优惠券</span></Link>
                            </Menu.Item>

                            <Menu.Item>
                                <Link to={'/user/address'}><Icon type="schedule"/><span>收货地址</span></Link>
                            </Menu.Item>

                            <Menu.Item>
                                <Link to={'/user/order'}><Icon type="shopping"/><span>订单管理</span></Link>
                            </Menu.Item>

                            <Menu.Item>
                                <Link to={'/user/sell-products'}><Icon type="gold"/><span>商品管理</span></Link>
                            </Menu.Item>

                            <Menu.Item>
                                <a onClick={logout}><span
                                    className="nav-text"><Icon type="poweroff"/>退出登录</span>
                                </a>
                            </Menu.Item>

                        </Menu>

                    </div>
                    <Card
                        title={
                            <BreadcrumbCustom
                                first={<Link to={'/user/profile'}>个人中心</Link>}/>
                        }
                        className='main-content'>
                        {this.props.children}
                    </Card>
                </div>
                <Footer/>
            </div>
        </ConfigProvider>
    }
}

export default UserWrap;

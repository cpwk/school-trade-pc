import React from 'react';
import {Button, message, Modal, Tabs} from 'antd';
import {App} from '../../common';
import '../../assets/css/vip/viprenew.scss'
import UserUtils from './UserUtils';

const {TabPane} = Tabs;

class VipRenew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: this.props.profile,
            vips: [],
            visible: true,
            userMemberIndex: -1,
            price: 0,
            key: 1,
            seriaNumberl: 0,
            gender: 0
        }
    }

    componentDidMount() {
        this.loadData()
    }


    loadData = () => {
        App.api('usr/vip/vips', {vipQo: JSON.stringify({})}).then(vips => {
            this.setState({vips})
        })
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        let {vips = [], userMemberIndex, price, key, seriaNumberl, profile} = this.state;
        let {user} = profile;
        let {mobile, vipUser} = user;
        let {id = 0, vipId} = vipUser || {};
        return <Modal
            title="开通会员"
            width={680}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
            <div className="card-container">
                <div className="mobile"><span>开通账号:</span><span>{mobile}</span></div>
                <Tabs type="card" onChange={activeKey => {
                    this.setState({key: parseInt(activeKey)})
                }}>
                    {
                        vips.map((member, index) => {
                            let {priceRule = [], grade} = member;
                            return <TabPane tab={UserUtils.getType(grade)} key={index + 1}>
                                <div className="member-top">
                                    <ul className="usermeber-ul">
                                        {
                                            priceRule.map((item, index) => {
                                                let {seriaNumberl, sno, price} = item;
                                                return <li
                                                    className={userMemberIndex === index ? 'usermeber-li current' : 'usermeber-li'}
                                                    onClick={() => {
                                                        this.setState({userMemberIndex: index, price, seriaNumberl})
                                                    }}>
                                                    <div className="member-type">{UserUtils.getType(sno)}</div>
                                                    <div className="member-price"><span className="emmm">￥</span><span
                                                        className="price">{price}</span></div>
                                                    <p className="desc">每月自动续费<br/>可随时关闭</p>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className="mod-pay clearfix">
                                    <div className="wx-play"/>
                                    <div className="txt">微信支付</div>
                                    <div className="wx-code"/>
                                    <div className="wx"><span>微信扫码,支付<span className="play">{price}</span>元</span></div>
                                </div>
                                {id === 0 ? <Button type="primary" className="member-btn" onClick={() => {
                                        App.api('adm/usermember/save', {id: member.id, seriaNumberl}).then(() => {
                                            message.success('开通成功');
                                            this.setState({visible: false}, () => {
                                                this.props.loadData()
                                            })
                                        })
                                    }
                                    }>立即开通</Button> :
                                    <Button type="primary" disabled={vipId > key}
                                            className="member-btn">立即{vipId === key ? '续费' : '升级'}</Button>}
                            </TabPane>
                        })
                    }
                </Tabs>
            </div>
        </Modal>
    }
}

export default VipRenew;

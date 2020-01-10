import React from 'react';
import {U} from "../../common";
import App from "../../common/App";
import {Button, Card, Icon, message, Modal, Tag} from "antd";
import Utils from '../../common/Utils'
import AddressUtils from "./AddressUtils";
import '../../assets/css/address/address.scss';
export default class Address extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            address: []
        };
    }

    componentDidMount() {
        Utils.addr.loadRegion(this);
        U.setWXTitle('收货地址');
        this.loadData();
    }

    loadData = () => {
        App.api(`/user/address/find_address_to_list`, {
            addressQo: JSON.stringify({})
        }).then((v) => {
            this.setState({address: v});
        })
    };

    remove = (id, index) => {

        Modal.confirm({
            title: `确认删除操作?`,
            content: null,
            onOk: () => {
                App.api(`/user/address/remove`, {id}).then((v) => {
                    if (v == null) {
                        message.success("删除成功");
                        let address = this.state.address;
                        this.setState({
                            address: U.array.remove(address, index)
                        })
                    }
                })
            },
            onCancel() {
            },
        });
    };

    edit = (Address) => {
        AddressUtils.EditAddress(Address, this.loadData);
    };

    def = (id) => {

        Modal.confirm({
            title: `确认设为默认地址?`,
            content: null,
            onOk: () => {
                App.api(`/user/address/def`, {id}).then(() => {
                    message.success("设置成功");
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let {address} = this.state;

        return <div className='address-page-u'>

            {address.map((item, index) => {
                let id = item.id;
                let def = item.def;
                let actions = [<Button onClick={() => {
                    this.edit(item)
                }}><Icon type="edit" key="setting"/>修改</Button>];
                if (def === 2) {
                    actions.push(<Button onClick={() => {
                        this.def(id)
                    }}><Icon type="setting" key="setting"/>设为默认</Button>);
                } else {
                    actions.push(<Button type="danger">默认地址</Button>)
                }
                actions.push(
                    <Button onClick={() => {
                        this.remove(id, index)
                    }}><Icon type="delete" key="setting"/>删除</Button>);

                return <Card
                    className='order-temp-card-u'
                    key={index}
                    title={item.detail}
                    hoverable={true}
                    actions={actions}>
                    <div>
                        <div> 收货人：{item.name}</div>
                        <div> 手机号：{item.mobile}</div>
                        <div className='address-detail-u'> 地址：{Utils.addr.getPCD(item.code)}</div>
                        <div className='address-detail-u'> 街道：{item.detail+'空间都能考上技能等级考试的年纪开始那几款是大部分几乎是大部分觉得还是比较合适的'}</div>
                    </div>
                </Card>
            })}

            <Card
                title="添加新地址"
                className='order-temp-card-u'
                hoverable={true}
            >
                <div>
                    <Tag color='red' onClick={() => {
                        this.edit({id: 0})
                    }}>
                        <Icon type="edit"/>
                        <span>添加新地址......</span>
                    </Tag>
                </div>
            </Card>

        </div>
    }
}

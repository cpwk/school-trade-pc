import React from 'react';
import {Card, Icon, message, Modal, Pagination, Tabs} from 'antd';
import {App, CTYPE, U, Utils} from "../../common";
import "../../assets/css/order/orders.scss"

const {TabPane} = Tabs;

export default class Orders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            status: 1,
            pagination: {
                pageSize: 10,
                current: 0,
                total: 0
            }
        };
    }

    componentDidMount() {
        U.setWXTitle('订单详情');
        this.loadData();
    }

    loadData = (status = 0) => {
        let {pagination = {}} = this.state;
        App.api('/user/order/orders', {
            orderQo: JSON.stringify({
                status: status,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((data) => {
            let {content = []} = data;
            let pagination = Utils.pager.convert2Pagination(data);
            this.setState({list: content, pagination});
        })
    };

    checkedTab = (key) => {
        if (key === '1') {
            this.loadData();
        }
        if (key === '2') {
            this.loadData(1);
        }
        if (key === '3') {
            this.loadData(2);
        }
        if (key === '4') {
            this.loadData(3);
        }
    };

    remove = (id, index) => {
        Modal.confirm({
            title: '确认删除操作？',
            onOk: () => {
                App.api('/user/order/remove', {id}).then(() => {
                    let {list = []} = this.state;

                    list = U.array.remove(list, index);
                    this.setState({list});
                    message.success('删除成功');
                });
            },
            onCancel() {
            },
        })
    };

    onPageChange = (current, pageSize) => {
        let pagination = this.state.pagination;
        this.setState({
            pagination: {
                ...pagination,
                current, pageSize
            }
        }, () => this.loadData());
    };

    pay = (order) => {
        App.api('/user/order/pay', {order: JSON.stringify(order)}).then((res) => {
            if (res == null) {
                message.success("付款成功，请注意收货！");
                this.loadData();
            }
        })
    };

    receive = (order) => {
        App.api('/user/order/receive', {order: JSON.stringify(order)}).then((res) => {
            if (res == null) {
                message.success("收货成功，请评价商品！");
                this.loadData();
            }
        })
    };

    comment = (order) => {
        let {id} = order;
        App.go(`/user/comment/${id}`);
    };

    render() {
        let {list = [], pagination = {}} = this.state;
        return <div className="main-page">
            <div className="my-order">我的订单</div>
            <Card>
                <Tabs defaultActiveKey="1" onChange={this.checkedTab}>
                    <TabPane tab="全部有效订单" key="1"/>
                    <TabPane tab="待支付" key="2"/>
                    <TabPane tab="待收货" key="3"/>
                    <TabPane tab="待评价" key="4"/>
                </Tabs>
                <div className="my-order">我的订单</div>
                <table className='table'>
                    <thead>
                    <tr className='head'>
                        <th className='order-detail'>订单详情</th>
                        <th className='person'>收货人</th>
                        <th className='amount'>金额</th>
                        <th className='status'>状态</th>
                        <th className='opt'>操作</th>
                    </tr>
                    </thead>
                    {list.map((order, index) => {
                        let {id, products = {}, total, createdAt, orderNum, address = {}, status} = order;
                        let rowSpan = products.length;
                        return <tbody key={index}>
                        <tr className='top'>
                            <td colSpan="5"/>
                        </tr>
                        <tr className='order-num'>
                            <td colSpan="5" className='order-message'>
                                        <span
                                            className='time'>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</span>
                                <span className='num'><span
                                    className='char'>订单编号：</span>{orderNum}</span>
                                <Icon className='delete' type='delete' onClick={() => {
                                    this.remove(id, index)
                                }}/>
                            </td>
                        </tr>
                        {products.map((item, index) => {
                            let {num, product = {}, sno} = item;
                            let {title, productItems = []} = product;
                            let img = '';
                            let str = '';
                            productItems.map((v) => {
                                let {imgs = []} = v;
                                if (sno === v.sno) {
                                    img = imgs[0];
                                    let {params = []} = v;
                                    params.map((v) => {
                                        str += v.value;
                                        str += ' '
                                    })
                                }
                            });
                            return <tr className='product' key={index}>
                                <td className='product-detail'>
                                    <div className='detail'>
                                        <img className='img' src={img} style={{width: 50, height: 50}}/>
                                        <div className='shop-name'>{title}<br/>{str}</div>
                                        <div className='num'>x&nbsp;{num}</div>
                                    </div>
                                </td>
                                {index === 0 && <React.Fragment>
                                    <td className='user-name' rowSpan={rowSpan}>
                                        <span>{address.name}&nbsp;<Icon type="user"/></span>
                                    </td>
                                    <td className='product-amount' rowSpan={rowSpan}>总额￥{total}</td>
                                    <td className='product-status' rowSpan={rowSpan}>
                                        {status === 1 ? <div>待付款</div> : status === 2 ?
                                            <div>待收货</div> : status === 3 ? <div>待评价</div> : <div>已完成</div>}
                                    </td>
                                    <td className='product-opt' rowSpan={rowSpan}>
                                        <div className='button'>
                                            <p>
                                                {status === 1 ? <span onClick={() => {
                                                    this.pay(order)
                                                }}>立即付款</span> : status === 2 ?
                                                    <span onClick={() => {
                                                        this.receive(order)
                                                    }}>确认收货</span> : <span onClick={() => {
                                                        this.comment(order)
                                                    }}>立即评价</span>}
                                            </p>
                                        </div>
                                    </td>
                                </React.Fragment>}
                            </tr>
                        })}
                        </tbody>
                    })}
                </table>
                <Pagination {...CTYPE.commonPagination}
                            style={{marginTop: '20px', float: 'right'}}
                            showQuickJumper={true}
                            onChange={(current, pageSize) => this.onPageChange(current, pageSize)}
                            onShowSizeChange={(current, pageSize) => {
                                this.onPageChange(current, pageSize)
                            }}
                            current={pagination.current} pageSize={pagination.pageSize} total={pagination.total}/>
            </Card>
        </div>
    }
}

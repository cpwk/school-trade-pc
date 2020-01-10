import React from 'react'
import {App} from '../../common'
import {Button, Card, InputNumber, message, Modal, Select, Table, Tag} from 'antd';
import '../../assets/css/common/common-edit.less'
import {inject, observer} from 'mobx-react'
import CarUtils from "./CarUtils";

const {Option} = Select;

@inject("carts")
@observer
class Car extends React.Component {

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys})
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            car: [],
            selectedRowKeys: [],
            num: [],
        };
    }

    cartSave = (item) => {
        App.api('user/car/save', {car: JSON.stringify(item)}).then(
            () => {
                CarUtils.load().then((carts) => {
                    this.props.carts.setCarts(carts);
                });
            })
    };

    order = () => {
        let {selectedRowKeys} = this.state;
        if (selectedRowKeys.length === 0) {
            message.info("请选择需要结算的商品！");
        } else {
            let ids = encodeURIComponent(encodeURIComponent(JSON.stringify(selectedRowKeys)));
            App.go(`/ordertemp/${ids}`);
        }
    };

    go = (id) => {
        let url = window.location.href;
        if (url.indexOf('106.14.81.141:1996') > -1) {
            window.open(`http://106.14.81.141:1996/market-pc/#/buyProduct/${id}`);
        } else {
            window.open(window.location.protocol + '//' + window.location.host + `#/buyProduct/${id}`);
        }
    };

    render() {
        let car = this.props.carts.getCarts || [];
        let {selectedRowKeys} = this.state;
        let totalNum = 0;
        let totalPrices = 0;

        selectedRowKeys.map((id) => {
            let item = car.find(aa => aa.id === id);
            let {num = 1, product = {}, sno} = item;
            let {productItems = []} = product;
            productItems.map((v) => {
                if (v.sno === sno) {
                    let {price} = v;
                    totalNum += parseInt(num);
                    totalPrices += parseInt(price * num);
                }
            });
        });

        const remove = (id) => {
            Modal.confirm({
                title: `确认删除操作?`,
                content: null,
                onOk: () => {
                    App.api('user/car/remove', {id}).then(() => {
                        message.success('删除成功');
                        CarUtils.load().then((carts) => {
                            this.props.carts.setCarts(carts);
                        });
                    })
                }
            });
        };

        return <Card bordered={false}>
            <Table
                pagination={false}
                rowSelection={this.rowSelection}
                columns={[
                    {
                        title: '商品展示',
                        dataIndex: '',
                        className: 'txt-center',
                        render: (item, index) => {
                            let {product = {}, sno} = item;
                            let {productItems = []} = product;
                            let productSno = sno;
                            return <div key={index}>
                                {productItems.map((pro) => {
                                    let {imgs = [], sno} = pro;
                                    if (productSno === sno) {
                                        return <img key={index} className='product-img' src={imgs[0] + '@!120-120'}
                                                    onClick={() => this.go(item.productId)}
                                        />
                                    }
                                })}
                            </div>
                        }
                    },

                    {
                        title: '商品名称',
                        dataIndex: '',
                        className: 'txt-center',
                        render: (item) => {
                            let {product = []} = item;
                            let {title} = product;
                            return <Tag color='red'>
                                {title}
                            </Tag>
                        }
                    },

                    {
                        title: '更改规格',
                        dataIndex: '',
                        className: 'txt-center',
                        render: (item) => {
                            let {sno, product = {}} = item;
                            let {productItems = []} = product;
                            return <Select value={sno} onChange={(sno) => {
                                item.sno = sno;
                                this.cartSave(item);
                            }}>
                                {productItems.map((item, index2) => {
                                    let {params = [], sno} = item;
                                    let str = '';
                                    params.map((p) => {
                                        str += p.value;
                                    });
                                    return <Option key={index2} value={sno}>{str}</Option>
                                })}
                            </Select>
                        }
                    },

                    {
                        title: '商品价格￥',
                        dataIndex: '',
                        className: 'txt-center',
                        render: (item) => {
                            let {product = []} = item;
                            let {productItems = []} = product;
                            return <div>{
                                productItems.map((v) => {
                                    let {sno, price} = v;
                                    return <div>
                                        {sno === item.sno && <Tag color='cyan'>{price}￥</Tag>}
                                    </div>
                                })
                            }
                            </div>
                        }
                    },

                    {
                        title: '商品数量',
                        dataIndex: 'num',
                        className: 'txt-center',
                        render: (num, item) => {
                            return <InputNumber defaultValue={num} min={1}
                                                onChange={(num) => {
                                                    item.num = num;
                                                    this.cartSave(item);
                                                }}/>
                        }
                    },

                    {
                        title: '小计￥',
                        dataIndex: '',
                        className: 'txt-center',
                        render: (item) => {
                            let {num, product = {}} = item;
                            let {productItems = []} = product;
                            return <div>{
                                productItems.map((v) => {
                                    let {sno, price} = v;
                                    if (sno === item.sno) {
                                        let total = parseInt(num * price);
                                        return <Tag color='purple'>{total}￥</Tag>
                                    }
                                })}
                            </div>
                        }
                    },

                    {
                        title: '操作',
                        dataIndex: 'opt',
                        className: 'txt-center',
                        render: (obj, car) => {
                            return <Tag color="red" onClick={() => {
                                remove(car.id)
                            }}>
                                删除
                            </Tag>
                        }
                    }]}
                rowKey={(record) => record.id}
                dataSource={car}/>
            <Button style={{float: 'right'}} type="danger" onClick={this.order}>结算</Button>
            <Button style={{float: 'right'}} type="dashed">总价格：{totalPrices}￥</Button>
            <Button style={{float: 'right'}} type="dashed">已选商品数量：{totalNum}</Button>
        </Card>
    }
}

export default Car;

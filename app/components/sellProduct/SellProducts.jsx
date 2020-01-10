import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Card, Drawer, Dropdown, Icon, Menu, message, Modal, Table, Tag} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'
import SellProductUtils from "./SellProductUtils";

export default class SellProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            items: {},
            visible: false,
            q: '',
            key: 'title',
            products: [],
            loading: false,
            selectedRowKeys: [],
            pagination: {pageSize: CTYPE.pagination.pageSize, current: SellProductUtils.getCurrentPage(), total: 0},
            sorts: [],
            codes: []
        };
    }

    componentDidMount() {
        U.setWXTitle('商品管理');
        this.loadData();
    }

    getQuery = () => {
        let {codes = [], q, key} = this.state;
        let query = {};
        if (U.str.isNotEmpty(q)) {
            if (key === 'title') {
                query = {title: q};
            }
        }
        query.codes = codes;
        return query;
    };

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        Utils.nProgress.start();
        App.api('usr/product/products', {
            productQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((buyProduct) => {
                let {content = []} = buyProduct;
                let pagination = Utils.pager.convert2Pagination(buyProduct);
                Utils.nProgress.done();
                this.setState({
                    products: content,
                    pagination,
                    loading: false
                });
            }
        );
        App.api('usr/sort/sorts', {sortQo: JSON.stringify({})}).then((sorts) => {
                Utils.nProgress.done();
                this.setState({
                    sorts, loading: false
                });
                SellProductUtils.setCurrentPage(pagination.current);
            }
        );
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('usr/product/remove', {id}).then(() => {
                    message.success('删除成功');
                    let products = _this.state.products;
                    _this.setState({
                        products: U.array.remove(products, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    edit = (product) => {
        console.log(product.id);
        App.go(`/user/sell-product-edit/${product.id}`)
    };

    renderImg = (item) => {
        let {productItems = []} = item;
        let {imgs = []} = productItems[0] || [];
        return <img key={imgs[0]} className='product-img' src={imgs[0] + '@!120-120'}
                    onClick={() => {
                        Utils.common.showImgLightbox(imgs, 0);
                    }}/>
    };

    showDrawer = (items) => {
        this.setState({
            items,
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {

        let {loading, products = [], pagination = {}, visible, items, sorts = []} = this.state;

        let {productItems = []} = items;

        return <div className="common-list">
            <BreadcrumbCustom first={CTYPE.link.info_product.txt}/>
            <Card bordered={false}>
                <Table
                    columns={[
                        {
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            render: (col, row, i) => {
                                return <span>{(pagination.current - 1) * pagination.pageSize + (i + 1)}</span>
                            },
                        },

                        {
                            title: '图片',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => this.renderImg(item)
                        },

                        {
                            title: '名称',
                            dataIndex: 'title',
                            className: 'txt-center',
                        },

                        {
                            title: '商品规格',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => {
                                return <Tag color='purple' onClick={() => {
                                    this.showDrawer(item);
                                }
                                }>规格详情</Tag>
                            }
                        },

                        {
                            title: '商品类型',
                            dataIndex: 'sortId',
                            className: 'txt-center',
                            render: (sortId) => SellProductUtils.renderCategoryTags(sorts, sortId)
                        },

                        {
                            title: '状态',
                            dataIndex: 'state',
                            className: 'txt-center',
                            render: (obj, c) => {
                                return <div className="state">
                                    {c.state === 1 ? <span className="warning">待审核</span> : (c.state === 2 ?
                                        <span className="pass">已通过</span> : <span className="nopass">未通过</span>)}
                                </div>
                            }
                        },

                        {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            render: (obj, product, index) => {
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(product)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(product.id, index)}>删除</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }
                    ]}
                    rowKey={(record) => record.id}
                    dataSource={products}
                    loading={loading}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}
                />
            </Card>

            <Drawer
                title="规格详情："
                placement="right"
                width={600}
                closable={false}
                onClose={this.onClose}
                visible={visible}
            >
                <Table
                    dataSource={productItems}
                    pagination={false}
                    onChange={this.handleTableChange}
                    rowKey={(item) => item.id}
                    columns={[
                        {
                            title: "图片展示",
                            dataIndex: "imgs",
                            className: "txt-center",
                            render: (row, item) => {
                                let {imgs = []} = item;
                                return <img src={imgs[0] + '@!120-120'} onClick={() => {
                                    Utils.common.showImgLightbox(imgs, 0);
                                }}/>
                            }
                        }, {
                            title: "商品规格",
                            dataIndex: "params",
                            render: (row, item) => {
                                let {params = []} = item;
                                return <div>{params.map((aaa) => {
                                    let {label, value} = aaa;
                                    return <div>
                                        <Tag color="purple">{label}</Tag>
                                        <span>: </span>
                                        <Tag color="blue">{value}</Tag>
                                    </div>
                                })}</div>

                            }
                        }, {
                            title: "商品价格",
                            dataIndex: "price",
                            className: "txt-center",
                            render: (price) => {
                                return <Tag color="magenta">￥{price}</Tag>
                            }
                        }, {
                            title: "库存量",
                            dataIndex: "stock",
                            className: "txt-center",
                            render: (stock) => {
                                return <Tag color="cyan">{stock}</Tag>
                            }
                        },
                    ]}
                />
            </Drawer>
        </div>
    }
}

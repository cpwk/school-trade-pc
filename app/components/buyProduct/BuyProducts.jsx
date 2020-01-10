import React from 'react'
import {App, Utils} from "../../common";
import '../../assets/css/product/products.scss'
import {Icon} from 'antd';

export default class BuyProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstSortId: parseInt(this.props.match.params.firstSortId),
            list: [],
            pagination: {
                pageSize: 21,
                current: 0,
                total: 0
            }
        }
    }


    componentDidMount() {
        this.loadCase();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            firstSortId: parseInt(nextProps.match.params.firstSortId),
            pagination: {
                pageSize: 21,
                current: 0,
                total: 0
            }
        }, () => {
            this.loadCase();
        })
    }


    loadCase = () => {
        let {pagination = {}, firstSortId} = this.state;

        App.api('/usr/home/products', {
            productQo: JSON.stringify({
                firstSortId,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content,
                pagination
            });
        });


    };

    caseLoadMore = () => {
        let pagination = this.state.pagination;
        let {current} = pagination;
        this.setState({
            pagination: {
                ...pagination,
                current: current + 1
            }
        }, () => this.loadCase());
    };


    render() {
        let {list = [], pagination = {}} = this.state;
        let {current, totalPages} = pagination;

        return <div>

            <ProductList list={list}/>

            <div className='clearfix-h20'/>

            {current < totalPages &&
            <div className='btn-more-topcase' onClick={this.caseLoadMore}>更多商品&nbsp;<Icon type='down'/></div>}

            <div className='clearfix-h20'/>

        </div>
    }
}

export class ProductList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            list: nextProps.list
        })
    }

    go = (id) => {
        let url = window.location.href;
        if (url.indexOf('106.14.81.141:1996') > -1) {
            window.open(`http://106.14.81.141:1996/market-pc/#/product/${id}`);
        } else {
            window.open(window.location.protocol + '//' + window.location.host + `#/buyProduct/${id}`);
        }
    };

    render() {
        let {list = []} = this.state;
        return <ul className='ul-custcases'>
            {list.map((cc, index) => {

                let {productItems = [], title, id} = cc;
                let {imgs = [], price, stock} = productItems[0] || [];
                return <li key={index} onClick={() => {
                    this.go(id);
                }}>
                    <img src={imgs[0]} className='img'/>
                    <div className='cover'>
                        <div className='name'> {title}</div>
                        <div className='price'>{price}￥</div>
                        <div className='stock' style={{marginTop: '20px'}}>{stock}</div>
                    </div>
                </li>
            })}
            <div className='clearfix'/>
        </ul>
    }
}

import React from 'react'
import U from "../../common/U";
import {App, CTYPE} from "../../common/index";
import {Banners} from "./Comps";
import '../../assets/css/home/home.scss'
import {ProductList} from "../buyProduct/BuyProducts";
import {Icon} from 'antd'

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            codes: [],
            banners: [],
            list: [],
        }
    }

    componentDidMount() {
        U.setWXTitle('挑选宝贝');
        this.loadData();
    }

    exist = () => {
        let {codes = []} = this.state;
        let ids = encodeURIComponent(encodeURIComponent(JSON.stringify(codes)));
        App.go(`/producttemp/${ids}`);
    };

    loadData = () => {

        App.api('/usr/home/products_home', {
            productQo: JSON.stringify({})
        }).then((result) => {
            let {content = []} = result;
            this.setState({
                list: content,
            });
        });

        App.api('/usr/home/banners', {bannerQo: JSON.stringify({type: 1})}).then((banners) => {

            this.setState({banners})
        });

        App.api('/usr/home/sorts', {sortQo: JSON.stringify({})}).then((sorts) => {
                this.setState({
                    sorts
                });
            }
        );
    };

    render() {

        let {banners = [], list = [], sorts = []} = this.state;

        return <div className='home-page'>

            <div className="home-sort">
                <ul>
                    {sorts.map((item, index1) => {

                        let {sequence, children = [], name} = item;

                        return <li key={index1} className="li">

                            <span className='first' onClick={() => {
                                this.setState({codes: [sequence]}, () => {
                                    this.exist();
                                })
                            }}>
                            {name}<Icon type="right" className='home-right'/>
                            </span>

                            <div className="box">

                                {children.map((ch, index2) => {

                                    let {sequence, name, children = []} = ch;

                                    return <div key={`${index1}-${index2}`}
                                                className="second">
                                        <label
                                            onClick={() => {
                                                this.setState({
                                                    codes: [sequence]
                                                }, () => {
                                                    this.exist();
                                                })
                                            }}>{name}
                                        </label>
                                        <span className='sp'>:</span>
                                        <div className="box-right">

                                            {children.map((ch3, index3) => {
                                                let {sequence, name} = ch3;
                                                return <span key={`${index1}-${index2}-${index3}`} className='three'
                                                             onClick={() => {
                                                                 this.setState({codes: [sequence]}, () => {
                                                                     this.exist();
                                                                 })
                                                             }}>{name}</span>
                                            })}
                                        </div>

                                        <div className='clearfix-h20'/>

                                    </div>
                                })}
                            </div>
                        </li>
                    })}
                </ul>
            </div>

            {banners.length > 0 && <Banners banners={banners} type={CTYPE.bannerTypes.HOME}/>}

            <ProductList list={list}/>

        </div>
    }
}

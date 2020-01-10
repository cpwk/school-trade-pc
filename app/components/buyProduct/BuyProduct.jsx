import React from 'react'
import U from "../../common/U";
import {App} from "../../common";
import {Button, message} from 'antd';
import UserProfile from "../user/UserProfile";
import {inject, observer} from 'mobx-react'
import CarUtils from "../car/CarUtils";
import '../../assets/css/product/product.scss'

@inject("carts")
@observer
class product extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: {},
            specs: [],
            id: parseInt(this.props.match.params.id),
            profile: {},
            currSpec: {}
        };
    }

    componentDidMount() {
        this.loadData();
        window.addEventListener('scroll', this.doScroll);
        UserProfile.get().then((profile) => {
            this.setState({profile});
        });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.doScroll);
    }

    doScroll = () => {

        let topScroll = document.documentElement.scrollTop || document.body.scrollTop;
        let product_footer = document.getElementById('product_footer');
        let produce_imgs = document.getElementById('produce_imgs');
        let height = window.innerHeight;

        let foot_to_top = product_footer.offsetTop;

        let trigger = height - foot_to_top + topScroll;

        if (trigger < 215) {
            if (topScroll < 0) {
                produce_imgs.className = 'product-imgs'
            } else {
                produce_imgs.className = 'product-imgs fixed-imgs';
            }
        } else {
            produce_imgs.className = 'product-imgs bottom-imgs'
        }
    };

    loadData = () => {
        let {id} = this.state;
        App.api('/usr/product/product', {id}).then((product) => {
            this.setState({product}, () => {
                this.sortProps();
            });
            U.setWXTitle(product.title);
        });
        CarUtils.load().then((carts) => {
            this.props.carts.setCarts(carts);
        });
    };

    sortProps = () => {

        let {product = {}} = this.state;
        let {productItems = []} = product;
        let specs = [];
        let labels = [];

        //筛选出全部的标签
        productItems.map((prop) => {
            let {params = []} = prop;
            if (params.length !== 0) {
                params.map((sp) => {
                    labels.push(sp.label);
                });
            }

        });
        labels = [...new Set(labels)];

        //为标签筛选出全部的可选值，建立规格的二维关系
        labels.map((label, index) => {
            let values = [];
            productItems.map((prop) => {

                let {params = []} = prop;
                if (params.length !== 0) {
                    params.map((sp) => {
                        if (sp.label === label) {
                            values.push(sp.value);
                        }
                    })
                }

            });
            values = [...new Set(values)];
            specs.push({label, index, active: 0, values});
        });

        //根据可下单的第一个规格初始化默认选中标签
        let {params = []} = productItems[0];
        for (let i = 0; i < params.length; i++) {
            let sprop = params[i];

            for (let j = 0; j < specs.length; j++) {
                let spec = specs[j];
                let {label, values = []} = spec;
                if (sprop.label === label) {
                    for (let k = 0; k < values.length; k++) {
                        if (values[k] === sprop.value) {
                            spec.active = k;
                        }
                    }
                }
            }
        }


        this.setState({specs}, () => {
            this.setCurrentSpec();
        });
    };

    save = () => {
        let {profile = {}, product = [], currSpec = {}} = this.state;
        let {sno} = currSpec;
        let {user = {}} = profile;
        if (user.id == null || undefined) {
            message.warn("您还没有登录，请登录！");
        } else {
            let num = 1;
            let productId = product.id;
            App.api("user/car/save", {car: JSON.stringify({num, productId, product, sno})}).then(() => {
                CarUtils.load().then((carts) => {
                    this.props.carts.setCarts(carts);
                });
                message.success('加入成功');
                this.loadData();
            });
        }
    };

    checkable = (productItems, specs, label, value) => {
        let checkedProps = {label: specs[0].label, value: specs[0].values[specs[0].active]};
        for (let i = 0; i < productItems.length; i++) {
            let prop = productItems[i];
            let count = 0;
            let {params = []} = prop;
            for (let j = 0; j < params.length; j++) {
                let sprop = params[j];
                if ((sprop.label === label && sprop.value === value) || (sprop.label === checkedProps.label && sprop.value === checkedProps.value)) {
                    count++;
                }
            }
            if (count === specs.length) {
                return true;
            }
        }
    };

    getCurrentSpec = () => {

        let {product = {}, specs = []} = this.state;
        let {productItems = []} = product;
        let currSpec = {};
        if (productItems.length !== 0) {
            productItems.map((prop) => {
                let {params = []} = prop;
                let count = 0;
                if (params.length !== 0) {
                    params.map((spec) => {
                        specs.map((sp) => {
                            if (spec.label === sp.label && spec.value === sp.values[sp.active]) {
                                count++;
                            }
                        });
                    });
                }

                if (count === specs.length) {
                    currSpec = prop;
                }
            });
        }

        return currSpec;
    };

    setCurrentSpec = () => {
        let currSpec = this.getCurrentSpec();
        let {params = []} = currSpec;
        if (params.length > 0) {
            this.setState({
                currSpec: this.getCurrentSpec()
            })
        }
    };

    render() {
        let {product = {}, specs = [], currSpec = {}} = this.state;
        let {title, content, productItems = []} = product;
        let {imgs = [], price} = currSpec;

        return <div className="out-div">
            <div className="product-page">
                <div className='header'>
                    <div className='left'>
                        {imgs.length > 0 &&
                        <img src={imgs[0]} id='produce_imgs' style={{width: '560px', height: '560px'}}
                             className='product_imgs'/>}
                    </div>
                    <div className='right'>
                        <div className='title'>{title}</div>
                        <div className='content' dangerouslySetInnerHTML={{__html: content}}/>
                        <div className='price'>
                            <span className='price-info'>价格:{price}(元)</span>
                        </div>
                        <div className='post'>
                            <div className='post-info'>全国包邮</div>
                        </div>
                        <div className='sales'>
                            <div className='sales-info'>总销量:10000</div>
                        </div>
                        {specs.map((spec, index) => {
                            let {label, active, values = []} = spec;
                            return <div key={index} className="sort clearfix">
                                <div className='sort-before'>{label}</div>
                                {values.map((str, i) => {
                                    let checkable = index === 0 || this.checkable(productItems, specs, label, str);
                                    return <div key={i} className="values-div">
                                        <div
                                            className={checkable ? (active === i ? 'sort-active' : 'sort-img') : 'sort-img sort-disabled'}
                                            onClick={() => {
                                                if (checkable) {
                                                    spec.active = i;
                                                    specs[index] = spec;
                                                    this.setState({
                                                        specs,
                                                    }, () => {
                                                        this.setCurrentSpec();
                                                    })
                                                } else {
                                                    message.warn('库存不足');
                                                }
                                            }}>
                                            {str}
                                        </div>
                                    </div>
                                })}
                            </div>
                        })}
                        <div className="clearfix"/>

                        <div className='repertory'>
                            <div className='num'>库存：{currSpec.stock}件</div>
                        </div>

                        <div className='buy-div'>
                            <Button type="primary" className='buy' onClick={() => {
                            }}>
                                直接购买
                            </Button>
                            <Button type="primary"
                                    className='buy'
                                    onClick={() => {
                                        this.save()
                                    }}>加入购物车
                            </Button>
                        </div>

                        <div className='service-div'>
                            <div className='info'>服务承诺</div>
                            <div className='service'>全国联保</div>
                            <div className='service'>正品保证</div>
                            <div className='service'>七天无理由退换</div>
                        </div>
                    </div>
                </div>
                <div className='clearfix-h20'/>
            </div>
            <a id='product_footer' style={{display: 'block', width: '100%', height: '1px'}}/>
        </div>
    }
}

export default product;

import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import '../../assets/css/coupon/coupon.scss'
import {message} from 'antd'

export default class Coupon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            items: {},
            coupons: [],
            usercoupons: [],
            loading: false,
            sort: []
        };
    }

    componentDidMount() {
        U.setWXTitle('领券中心');
        this.loadData();
    }

    loadData = () => {
        App.api('/usr/home/coupons', {
            couponQo: JSON.stringify({})
        }).then((coupons) => {
                this.setState({
                    coupons,
                });
            }
        );

        App.api('/usr/home/sorts', {sortQo: JSON.stringify({})}).then((sort) => {
                this.setState({
                    sort
                });
            }
        );

        App.api('/usr/coupon/usercoupons', {
            userCouponQo: JSON.stringify({})
        }).then((usercoupons) => {
                this.setState({
                    usercoupons,
                });
            }
        );

    };

    save = (item) => {
        let {id} = item;
        App.api('usr/coupon/save', {
            userCoupon: JSON.stringify({couponId: id, status: 1})
        }).then(() => {
            message.success("领取成功");
            this.loadData();
        });

    };

    render() {

        let {coupons = [], usercoupons = []} = this.state;

        return <div className="page-coupon">

            {coupons.map((item, index) => {
                let {img, price, rule = {}, code, id} = item;
                let exist = usercoupons.find(aa => aa.couponId === id);
                let {values = []} = rule;
                let tip = '';
                if (rule.type === 1) {
                    tip = '满' + values[0] + '减' + values[1];
                }
                if (rule.type === 2) {
                    tip = '每' + values[0] + '减' + values[1];
                }
                if (rule.type === 3) {
                    tip = '直减' + values[0];
                }
                let ret = '';
                let {sort = []} = this.state;
                sort.map((s) => {
                    let {name} = s;
                    if (code === s.sequence) {
                        ret = '仅可购买' + name + '可用';
                    }
                });
                if (code === "000000") {
                    ret = '全品通用';
                }

                return <div key={index} className="coupon">
                    <div className="img">
                        <img key={img} className='product-img' src={img + '@!120-120'}/>
                    </div>
                    <div className="type">
                        <div className="price">
                            <em>￥</em>
                            <strong>{price}</strong>
                            <span>{tip}</span>
                        </div>
                        <div className="range">
                            <span>{ret}</span>
                        </div>
                    </div>
                    <div className={exist ? 'get get-disable' : 'get'}>
                            <span className='txt' onClick={() => {
                                if (!exist) {
                                    this.save(item);
                                }
                            }}>立即领取</span>
                    </div>

                    <div className={exist ? 'get-after' : ''}/>

                </div>
            })}

            <div className="clearfix"/>
        </div>

    }
}

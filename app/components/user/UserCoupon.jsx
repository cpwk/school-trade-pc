import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import '../../assets/css/coupon/usercoupon.scss'
import {message, Modal} from 'antd'

class UserCoupon extends React.Component {

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
        U.setWXTitle('我的优惠券');
        this.loadData();
    }

    loadData = () => {
        App.api('usr/home/coupons', {
            couponQo: JSON.stringify({})
        }).then((coupons) => {
                this.setState({
                    coupons,
                });
            }
        );

        App.api('usr/home/sorts', {sortQo: JSON.stringify({})}).then((sort) => {
                this.setState({
                    sort
                });
            }
        );

        App.api('usr/coupon/usercoupons', {
            userCouponQo: JSON.stringify({notstatus: 2})
        }).then((usercoupons) => {
                this.setState({
                    usercoupons,
                });
            }
        );

    };

    remove = (item) => {

        let {usercoupons = []} = this.state;
        let exist = usercoupons.find(aa => aa.couponId === item.id);
        let {id} = exist;
        Modal.confirm({
            title: `确认删除操作?`,
            content: null,
            onOk: () => {
                App.api(`/usr/coupon/remove`, {id}).then((v) => {
                    if (v == null) {
                        message.success("删除成功");
                        this.loadData();
                    }
                })
            },
            onCancel() {
            },
        });
    };

    render() {

        let {coupons = [], usercoupons = []} = this.state;

        let list = [];
        usercoupons.map((item) => {
            let {couponId} = item;
            let exist = coupons.find(aa => aa.id === couponId);
            list.push(exist);
        });

        return <div className="user-coupon">

            {list.map((item, index) => {
                let usercoupon = usercoupons.find(a => a.couponId === item.id) || {};
                let {getAt = 0, expirAt = 0, status = 0} = usercoupon || {};
                let {price = 0, rule = {}, code,} = item || {};
                let {values = []} = rule || {};
                let tip = '';
                let now = new Date().getTime();
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

                return <div key={index} className="user-coupon-item">

                    <div className="c-type-user">

                        <div className='san-user' onClick={() => {
                            this.remove(item);
                        }}>
                        </div>
                        <div className="c-price-user">
                            <em>￥</em>
                            <strong>{price}</strong>
                            <span className="user-type-c">剑券</span>
                        </div>
                        <div className='c-limit-u'>
                            <span>{tip}</span>
                        </div>
                        <div className="c-time-u">
                            &nbsp;&nbsp;
                        </div>
                        <div className="c-time-u">
                            {U.date.format(new Date(getAt), 'yyyy-MM-dd')}
                            --
                            {U.date.format(new Date(expirAt), 'yyyy-MM-dd')}
                        </div>
                        <div className="c-type-top-u">

                        </div>
                        <div className="c-type-bottom-u">

                        </div>
                    </div>
                    <div className="c-msg-u">
                        <div className="c-range-u">
                            <div className="range-item-u">
                                <span className="label-u">限品类：</span>
                                <span className="user-txt-u">{ret}</span>
                            </div>
                            <div className="range-item-u">
                                <span className="label-u">限平台：</span>
                                <span className="user-txt-u">全平台</span>
                            </div>
                            <div className="op-btns-u" onClick={() => {
                                App.go(`/`)
                            }}>
                                <a className='user-btn-u'>

                                    <span className="user-txt-u">立即使用</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    {(status === 3) ? <div className='overdue-site-u used-u'/> : <div
                        className={(expirAt - now < 0) ? 'overdue-site-u overdue-yet-u' : ((expirAt - now < 86400000) ? 'overdue-site' : '')}/>}
                </div>
            })}
        </div>
    }
}

export default UserCoupon;

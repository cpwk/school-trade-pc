import React from 'react';
import {Avatar, Badge, Carousel, Icon} from 'antd';
import {App, CTYPE} from '../../common';
import UserProfile from '../user/UserProfile';
import {inject, observer} from 'mobx-react';
import NavLink from '../../common/NavLink.jsx';
import '../../assets/css/comps/comps.scss';

const menus = [
    {cn: '挑选宝贝', en: 'HOME', path: '/'},
    {cn: '领券中心', en: 'COUPON', path: '/coupon'},
    {cn: '发布闲置', en: 'PRODUCT', path: `/user/sell-product-edit/${0}`}
];

@inject('carts')
@observer
class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: {}
        };
    }

    componentDidMount() {
        UserProfile.get().then((profile) => {
            this.setState({profile});
        })
    }

    render() {
        let {profile = {}} = this.state;
        let {user = {}} = profile;
        let {avatar} = user;
        let count = this.props.carts.getCount || 0;

        return <div className="top-header">
            <div className="inner">

                <a href='/'>
                    <div className="logo"/>
                </a>

                {!user.id && <div className='btn' onClick={() => App.go('/signin')}>登录</div>}
                {user.id && <div className='btn' onClick={() => App.go('/user/profile')}>
                    <Avatar size={50} src={avatar}/>
                </div>}
                <div className='shopping' onClick={() => {
                    App.go(`/car`)
                }}>
                    <Icon type="shopping-cart" className="shopping-cart"/>
                    {count > 0 && <Badge count={count} className='badge'/>}
                </div>
                <ul>
                    {menus.map((menu, index) => {
                        let {cn, en, path} = menu;
                        return <li key={index}>
                            <NavLink to={path} cn={cn} en={en}/>
                        </li>
                    })}
                </ul>
            </div>
        </div>
    }
}

class Banners extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            banners: this.props.banners,
        }
    }

    go = (banner) => {
        let {url} = banner;
        if (url) {
            window.location.href = url;
        }
    };

    render() {
        let {banners = [], type} = this.state;
        let isHome = type === CTYPE.bannerTypes.HOME;
        let length = banners.length;

        return <div className={isHome ? 'main-carousel home-carousel' : 'main-carousel'}>

            {length > 0 && <Carousel autoplay={length > 1} dots={length > 1}
                                     speed={1000} autoplaySpeed={isHome ? 5000 : 4000} infinite>
                {banners.map((banner, index) => {
                    let {img} = banner;
                    return <div key={index} className='item'>

                        <div className='item'
                             style={{
                                 backgroundImage: `url(${img})`,
                                 backgroundPosition: '50% 50%',
                                 backgroundRepeat: 'no-repeat'
                             }}
                             onClick={() => {
                                 this.go(banner);
                             }}/>
                    </div>
                })}
            </Carousel>}
        </div>
    }
}

class Footer extends React.Component {
    render() {
        return <div className="footer">

            <div className="inner">

                <div className='links'>
                    <div className='uls'>
                        <ul>
                            <li><b>平台介绍</b></li>
                            <li>
                                <a onClick={() => {
                                    App.go('/')
                                }}>关于我们</a>
                            </li>
                            <li>
                                <a onClick={() => {
                                    App.go('/')
                                }}>媒体报道</a>
                            </li>
                            <li>
                                <a onClick={() => {
                                }}>企业合作</a>
                            </li>
                        </ul>
                        <ul>
                            <li><b>友情链接</b></li>
                            <li><a href='http://www.haue.edu.cn/' target='_blank'>河工官网</a></li>
                            <li><a href='https://2.taobao.com/' target='_blank'>咸鱼官网</a></li>
                            <li><a href='https://www.taobao.com/' target='_blank'>淘宝官网</a></li>
                        </ul>
                        <ul style={{width: 450}}>
                            <li><b>联系我们</b></li>
                            <li>联系平台：{CTYPE.contact}</li>
                            <li>办公时间：{CTYPE.worktime}</li>
                            <li>办公地址：{CTYPE.addr_cn}</li>
                        </ul>
                    </div>

                </div>
                <div className='qrcode'>
                    <div className='img'/>
                    <p>扫码联系管理员</p>
                </div>
                <div className="copyright">
                    CHEN PENG @ 2020 河南工程学院 软件工程 1643 河工校园淘
                </div>
            </div>
        </div>
    }
}

export {Banners, Header, Footer}

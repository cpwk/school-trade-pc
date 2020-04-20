import React from 'react';
import UserProfile from './UserProfile';
import {U} from '../../common';
import {Descriptions, Icon, Tag} from 'antd';
import UserUtils from './UserUtils';
import '../../assets/css/user/user.scss';
import App from '../../common/App';

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            vipUser: []
        };
    }

    componentDidMount() {
        U.setWXTitle('个人中心');
        UserProfile.get().then((profile) => {
            this.setState({profile})
        });
        this.loadData();
    }

    loadData = () => {
        App.api(`/usr/vip/userVip`).then((vipUser) => {
            this.setState({vipUser})
        })
    };


    render() {

        let {profile = {}, vipUser = []} = this.state;
        let {user = {}} = profile;
        let {tag} = [];

        if (vipUser.length !== 0) {
            tag = [<Tag color="magenta">{vipUser.name}</Tag>];
            tag.push(<Tag color="magenta">到期时间{U.date.format(new Date(vipUser.expireAt), 'yyyy-MM-dd')}</Tag>);
            tag.push(<Tag color="magenta" onClick={() => {

            }}>续费会员</Tag>);
        } else {
            tag = [<Tag color="magenta" onClick={() => {
                UserUtils.vipRenew(profile, this.loadData())
            }}>开通会员</Tag>];
        }

        let {avatar, nick, mobile, email, createdAt, balance} = user;

        return <Descriptions title="资料展示" bordered span={4}>

            <Descriptions.Item label="头像" span={2}>

                <img key={avatar} src={avatar + '@!120-120'} onClick={() => {
                    UserUtils.modUserPro();
                }}/>
                {tag}
            </Descriptions.Item>

            <Descriptions.Item label="账户余额" span={2}>
                <span onClick={() => {
                    UserUtils.modUserPro()
                }}>￥{balance}</span>
                <Tag color="gold">充值</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="昵称" span={2}><span onClick={() => {
                UserUtils.modUserPro()
            }}>{nick}</span></Descriptions.Item>

            <Descriptions.Item label="手机号" span={2}><span onClick={() => {
                UserUtils.modUserPro()
            }}>{mobile}</span></Descriptions.Item>

            <Descriptions.Item label="邮箱" span={2}><span onClick={() => {
                UserUtils.modUserPro()
            }}>{email}</span></Descriptions.Item>

            <Descriptions.Item label="注册时间"
                               span={2}>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</Descriptions.Item>


            <Descriptions.Item label="设置">
                <Tag color='#108ee9' onClick={() => {
                    UserUtils.modUserPwd()
                }}>
                    <Icon type="edit"/>
                    <span>修改密码</span>
                </Tag>

                <Tag color='#108ee9' onClick={() => {
                    UserUtils.modUserPro()
                }}>
                    <Icon type="solution"/>
                    <span>修改资料</span>
                </Tag>
            </Descriptions.Item>
        </Descriptions>
    }
}

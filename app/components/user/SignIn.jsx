import React from 'react';
import {Button, Checkbox, Form, Icon, Input, message, Modal} from 'antd';
import App from '../../common/App.jsx';
import Utils from '../../common/Utils.jsx'
import CTYPE from "../../common/CTYPE";

const id_div = 'div-dialog-mod-signin';

class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: ''
        }
    }

    componentDidMount() {
        this.genValCode();
    }

    signin = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].error[0].message);
                })
            } else {
                let {unknown, password, code} = user;
                let {key} = this.state;
                App.api('user/sign_in', {
                    unknown,
                    password,
                    vCode: JSON.stringify({
                        key,
                        code
                    }),
                }).then((result) => {
                    if (result.length !== 0) {
                        let {user = {}, userSession = {}} = result;
                        App.saveCookie("admin-token", userSession.token);
                        App.saveCookie("admin-profile", JSON.stringify(user));
                        App.saveCookie("signin-key", key);
                        message.loading('登录成功!正在初始化系统...', 1, null);
                        setTimeout(() => {
                            App.go(`/`);
                        }, 800)
                    }
                })
            }
        });
    };

    genValCode = () => {
        let key = new Date().getTime();
        this.setState({key: key});
        this.setState({
            img_src: App.API_BASE + '/support/vcode/vcode?key=' + key,
            valCode: {key, code: ''}
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        let {img_src} = this.state;

        return <Modal
            title={'用户登录'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            width={'500px'}
            onOk={this.signin}
            onCancel={this.close}
            footer={null}>
            <Form>
                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>账号</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('unknown', {
                        rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入手机号/邮箱/昵称'
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="mobile"/></span>}/>
                    )}
                </Form.Item>

                <Form.Item {...CTYPE.dialogItemLayout}
                           label={(
                               <span>密码</span>
                           )}
                           hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{
                            type: 'string',
                            message: '长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头',
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            required: true,
                            whitespace: true,
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="lock"/></span>}/>
                    )
                    }
                </Form.Item>

                <Form.Item  {...CTYPE.dialogItemLayout}
                            label={(
                                <span>验证码</span>)}>

                    {getFieldDecorator('code', {
                        rules: [{type: 'string', required: true, message: '验证码不能为空!'}],
                    })(
                        <div style={{width: 300}}>
                            <Input style={{width: 200, float: 'left'}} type={this.state.pwdType}
                                   addonBefore={<span><Icon onClick={() => {
                                       this.setState({
                                           pwdType: 'txt',
                                       })
                                   }} type="number"/></span>}/>
                            <img src={img_src}
                                 onClick={this.genValCode}
                                 style={{float: 'right'}}
                            />
                        </div>
                    )
                    }
                </Form.Item>

                <Form.Item {...CTYPE.tailFormItemLayout}
                >
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>记住密码</Checkbox>)}

                    <a style={{float: 'right'}} onClick={() => {
                        App.go(`/FindPassword`);
                    }}>
                        忘记密码
                    </a>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}
                            onClick={() => {
                                this.signin()
                            }}>
                        登录</Button>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}
                            onClick={() => {
                                App.go(`/SignUp`)
                            }}>
                        没有账号？点击注册</Button>
                </Form.Item>
            </Form>
        </Modal>;
    }
}

export default Form.create()(SignIn);
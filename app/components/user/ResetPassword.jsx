import React from 'react';
import {Button, Form, Icon, Input, message, Modal} from 'antd';
import App from '../../common/App';
import Utils from "../../common/Utils";
import CTYPE from "../../common/CTYPE";

const id_div = 'div-dialog-mod-resetpassword';

class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeChange: "",
            time: 60,
            btnDisable: false,
            btnContent: '获取验证码',
            user: {},
            key: ""
        }
    }

    componentDidMount() {
    }

    check = () => {
        this.props.form.validateFields((err) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].error[0].message);
                })
            } else {
                this.sendCode();
                this.getVcode()
            }
        })
    };

    sendCode = () => {
        this.setState({
            btnDisable: true,
            btnContent: "60s之后重新获取",
            timeChange: setInterval(this.clock, 1000),
        });
    };

    clock = () => {

        let {timeChange} = this.state;
        let {time} = this.state;

        if (time > 0) {
            time = time - 1;
            this.setState({
                time: time,
                btnContent: time + "s之后重新获取",
            });
        } else {
            clearInterval(timeChange);
            this.setState({
                btnDisable: false,
                time: 60,
                btnContent: "获取验证码",
            });
        }
    };

    getVcode = () => {
        this.props.form.validateFields((err) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].error[0].message);
                })
            } else {

                let mobile = App.userProfile();
                let key = new Date().getMilliseconds();
                this.setState({key: key});
                App.api('/support/sms/phone_vcode', {key, mobile}).then((result) => {
                    if (result == "success") {
                        message.success("验证码发送成功，请注意查收")
                    }
                });
            }
        })
    };

    resetPassword = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].error[0].message);
                })
            } else {

                let {key} = this.state;
                let mobile = App.userProfile();
                let {password, repassword, smsCode} = user;

                if (password !== repassword) {
                    message.info('两次输入的密码不一致，请重新输入!');
                    return;
                }
                App.api('user/reset_password', {mobile, password, key, smsCode}).then((result) => {
                    if (result == null) {
                        message.success("重置密码成功！请登录");
                        setTimeout(() => {
                            App.go(`/signin`);
                        }, 1000);
                    }
                });
            }
        })
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        const {getFieldDecorator} = this.props.form;

        return <Modal
            title={'重置密码'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            width={'500px'}
            footer={null}
            onOk={this.signin}
            onCancel={this.close}>

            <Form>

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

                <Form.Item {...CTYPE.dialogItemLayout}
                           label={(
                               <span>确认密码</span>
                           )}
                           hasFeedback>
                    {getFieldDecorator('repassword', {
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

                <Form.Item {...CTYPE.dialogItemLayout}
                           label={(<span>验证码</span>)}
                           hasFeedback>
                    {getFieldDecorator('smsCode')(
                        <div style={{width: 300, display: 'flex'}}>
                            <Input
                                addonBefore={<span><Icon onClick={() => {
                                    this.setState({pwdType: 'txt',})
                                }} type="number"/></span>}
                                style={{width: 150, float: 'left', marginTop: 3}}
                                placeholder="请输入验证码"
                            />
                            <Button
                                type="primary"
                                disabled={this.state.btnDisable}
                                style={{marginLeft: 46, marginTop: 2}}
                                onClick={() => {
                                    this.check();
                                }}>{this.state.btnContent}
                            </Button>

                        </div>
                    )}
                </Form.Item>

                <Form.Item {...CTYPE.tailFormItemLayout}>


                    <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}
                            onClick={() => {
                                this.resetPassword()
                            }}>
                        重置密码</Button>


                </Form.Item>
            </Form>
        </Modal>;
    }
}

export default Form.create()(ResetPassword);
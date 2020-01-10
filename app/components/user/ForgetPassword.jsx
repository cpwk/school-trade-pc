import React from 'react';
import {Button, Form, Icon, Input, message, Modal} from 'antd';
import App from '../../common/App.jsx';
import Utils from '../../common/Utils.jsx'
import CTYPE from "../../common/CTYPE";

const id_div = 'div-dialog-mod-forgetpassword';

class ForgetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: ''
        }
    }

    componentDidMount() {
        this.genValCode();
    }

    forgetPassword = () => {
        this.props.form.validateFields((err, user) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].error[0].message);
                })
            } else {
                let {mobile, code} = user;
                let {key} = this.state;
                let regex = /^1[34578]\d{9}$/;
                if (!regex.test(mobile)) {
                    message.info("请输入正确的手机号")
                } else {
                    App.api('user/forget_password', {
                        mobile, vCode: JSON.stringify({
                            key,
                            code
                        })
                    }).then((result) => {
                        if (result == mobile) {
                            message.success('验证成功! 请重置密码');
                            App.saveCookie("admin-profile", mobile);
                            setTimeout(() => {
                                App.go(`/ResetPassword`);
                            }, 1000)
                        }
                    })
                }
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
            title={'验证信息'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            width={'500px'}
            onOk={this.signin}
            footer={null}
            onCancel={this.close}>

            <Form>

                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>手机号</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('mobile', {
                        rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入手机号'
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="mobile"/></span>}/>
                    )
                    }
                </Form.Item>


                <Form.Item  {...CTYPE.dialogItemLayout}
                            label={(<span>验证码</span>)}>
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
                           hasFeedback>

                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })}


                    <Button type="primary" htmlType="submit" style={{width: '100%'}}
                            onClick={() => {
                                this.forgetPassword()
                            }}>
                        验证信息</Button>
                </Form.Item>

            </Form>
        </Modal>;
    }
}

export default Form.create()(ForgetPassword);
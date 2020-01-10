import React from 'react';
import {U} from "../../common";
import App from "../../common/App";
import {Button, Cascader, Checkbox, Form, Icon, Input, message, Modal} from "antd";
import Utils from '../../common/Utils'
import CTYPE from "../../common/CTYPE";

const id_div = 'div-dialog-mod-address';

class AddressEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            regions: [],
            address: this.props.address
        };
    }

    componentDidMount() {
        let {address} = this.state;
        Utils.addr.loadRegion(this);
        U.setWXTitle('收货地址');
        this.setForm(address);
    }

    setForm = (address) => {
        let {mobile, name, detail} = address;
        this.props.form.setFieldsValue({
            mobile,
            name,
            detail
        });
    };

    save = () => {
        let {address} = this.state;
        let {id, code} = address;
        this.props.form.validateFields((err, v) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].error[0].message);
                });
            } else {
                let {mobile, name, detail} = v;

                App.api(`/user/address/save`, {
                    address: JSON.stringify({
                        id, name, mobile, code, detail
                    })
                }).then((v) => {
                    if (v == null) {
                        message.success("保存成功");
                        this.props.loadData();
                        this.close();
                    }
                })
            }
        });


    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        const {getFieldDecorator} = this.props.form;
        let {regions, address} = this.state;
        let {code, id} = address;
        let codes = Utils.addr.getCodes(code);

        return <Modal
            title={'编辑收货地址'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            width={'500px'}
            onOk={this.save}
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
                    )}
                </Form.Item>

                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>姓名</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入姓名'
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="mobile"/></span>}/>
                    )}
                </Form.Item>

                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>地址</span>
                    )}
                    hasFeedback>

                    <Cascader style={{flex: 1}} value={codes} options={regions} onChange={(code) => {
                        this.setState({
                            address: {...address, code: code[2], id: id}
                        })
                    }} placeholder="请添加地址"/>

                </Form.Item>

                <Form.Item
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>详细地址</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('detail', {
                        rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入详细地址'
                        }],
                    })(
                        <Input type={this.state.pwdType} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                pwdType: 'txt',
                            })
                        }} type="mobile"/></span>}/>
                    )}
                </Form.Item>

                <Form.Item {...CTYPE.tailFormItemLayout_address}
                >
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}
                            onClick={() => {
                                this.save()
                            }}>
                        保存</Button>
                </Form.Item>
            </Form>
        </Modal>
    }
}

export default Form.create()(AddressEdit)

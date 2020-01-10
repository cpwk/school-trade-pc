import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Form, Input, message, Modal} from 'antd';
import '../../assets/css/common/common-edit.less'
import {CTYPE, OSSWrap} from "../../common";
import UserProfile from "./UserProfile";

const id_div = 'div-dialog-user-edit';

class UserEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: [],
            uploading: false,
            checkedKeys: []
        };
    }

    componentDidMount() {

        UserProfile.get().then((profile) => {
            let {user = {}} = profile;
            this.setState({user: user});
        })


    }

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    submit = () => {

        let {user = {}} = this.state;

        App.api('user/save', {
                user: JSON.stringify(user)
            }
        ).then(() => {
            message.success('已保存');
            this.close();
            this.props.loadData();
        });
    };

    handleNewImage = e => {

        let {uploading, user = {}} = this.state;

        let img = e.target.files[0];

        if (!img || img.type.indexOf('image') < 0) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }

        if (uploading) {
            message.loading('上传中');
            return;
        }

        this.setState({uploading: true});

        OSSWrap.upload(img).then((result) => {
            this.setState({
                user: {
                    ...user,
                    img: result.url
                }, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });

    };

    render() {
        let {user = {}} = this.state;
        let {nick, mobile, email, img} = user;
        return <Modal title={'修改资料'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'500px'}
                      okText='确定'
                      footer={null}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <p>更改昵称：</p>
                        <Input style={{width: 200}} className="input-wide"
                               value={nick} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           nick: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p>更改手机号：</p>
                        <Input style={{width: 200}} className="input-wide"
                               value={mobile} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           mobile: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p>更改邮箱：</p>
                        <Input style={{width: 200}} className="input-wide"
                               value={email} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           email: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p'>更换头像</p>
                        <div>
                            <div className='upload-img-preview' style={{width: 200, height: 200}}>
                                {img && <img src={img} style={{width: 200, height: 200}}/>}
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file' onChange={this.handleNewImage}/>
                                    选择图片</Button>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Form.Item {...CTYPE.tailFormItemLayout}
                       hasFeedback>
                <Button type="primary" htmlType="submit" style={{width: '100%'}}
                        onClick={() => {
                            this.submit()
                        }}>
                    确认修改</Button>
            </Form.Item>
        </Modal>
    }
}

export default Form.create()(UserEdit);
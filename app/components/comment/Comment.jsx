import React from "react";
import U from "../../common/U";
import {App} from "../../common";
import "../../assets/css/comment/comment.scss";
import {Button, Input, message, Rate} from 'antd';
import OSSWrap from "../../common/OSSWrap";

const TextArea = Input.TextArea;

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            order: {},


            value: 3,
            comment: {},
            content: {},
            imgs: [],
        }
    }

    componentDidMount() {
        U.setWXTitle('评价商品');
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        App.api('user/order/order', {id}).then((order) => {
            this.setState({order})
        })
    };

    handleChange = value => {
        this.setState({value});
    };

    save = () => {
        let {order, comment, content, imgs = []} = this.state;
        let {products, id} = order;
        let {productId} = products[0];
        comment.productId = productId;
        comment.ordersId = id;
        comment.content = content;
        let {commentTxt} = content;
        content.img = imgs;
        if (commentTxt === undefined) {
            message.warn("请填写评论");
        } else {
            App.api("/usr/home/saveComment", {comment: JSON.stringify(comment)}).then(() => {
                message.success("评价成功，祝您生活愉快亲亲！");
                setTimeout(() => {
                    App.go('/user/order');
                }, 1000)
            })
        }
    };

    handleNewImage = e => {

        let {uploading, content, imgs = []} = this.state;
        if (imgs.length > 3) {
            message.warn("评价图片限定4张！");
            return;
        }
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
            imgs.push(result.url);
            this.setState({
                imgs,
                uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });

    };

    render() {
        let {order, value, content, imgs = []} = this.state;
        let {orderNum, products = []} = order;
        return <div className="comment-page">
            <div className="title">
                <div className="head">评价订单</div>
                <span className="order">订单号：{orderNum}</span>
                <span>下单时间：{U.date.format(new Date(new Date().getTime()), 'yyyy-MM-dd HH:mm:ss')}</span>
            </div>
            <div className="color"/>
            <div className="box-bd">
                <div className="left">
                    {products.map((item, index) => {
                        let {product, sno} = item;
                        let {productItems = [], title, content} = product;
                        let spec = productItems.find(item => item.sno === sno);
                        return <div className="shop" key={index}>
                            <ul>
                                <li className="img" style={{backgroundImage: `url(${spec.imgs[0]})`}}/>
                                <li className="txt">
                                    <div className="name">{title}</div>
                                    <div className='introduction' dangerouslySetInnerHTML={{__html: content}}/>
                                    <div className='price'>{spec.price}元</div>
                                    {spec.params.map((item, index) => {
                                        return <div className="name" key={index}>{item.value}款</div>
                                    })}
                                </li>
                            </ul>
                        </div>
                    })}
                </div>
                <div className="right">
                    <div className="minute-page">
                        <span className="minute">商品评分</span>
                        <span>
        <Rate onChange={this.handleChange} value={value}/>
                            {value ? <span className="ant-rate-text">{[value]}</span> : ''}
      </span>
                    </div>
                    <div className="evaluation-page">
                        <div className="minute">评价晒单</div>
                        <span className="evaluation">
                            <TextArea placeholder="分享体验心得，给万千想买的人一个参考~" style={{width: '550px', height: '140px'}}
                                      onChange={(e) => {
                                          this.setState({content: {...content, commentTxt: e.target.value}})
                                      }}/>
                        </span>
                    </div>
                    <div className="imgs">
                        <span className="tu">
                            {imgs.map((item, index) => {
                                return <img src={item + `@!120-120`} key={index} style={{margin: '5px 10px'}}/>
                            })}
                        </span>
                        <div className='upload-img-tip'>
                            <Button type="primary" icon="file-jpg">
                                <input className="file" type='file' onChange={this.handleNewImage}/>
                                选择图片</Button>
                            <br/>
                        </div>
                    </div>
                </div>
                <div className="clearfix"/>
            </div>
            <div className="color"/>
            <div className="publish-page">
                <div className="publish" onClick={() => {
                    this.save()
                }}>发表评论
                </div>
            </div>
        </div>
    }
}

export default Comment;

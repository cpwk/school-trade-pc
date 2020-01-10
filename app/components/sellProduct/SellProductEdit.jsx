import React from 'react';
import {Button, Card, Form, Icon, Input, InputNumber, message, Switch, TreeSelect} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import SellProductUtils from "./SellProductUtils";
import '../../assets/css/common/common-edit.less'
import {PosterEdit} from "../../common/CommonEdit";
import HtmlEditor from "../../common/HtmlEditor";

const {TreeNode} = TreeSelect;
const FormItem = Form.Item;

export default class SellProductEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            sort: [],
            product: {},
            uploading: false
        }
    }

    componentDidMount() {
        this.loadData();
        SellProductUtils.loadSort(this);
    }

    loadData = () => {
        let {id} = this.state;
        if (id !== 0) {
            App.api('usr/product/product', {id}).then((product) => {
                this.setState({
                    product
                });
            })
        }
    };

    handleSubmit = () => {

        let {product = {}} = this.state;
        let {title, sortId = 0, productItems = [], content} = product;

        if (sortId === 0) {
            message.warn('请选择分类');
            return;
        }

        if (U.str.isEmpty(title)) {
            message.warn('请填写商品名称');
            return;
        }

        if (U.str.isEmpty(content)) {
            message.warn('请填写商品详情');
            return;
        }

        if (productItems.length === 0) {
            message.warn('请添加商品规格');
            return;
        }

        let index_error = -1;
        let error = '';
        let snos = [];

        productItems.map((item, index) => {

            let {imgs = [], params = [], price = 0, stock = 0, sno = 0} = item;

            if (snos.indexOf(sno) !== -1) {
                index_error = index;
                error = `商品规格编号重复`;
            }

            snos.push(sno);

            if (stock === 0) {
                index_error = index;
                error = `请输入库存量`;
            }

            if (price === 0) {
                index_error = index;
                error = `请输入商品价格`;
            }

            if (params.length === 0) {
                index_error = index;
                error = `请添加商品参数`;
            }

            if (imgs.length === 0) {
                index_error = index;
                error = `请上传商品图片`;
            }

        });

        if (index_error > -1) {
            message.warn(`第${index_error + 1}组内容填写有误：${error}`);
            return;
        }

        App.api('usr/product/save', {
            product: JSON.stringify(product)
        }).then(() => {
            message.success('已保存');
            window.history.back();
        });
    };

    syncPoster = (img, index) => {
        this.doImgOpt(index, 0, 'add', img);
    };

    doImgOpt = (index1, index2, opt, img) => {

        let {product = {}} = this.state;
        let {productItems = []} = product;

        let imgs = productItems[index1].imgs || [];

        if (opt === 'left') {
            if (index2 === 0) {
                message.warn('已经是第一个');
                return;
            }
            imgs = U.array.swap(imgs, index2, index2 - 1);
        } else if (opt === 'right') {
            if (index2 === imgs.length - 1) {
                message.warn('已经是最后一个');
                return;
            }
            imgs = U.array.swap(imgs, index2, index2 + 1);
        } else if (opt === 'remove') {
            imgs = U.array.remove(imgs, index2);
        } else if (opt === 'add') {
            imgs.push(img);
        }

        productItems[index1].imgs = imgs;
        this.setState({
            product: {
                ...product,
                productItems
            }
        });
    };

    syncContent = (content) => {
        let {product = {}} = this.state;
        this.setState({
            product: {
                ...product,
                content,
            }
        })
    };

    render() {

        let {product = {}, sort = []} = this.state;
        let {title, sortId, status = 2, priority, productItems = [], content} = product;

        return <div className="common-edit-page">

            <Card extra={<Button type="primary" icon="save" onClick={() => {
                this.handleSubmit()
            }}>保存</Button>}>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='分类'>
                    <TreeSelect
                        style={{width: 500}}
                        value={sortId}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="请选择分类"
                        treeDefaultExpandAll
                        onChange={(v) => {
                            this.setState({
                                product: {
                                    ...product,
                                    sortId: v
                                }
                            })
                        }}>
                        {sort.map((t1, index1) => {
                            let {id, name, children = []} = t1;
                            return <TreeNode value={id} title={name} key={index1} disabled>
                                {children.map((t2, index2) => {
                                    let {id, name, children = []} = t2;
                                    return <TreeNode value={id} title={name} key={`${index1}-${index2}`} disabled>
                                        {children.map((t3, index3) => {
                                            let {id, name} = t3;
                                            return <TreeNode value={id} title={name}
                                                             key={`${index1}-${index2}-${index3}`}/>
                                        })}
                                    </TreeNode>
                                })}
                            </TreeNode>
                        })}
                    </TreeSelect>
                    &nbsp;&nbsp;&nbsp;
                    {SellProductUtils.renderCategoryTags(sort, sortId)}

                </FormItem>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='名称'>
                    <Input placeholder="输入名称"
                           value={title} maxLength={64}
                           onChange={(e) => {
                               this.setState({
                                   product: {
                                       ...product,
                                       title: e.target.value
                                   }
                               })
                           }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout} label='权重'>
                    <InputNumber
                        max={100}
                        min={1}
                        value={priority}
                        onChange={(v) => {
                            this.setState({
                                product: {
                                    ...product,
                                    priority: v
                                }
                            })
                        }
                        }
                    />
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout} label='上架'>
                    <Switch checked={status === 1}
                            onChange={(chk) => {
                                this.setState({
                                    product: {
                                        ...product,
                                        status: chk ? 1 : 2
                                    }
                                })
                            }
                            }
                    />
                </FormItem>

                <Form.Item required={true} {...CTYPE.formItemLayout} label='内容'>
                    <HtmlEditor content={content} syncContent={this.syncContent}/>
                </Form.Item>

                <div>

                    <Button type="primary" style={{marginTop: 20}} onClick={() => {
                        if (productItems.length < 3) {
                            productItems.push({});
                            this.setState({
                                product: {
                                    ...product, productItems
                                }
                            });
                        } else {
                            message.warning('最多添加3个');
                        }
                    }}>添加规格</Button>

                    {productItems.map((item, index1) => {
                        let {imgs = [], params = [{label: '', value: ''}], stock = 0, price = 0, sno = 0} = item;
                        return <Card
                            style={{marginTop: 20}}
                            key={index1}
                            title={<div>{`规格${index1 + 1}`} </div>}
                            extra={productItems.length !== 1 &&
                            <Button type="danger" size="default" icon="delete" style={{float: 'right'}}
                                    onClick={() => {
                                        U.array.remove(productItems, index1);
                                        this.setState({product: {...product, productItems}})
                                    }}
                            />}
                        >

                            <FormItem
                                required={true}
                                {...CTYPE.formItemLayout} label='图片列表'>
                                {imgs.map((img, index2) => {
                                    return <Card key={index2} className='img-edit-card'
                                                 cover={<img src={img}/>}
                                                 actions={[
                                                     <Icon type="left" key="left"
                                                           onClick={() => this.doImgOpt(index1, index2, 'left')}/>,
                                                     <Icon type="delete" key="delete"
                                                           onClick={() => this.doImgOpt(index1, index2, 'remove')}/>,
                                                     <Icon type="right" key="right"
                                                           onClick={() => this.doImgOpt(index1, index2, 'right')}/>
                                                 ]}/>
                                })}
                            </FormItem>

                            <PosterEdit title='上传图⽚' type='s' img={null} required={true} syncPoster={(img) => {
                                this.syncPoster(img, index1)
                            }}/>

                            <Form.Item required={true} {...CTYPE.formItemLayout} label='产品参数'>
                                <Form.Item
                                    style={{width: 594}} bodyStyle={{padding: 15}}>
                                    {params.map((param, i) => {
                                        let {label, value} = param;
                                        return <div className='array-edit-block' key={i}>

                                            <Input.Group compact style={{margin: '10px'}}>

                                                <Input style={{width: 100}} placeholder="属性名" value={label}
                                                       onChange={(e) => {
                                                           params[i] = {label: e.target.value, value};
                                                           productItems[index1].params = params;
                                                           this.setState({
                                                               product: {
                                                                   ...product, productItems
                                                               }
                                                           });
                                                       }}/>

                                                <Input style={{width: 350}} placeholder="属性内容" value={value}
                                                       onChange={(e) => {
                                                           params[i] = {label, value: e.target.value};
                                                           productItems[index1].params = params;
                                                           this.setState({
                                                               product: {
                                                                   ...product, productItems
                                                               }
                                                           });
                                                       }}/>

                                                {params.length !== 1 &&
                                                <Button type='primary' size='default' shape="circle" icon='minus'
                                                        onClick={() => {
                                                            params = U.array.remove(params, i);
                                                            productItems[index1].params = params;
                                                            this.setState({
                                                                product: {
                                                                    ...product, productItems
                                                                }
                                                            });
                                                        }}/>}

                                                {i === params.length - 1 &&
                                                <Button type='primary' size='default' shape="circle" icon="plus"
                                                        onClick={() => {
                                                            if (params.length < 3) {
                                                                params.push({label: '', value: ''});
                                                                productItems[index1].params = params;
                                                                this.setState({
                                                                    product: {
                                                                        ...product, productItems
                                                                    }
                                                                });
                                                            } else {
                                                                message.warning('最多添加3个');
                                                            }
                                                        }}/>}
                                            </Input.Group>
                                        </div>
                                    })}
                                </Form.Item>
                            </Form.Item>

                            <Form.Item required={true} {...CTYPE.formItemLayout} label='价格'>
                                <InputNumber defaultValue={price} min={0} onChange={(value) => {
                                    productItems[index1].price = value;
                                    this.setState({
                                        product: {
                                            ...product, productItems
                                        }
                                    });
                                }}/>
                            </Form.Item>

                            <Form.Item required={true} {...CTYPE.formItemLayout} label='库存'><InputNumber
                                defaultValue={stock} min={0} onChange={(value) => {
                                productItems[index1].stock = value;
                                this.setState({
                                    product: {
                                        ...product, productItems
                                    }
                                });
                            }}/>
                            </Form.Item>
                            <Form.Item required={true} {...CTYPE.formItemLayout} label='商品编号'><InputNumber
                                defaultValue={sno} min={0} onChange={(value) => {
                                productItems[index1].sno = value;
                                this.setState({
                                    product: {
                                        ...product, productItems
                                    }
                                });
                            }}/>
                            </Form.Item>
                        </Card>
                    })}
                </div>
            </Card>
        </div>
    }
}

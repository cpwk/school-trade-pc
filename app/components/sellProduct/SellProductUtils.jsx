import React from 'react';
import SellProductEdit from "./SellProductEdit";
import {App, Utils} from "../../common";
import U from "../../common/U";
import {Breadcrumb, Tag} from 'antd';

let SellProductUtils = (() => {
    let currentPageKey = 'key-buyProduct-pageno';
    let setCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentPageKey, pageno);
    };

    let getCurrentPage = () => {
        return Utils._getCurrentPage(currentPageKey);
    };

    let edit = (product, loadData) => {
        Utils.common.renderReactDOM(<SellProductEdit product={product} loadData={loadData}/>);
    };

    let loadSort = (compont) => {
        App.api('usr/sort/sorts').then((sort) => {
            compont.setState({sort});
        });
    };

    let renderCategoryTags = (sorts, sortId) => {

        if (!sorts || sorts.length === 0) {
            return null;
        }

        if (!sortId || sortId === 0) {
            return null;
        }

        let sequence = '';
        sorts.map((t1) => {
            if (t1.id === sortId) {
                sequence = t1.sequence;
            }
            t1.children.map((t2) => {
                if (t2.id === sortId) {
                    sequence = t2.sequence;
                }
                t2.children.map((t3) => {
                    if (t3.id === sortId) {
                        sequence = t3.sequence;
                    }
                })
            })
        });
        if (U.str.isEmpty(sequence)) {
            return null;
        }
        let ret = [];
        sorts.map((t1) => {
            if (t1.sequence.substr(0, 2) === sequence.substr(0, 2)) {
                ret.push(<Tag key={0} color="#f50">{t1.name}</Tag>);
                t1.children.map((t2) => {
                    if (t2.sequence.substr(0, 4) === sequence.substr(0, 4)) {
                        ret.push(<Tag key={1} color="#108ee9">{t2.name}</Tag>);
                        t2.children.map((t3) => {
                            if (t3.sequence === sequence) {
                                ret.push(<Tag key={2} color="green">{t3.name}</Tag>);
                            }
                        })
                    }
                })
            }
        });
        return ret;
    };

    let parseSequence = (s) => {
        return s.substring(0, 2) + '-' + s.substring(2, 4) + '-' + s.substring(4, 6);
    };

    let loadProductCategories = (component) => {
        App.api('adm/sort/sorts').then((productCategories) => {
            productCategories.map((t1) => {

                let {sequence, name, children = []} = t1;
                t1.key = parseSequence(sequence);
                t1.value = sequence;
                t1.title = name;

                children.map((t2) => {
                    let {sequence, name, children = []} = t2;

                    t2.key = parseSequence(sequence);
                    t2.value = sequence;
                    t2.title = name;

                    children.map((t3) => {
                        let {sequence, name, children = []} = t3;

                        t3.key = parseSequence(sequence);
                        t3.value = sequence;
                        t3.title = name;
                    })
                })

            });
            component.setState({productCategories});
        });
    };

    let renderProductCategories = (types, productCategorySequences) => {


        if (!types || types.length === 0) {
            return <Tag color="#f50">全品类</Tag>;
        }

        let arr = [];
        productCategorySequences.map((sequence, index) => {
            let ret = [];
            types.map((t1, index1) => {
                if (t1.sequence.substr(0, 2) === sequence.substr(0, 2)) {
                    ret.push(<Breadcrumb.Item key={index1}>{t1.title}</Breadcrumb.Item>);
                    t1.children.map((t2, index2) => {
                        if (t2.sequence.substr(0, 4) === sequence.substr(0, 4)) {
                            ret.push(<Breadcrumb.Item key={`${index1}-${index2}`}>{t2.title}</Breadcrumb.Item>);
                            t2.children.map((t3, index3) => {
                                if (t3.sequence === sequence) {
                                    ret.push(<Breadcrumb.Item
                                        key={`${index1}-${index2}-${index3}`}>{t3.title}</Breadcrumb.Item>);
                                }
                            })
                        }
                    })
                }
            });
            if (ret.length > 0) {
                arr.push(<Breadcrumb separator=">" key={index}>{ret}</Breadcrumb>);
            }
        });

        return arr;

    };

    return {
        renderProductCategories,
        edit,
        setCurrentPage,
        getCurrentPage,
        loadSort,
        renderCategoryTags,
        loadProductCategories
    }

})();

export default SellProductUtils;

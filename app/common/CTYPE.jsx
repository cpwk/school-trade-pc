let CTYPE = (() => {
    let maxlength = {title: 140, intro: 500};

    let minlength = {title: 1, intro: 1};

    let eidtMaxWidth = 1800;

    let eidtMinWidth = 900;

    let formStyle = {minWidth: eidtMinWidth, maxWidth: eidtMaxWidth, marginTop: '20px'};
    return {

        addr_cn: '河南省郑州市新郑市龙湖镇华南城电商大厦B座303',
        worktime: '周一至周六 9:00-21:00',
        contact: '超级管理员 185-3949-2117',

        pagination: {pageSize: 10},
        commonPagination: {showQuickJumper: true, showSizeChanger: true, showTotal: total => `总共 ${total} 条`},

        bannerTypes: {HOME: 1, CASE: 2},
        minprice: 0,
        maxprice: 1000000,

        eidtMaxWidth: 1800,

        eidtMinWidth: 900,

        maxlength: maxlength,

        minlength: minlength,

        formStyle,

        fieldDecorator_rule_title: {
            type: 'string',
            required: true,
            message: `标题长度为${minlength.title}~${maxlength.title}个字`,
            whitespace: true,
            min: minlength.title,
            max: maxlength.title
        },

        expirePeriods: [{key: '1D', label: '一天'},
            {key: '3D', label: '三天'},
            {key: '1W', label: '一周'},
            {key: '1M', label: '一个月'},
            {key: '3M', label: '三个月'},
            {key: '6M', label: '六个月'},
            {key: '1Y', label: '一年'},
            {key: '2Y', label: '两年'},
            {key: '3Y', label: '三年'},
            {key: '5Y', label: '五年'},
            {key: '10Y', label: '十年'}],

        link: {

            info_banners: {key: '/app/info/banners', path: '/app/info/banners', txt: 'Banner'},
            info_product: {key: '/app/info/buyProduct', path: '/app/info/buyProduct', txt: '商品管理'},

            info_sort: {key: '/app/info/sort', path: '/app/info/sort', txt: '商品类型管理'},

            info_user: {key: '/app/info/user', path: '/app/info/user', txt: '用户管理'},

            info_articles: {key: '/app/info/articles', path: '/app/info/articles', txt: '动态管理'},
            info_custcases: {key: '/app/info/custcases', path: '/app/info/custcases', txt: '案例管理'},
            info_custevals: {key: '/app/info/custevals', path: '/app/info/custevals', txt: '评价管理'},

            admin_admins: {key: '/app/admin/admins', path: '/app/admin/admins', txt: '管理员'},
            admin_roles: {key: '/app/admin/roles', path: '/app/admin/roles', txt: '权限组'},
        },

        //图片裁切工具比例
        imgeditorscale: {
            square: 1,
            rectangle_v: 1.7778,
            rectangle_h: 0.5625,
        },

        formItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },

        dialogItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },

        shortFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 3},
            },
            wrapperCol: {
                xs: {span: 4},
                sm: {span: 3},
            },
        },

        longFormItemLayout: {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        },

        tailFormItemLayout: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 3,
                },
            },
        },
        tailFormItemLayout_address: {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 18,
                    offset: 3,
                },
            },
        },

        REGION_PATH: 'http://fs.maidaotech.cn/assets/js/pca-code.json',
    }

})();

export default CTYPE;

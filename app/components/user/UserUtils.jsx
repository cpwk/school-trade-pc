import React from 'react';
import {Utils} from '../../common';
import VipRenew from './VipRenew';
import UpdatePassword from './UpdatePassword'
import UserEdit from './UserEdit'

const types = [
    {key: 1, value: '普通会员'},
    {key: 2, value: '超级会员'},
    {key: 3, value: '白银会员'},
    {key: 4, value: '黄金会员'},
    {key: 5, value: '铂金会员'},
    {key: 6, value: '钻石会员'},
    {key: 7, value: '至尊会员'},
];
let UserUtils = (() => {

    let vipRenew = (profile, loadData) => {
        Utils.common.renderReactDOM(<VipRenew profile={profile} loadData={loadData}/>);
    };

    let getType = (sno) => {
        let type = types.find(aa => aa.key === sno);
        return type.value
    };

    let modUserPwd = () => {
        Utils.common.renderReactDOM(<UpdatePassword/>);
    };

    let modUserPro = () => {
        Utils.common.renderReactDOM(<UserEdit/>);
    };


    return {getType, modUserPwd, modUserPro, vipRenew}

})();

export default UserUtils;

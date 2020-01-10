import React from 'react';
import {Utils} from "../../common";
import AddressEdit from "./AddressEdit";

let AddressUtils = (() => {

    let EditAddress = (address, loadData) => {
        Utils.common.renderReactDOM(<AddressEdit address={address} loadData={loadData}/>);
    };


    return {
        EditAddress
    }

})();

export default AddressUtils;
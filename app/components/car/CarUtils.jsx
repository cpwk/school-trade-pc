import Utils from "../../common/Utils";
import React from "react";
import CarEdit from "./CarEdit";
import {App} from "../../common";

let CarUtils = (() => {

    let currentPageKey = 'key-car-pageno';

    let setCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentPageKey, pageno);
    };

    let getCurrentPage = () => {
        return Utils._getCurrentPage(currentPageKey);
    };
    let edit = (car, loadData) => {
        Utils.common.renderReactDOM(<CarEdit car={car} loadData={loadData}/>);
    };

    let load = () => {
        return new Promise((resolve) => {
            App.api('user/car/cars', {
                cartQo: JSON.stringify({})
            }).then((carts = []) => {
                resolve(carts);
            });
        })
    };

    return {
        setCurrentPage, getCurrentPage, edit, load
    }

})();

export default CarUtils;
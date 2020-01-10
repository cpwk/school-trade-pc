import {action, configure, observable} from 'mobx';

configure({enforceActions: "observed"});
export default class Carts {

    @observable carts = [];
    @observable count = 0;

    get getCarts() {
        return JSON.parse(JSON.stringify(this.carts));
    }

    get getCount() {
        return this.count;
    }

    @action setCarts(carts) {
        this.carts = carts;
        this.doSum();
    }

    doSum = () => {
        let count = 0;
        this.carts.map((item) => {
            count += item.num;
        });
        this.count = count;
    };
}
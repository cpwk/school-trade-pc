import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom'
import HomeWrap from './components/common/HomeWrap';
import Home from './components/common/Home';
import BuyProducts from "./components/buyProduct/BuyProducts";
import SignUp from "./components/user/SignUp";
import SignIn from "./components/user/SignIn";
import ForgetPassword from "./components/user/ForgetPassword";
import ResetPassword from "./components/user/ResetPassword";
import User from "./components/user/User";
import UserWrap from "./components/common/UserWrap";
import Product from "./components/buyProduct/BuyProduct";
import Address from "./components/address/Address";
import Order from "./components/order/Order";
import Car from "./components/car/Car";
import OrderTemp from "./components/order/OrderTemp";
import Coupon from "./components/coupon/Coupon";
import UserCoupon from "./components/user/UserCoupon";
import BuyProductTemp from "./components/buyProduct/BuyProductTemp";
import Comment from "./components/comment/Comment"
import SellProducts from "./components/sellProduct/SellProducts";
import SellProductEdit from "./components/sellProduct/SellProductEdit";

const routes = (
    <HashRouter>
        <Switch>
            <Route path='/user' children={() => (
                <UserWrap>
                    <Route path='/user/profile' component={User}/>
                    <Route path='/user/address' component={Address}/>
                    <Route path='/user/order' component={Order}/>
                    <Route path='/user/usercoupon' component={UserCoupon}/>
                    <Route path='/user/comment/:id' component={Comment}/>
                    <Route path='/user/sell-products' component={SellProducts}/>
                    <Route path={'/user/sell-product-edit/:id'} component={SellProductEdit}/>
                </UserWrap>
            )}>
            </Route>
            <Route path='/' children={() => (
                <HomeWrap>
                    <Switch>
                        <Route path='/' exact component={Home}/>
                        <Route path='/signin' component={SignIn}/>
                        <Route path='/findpassword' component={ForgetPassword}/>
                        <Route path='/resetpassword' component={ResetPassword}/>
                        <Route path='/signup' component={SignUp}/>
                        <Route path='/products/:firstSortId' component={BuyProducts}/>
                        <Route path='/buyProduct/:id' component={Product}/>
                        <Route path='/car' component={Car}/>
                        <Route path='/ordertemp/:ids' component={OrderTemp}/>
                        <Route path='/producttemp/:ids' component={BuyProductTemp}/>
                        <Route path='/coupon' component={Coupon}/>
                    </Switch>
                </HomeWrap>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);

export default routes;

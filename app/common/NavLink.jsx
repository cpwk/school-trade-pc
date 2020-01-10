import React from 'react';
import {Link} from 'react-router-dom';

export default class NavLink extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            to: this.props.to,
            _to: '/',
            en: this.props.en,
            cn: this.props.cn,
            txt: '',
            className: ''
        }

    }

    componentDidMount() {
        let {to} = this.state;
        let _to = window.location.hash.split('#')[1] || '/';
        this.setState({_to, className: to === _to ? 'cur' : ''});
        window.addEventListener('hashchange', (e) => {
            _to = window.location.hash.split('#')[1];
            this.setState({_to, className: to === _to ? 'cur' : ''});
        });

    }

    render() {

        let {_to, to, cn, en, txt, className} = this.state;

        return <Link
            to={to}
            onMouseOver={() => {
                this.setState({txt: en, className: 'cur'});
            }}
            onMouseLeave={() => {
                this.setState({txt: cn, className: to === _to ? 'cur' : ''});
            }}
            onClick={() => {
                if (!to || (to && to !== _to)) {
                    this.setState({_to: to});
                }
            }} className={className}
        >{txt || cn}</Link>
    }
}


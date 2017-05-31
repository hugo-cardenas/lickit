import React, {Component} from 'react';
import './Lick.css';
import LickForm from './LickForm';
import LickView from './LickView';

class Lick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.mode
        };
    }

    render() {
        switch (this.state.mode) {
            case 'edit':
                return this.renderForm();
            case 'view':
            default:
                return this.renderView();
        }
    }

    renderView() {
        const props = {
            ...this.props,
            handleEdit: () => this.setMode('edit')
        }
        return <LickView {...props}/>
    }

    renderForm() {
        const props = {
            ...this.props,
            handleSave: () => this.setMode('view'),
            handleCancel: () => this.setMode('view')
        }
        return <LickForm {...props}/>
    }

    setMode(mode) {
        this.setState({mode});
    }
}

export default Lick;

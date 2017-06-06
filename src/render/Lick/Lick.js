import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Lick.css';
import LickForm from './LickForm';
import LickView from './LickView';

class Lick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'view'
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
        // const props = {
        //     ...this.props,
        //     handleCancel: () => this.setMode('view'),
        //     handleSave: (lick) => {
        //         this.props.handleSave(lick);
        //         this.setMode('view');
        //     }
        // }
        let props = Object.assign({}, this.props);
        props.handleCancel = () => {
            this.setMode('view');
        };
        props.handleSave = (lick) => {
            this.props.handleSave(lick);
            this.setMode('view');
        };

        return <LickForm {...props}/>
    }

    setMode(mode) {
        this.setState({mode});
    }
}

export default Lick;

LickForm.propTypes = {
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
}
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Lick.css';
import LickForm from './LickForm';
import LickView from './LickView';

class Lick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.mode || 'view'
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
            lick: this.props.lick,
            handleEdit: () => this.setMode('edit'),
            handleDelete: this.props.handleDelete
        }
        return <LickView {...props}/>;
    }

    renderForm() {
        const props = {
            lick: this.props.lick,
            handleSave: (lick) => {
                this.props.handleSave(lick);
                this.setMode('view');
            },
            handleCancel: () => this.setMode('view'),
            handleDelete: this.props.handleDelete
        };
        return <LickForm {...props}/>;
    }

    setMode(mode) {
        this.setState({mode});
    }
}

export default Lick;

LickForm.propTypes = {
    lick: PropTypes.shape({
        id: PropTypes.number,
        description: PropTypes.string,
        tracks: PropTypes.arrayOf(PropTypes.object),
        tags: PropTypes.arrayOf(PropTypes.string)
    }),
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'view'])
};
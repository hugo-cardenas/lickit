import React from 'react';
import PropTypes from 'prop-types';
import './Lick.css';
import LickForm from './LickForm';
import LickView from './LickView';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from '../../state/actions/lick/modes';

function Lick(props) {
    const { lick, mode, handleSave, handleDelete, changeLickMode } = props;
    switch (mode) {
        case LICK_MODE_EDIT:
            return renderForm(lick, handleSave, changeLickMode, handleDelete);
        case LICK_MODE_VIEW:
        default:
            return renderView(lick, changeLickMode, handleDelete);
    }
}

function renderView(lick, changeLickMode, handleDelete) {
    const props = {
        lick,
        handleEdit: () => changeLickMode(lick.id, LICK_MODE_EDIT),
        handleDelete
    };
    return <LickView {...props}/>;
}

function renderForm(lick, handleSave, changeLickMode, handleDelete) {
    const props = {
        lick,
        handleSave,
        handleCancel: () => changeLickMode(lick.id, LICK_MODE_VIEW),
        handleDelete
    };
    return <LickForm {...props}/>;
}

export default Lick;

Lick.propTypes = {
    lick: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    handleSave: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    changeLickMode: PropTypes.func.isRequired,
    mode: PropTypes.oneOf([LICK_MODE_EDIT, LICK_MODE_VIEW])
};

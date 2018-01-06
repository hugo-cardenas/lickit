import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import LickForm from './LickForm';
import LickView from './LickView';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from '../../state/actions/lick/modes';

class Lick extends React.Component {
    render() {
        const { lick, saveLick, deleteLick, changeLickMode } = this.props;
        switch (lick.mode) {
            case LICK_MODE_EDIT:
                return renderForm(lick, saveLick, changeLickMode, deleteLick);
            case LICK_MODE_VIEW:
            default:
                return renderView(lick, changeLickMode, deleteLick);
        }
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps.lick, this.props.lick);
    }
}

function renderView(lick, changeLickMode, deleteLick) {
    const props = {
        lick,
        editLick: id => changeLickMode(id, LICK_MODE_EDIT),
        deleteLick
    };
    return <LickView {...props} />;
}

function renderForm(lick, saveLick, changeLickMode, deleteLick) {
    const props = {
        lick,
        saveLick,
        cancelLickEditor: id => changeLickMode(id, LICK_MODE_VIEW),
        deleteLick
    };
    return <LickForm {...props} />;
}

export default Lick;

Lick.propTypes = {
    lick: PropTypes.shape({
        id: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    saveLick: PropTypes.func.isRequired,
    deleteLick: PropTypes.func.isRequired,
    changeLickMode: PropTypes.func.isRequired,
    mode: PropTypes.oneOf([LICK_MODE_EDIT, LICK_MODE_VIEW])
};

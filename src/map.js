import { difference, groupBy, merge, uniq } from 'lodash';
import {
    enableCreateLickForm,
    cancelCreateLickForm,
    createLick,
    updateLick,
    deleteLick,
    changeLickMode
} from './state/actions/lick';
import { addFilter, removeFilter, setInput } from './state/actions/search';
import { getPathResolver } from './track/pathResolver';
import { TYPE_ARTIST, TYPE_TAG } from './search/filterTypes';
import { LICK_MODE_EDIT, LICK_MODE_VIEW } from './state/actions/lick/modes';
import { getError, isLickCreationOpen, getLicks, getSearch } from './state/selectors';

const mapStateToProps = state => {
    return {
        error: getError(state),
        lick: {
            isCreationOpen: isLickCreationOpen(state),
            licks: getLicks(state)
        },
        search: getSearch(state)
    };
};

// TODO Change to simple object
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
const mapDispatchToProps = dispatch => {
    return {
        lick: {
            enableCreateLickForm: () => dispatch(enableCreateLickForm()),
            cancelCreateLickForm: () => dispatch(cancelCreateLickForm()),
            createLick: lick => dispatch(createLick(lick)),
            saveLick: lick => dispatch(updateLick(lick)),
            deleteLick: id => dispatch(deleteLick(id)),
            changeLickMode: (id, mode) => dispatch(changeLickMode(id, mode))
        },
        search: {
            addFilter: filter => dispatch(addFilter(filter)),
            removeFilter: filter => dispatch(removeFilter(filter)),
            setInput: input => dispatch(setInput(input))
        }
    };
};

const mergeProps = (stateProps, dispatchProps) =>
    merge(stateProps, dispatchProps);

export { mapStateToProps, mapDispatchToProps, mergeProps };

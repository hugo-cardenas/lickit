import VError from 'verror';
import _ from 'lodash';

const defaultState = {
    isCreateFormEnabled: false,
    items: []
};

export default (state = defaultState) => {
    return {
        ...state,
        items: indexItemsById(state.items)
    };
};

const indexItemsById = items => {
    const newItems = {};
    items.forEach(item => {
        try {
            newItems[item.lick.id] = {
                ...item,
                lick: _.omit(item.lick, ['id'])
            };
        } catch (error) {
            throw new VError(
                error,
                `Unable to index by id item ${JSON.stringify(item)}`
            );
        }
    });
    return newItems;
};

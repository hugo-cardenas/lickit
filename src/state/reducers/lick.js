export default function (state = {}, action) {
    switch (action.type) {
        case 'delete':
            const licks = state.filter(lick => 
                lick.id !== action.id
            );
            return licks;
        default:
            return state;
    }
};

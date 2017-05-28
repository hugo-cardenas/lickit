export default function (state = [], action) {
    switch (action.type) {
        case 'delete':
            const licks = state.licks.filter(lick => 
                lick.id !== action.id
            );
            return [
                ...state,
                licks
            ];
        default:
            return state;
    }
};

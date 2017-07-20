import { ERROR_CREATE } from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
        case ERROR_CREATE:
            return (action.error instanceof Error) ? action.error : new Error('Undefined error');
        default:
            return null;
    }
}

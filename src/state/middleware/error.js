import { createError } from '../actions/error';

const errorMiddleware = ({ dispatch }) => next => action => {
    try {
        const result = next(action);
        if (result instanceof Promise) {
            return result.catch(error => {
                console.error(error);
                dispatch(createError(error));
            });
        }
    } catch (error) {
        console.error(error);
        dispatch(createError(error));
    }
};

export default errorMiddleware;

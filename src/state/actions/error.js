import { ERROR_CREATE } from './types';

export function createError(error) {
    return { type: ERROR_CREATE, error };
}

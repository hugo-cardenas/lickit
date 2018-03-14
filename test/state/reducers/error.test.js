import errorReducer from 'src/state/reducers/error';
import { createError } from 'src/state/actions/error';

it('create error', () => {
  const error = new Error('42');
  const action = createError(error);
  // Previous state is irrelevant
  const state = errorReducer('foo bar', action);
  expect(state).toBe(error);
});

it('create error with invalid error object', () => {
  const error = '42';
  const action = createError(error);
  // Previous state is irrelevant
  const state = errorReducer('foo bar', action);
  expect(state).toEqual(new Error('Undefined error'));
});

it('return null state for any other action', () => {
  const action = { type: 'baz' };
  // Previous state is irrelevant
  expect(errorReducer('foo bar', action)).toBe(null);
});

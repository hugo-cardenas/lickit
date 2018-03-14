import errorMiddleware from 'src/state/middleware/error';
import { ERROR_CREATE } from 'src/state/actions/types';

it('dispatches successful action', () => {
  const dispatch = null;
  const next = jest.fn();
  const action = { type: 'foo' };

  errorMiddleware({ dispatch })(next)(action);
  expect(next).toBeCalledWith(action);
});

it('dispatches successful action which returns promise', () => {
  const dispatch = jest.fn();
  const next = jest.fn();
  const action = { type: 'foo' };

  errorMiddleware({ dispatch })(next)(action);
  expect(next).toBeCalledWith(action);
});

it('catches failed promise and dispatches error action', async () => {
  const dispatch = jest.fn();
  const error = new Error('foobar');
  const next = jest.fn().mockReturnValueOnce(Promise.reject(error));
  const action = { type: 'foo' };

  await errorMiddleware({ dispatch })(next)(action);
  expect(dispatch).toBeCalledWith({ type: ERROR_CREATE, error });
});

it('catches thrown error and dispatches error action', () => {
  const dispatch = jest.fn();
  const error = new Error('foobar');
  const next = jest.fn().mockImplementationOnce(() => {
    throw error;
  });
  const action = { type: 'foo' };

  errorMiddleware({ dispatch })(next)(action);
  expect(dispatch).toBeCalledWith({ type: ERROR_CREATE, error });
});

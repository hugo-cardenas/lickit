import { isEqual, uniqWith } from 'lodash';
import Joi from 'joi-browser';
import VError from 'verror';
import {
  SEARCH_ADD_FILTER,
  SEARCH_REMOVE_FILTER,
  SEARCH_SET_INPUT
} from '../actions/types';
import { TYPE_ARTIST, TYPE_TAG } from '../../search/filterTypes';

const defaultState = {
  input: '',
  filters: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_ADD_FILTER:
      return addFilter(state, action.filter);
    case SEARCH_REMOVE_FILTER:
      return removeFilter(state, action.filter);
    case SEARCH_SET_INPUT:
      return setInput(state, action.input);
    default:
      return state;
  }
};

const addFilter = (state, filter) => {
  try {
    validateFilter(filter);
  } catch (error) {
    throw new VError(
      error,
      'Unable to reduce %s with filter "%s"',
      SEARCH_ADD_FILTER,
      JSON.stringify(filter)
    );
  }

  // If there is an artist filter already stored, new artist filters are ignored
  if (
    filter.type === TYPE_ARTIST &&
    state.filters.find(filter => filter.type === TYPE_ARTIST)
  ) {
    return state;
  }

  return {
    ...state,
    filters: uniqWith([...state.filters, filter], isEqual)
  };
};

const removeFilter = (state, filter) => {
  try {
    validateFilter(filter);
  } catch (error) {
    throw new VError(
      error,
      'Unable to reduce %s with filter "%s"',
      SEARCH_REMOVE_FILTER,
      JSON.stringify(filter)
    );
  }

  const filters = [...state.filters];
  const index = filters.findIndex(storedFilter =>
    isEqual(storedFilter, filter)
  );
  if (index > -1) {
    filters.splice(index, 1);
  }
  return {
    ...state,
    filters
  };
};

const validateFilter = filter => {
  const schema = Joi.object().keys({
    type: Joi.string()
      .valid(TYPE_ARTIST, TYPE_TAG)
      .required(),
    value: Joi.string().required()
  });

  const { error } = Joi.validate(filter, schema, {
    abortEarly: false,
    convert: false
  });
  if (error) {
    throw new VError(error, 'Invalid filter');
  }
};

const setInput = (state, input) => {
  try {
    validateInput(input);
  } catch (error) {
    throw new VError(
      error,
      'Unable to reduce %s with input "%s"',
      SEARCH_SET_INPUT,
      JSON.stringify(input)
    );
  }

  return {
    ...state,
    input
  };
};

const validateInput = input => {
  const schema = Joi.string()
    .allow('')
    .required();

  const { error } = Joi.validate(input, schema, {
    abortEarly: false,
    convert: false
  });
  if (error) {
    throw new VError(error, 'Invalid input');
  }
};

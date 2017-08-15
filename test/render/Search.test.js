import React from 'react';
import { render, shallow } from 'enzyme';
import Search from 'src/render/Search';
import { TYPE_ARTIST, TYPE_TAG } from 'src/search/filterTypes';

it('render', () => {
    const props = getProps();
    render(<Search {...props}/>);
});

it('select suggestion, add filter', () => {
    const props = getProps();
    props.addFilter = jest.fn();
    props.setInput = jest.fn();

    const component = shallow(<Search {...props}/>);

    selectSuggestion(component, 0, 'Charlie Foo');

    expect(props.addFilter).toHaveBeenCalledTimes(1);
    expect(props.addFilter).toBeCalledWith({
        type: TYPE_ARTIST,
        value: 'Charlie Foo'
    });

    expect(props.setInput).toHaveBeenCalledTimes(1);
    expect(props.setInput).toBeCalledWith('');

    selectSuggestion(component, 1, 'Bar');

    expect(props.addFilter).toHaveBeenCalledTimes(2);
    expect(props.addFilter).toBeCalledWith({
        type: TYPE_TAG,
        value: 'Bar'
    });

    expect(props.setInput).toHaveBeenCalledTimes(2);
    expect(props.setInput).toBeCalledWith('');
});

it('get suggestions, all returned', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    updateSuggestions(component, '');
    expect(getSuggestions(component)).toEqual(props.suggestions);
});

it('get suggestions, filter based on input', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    // Should trim value and lowercase it
    updateSuggestions(component, ' bAr  ');
    expect(component.find('Autosuggest').prop('suggestions')).toEqual([
        {
            title: 'Artist',
            suggestions: [
                'Dizzy Bar',
                'Django Foobar'
            ]
        },
        {
            title: 'Tag',
            suggestions: [
                'Bar', // These match case-insensitively
                'fooBaR',
                'baRbaz'
            ]
        }
    ]);
});

it('get suggestions - input does not match any', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    updateSuggestions(component, 'nonMatchingInput');
    expect(component.find('Autosuggest').prop('suggestions')).toEqual([]);
});

it('remove filter', () => {
    const props = getProps();
    props.filters = [
        {
            type: TYPE_ARTIST,
            value: 'Charlie Foo'
        },
        {
            type: TYPE_TAG,
            value: 'foo'
        },
        {
            type: TYPE_TAG,
            value: 'bar'
        }
    ];
    props.removeFilter = jest.fn();

    const component = shallow(<Search {...props}/>);

    clickRemoveFilter(component, 'foo');

    expect(props.removeFilter).toHaveBeenCalledTimes(1);
    expect(props.removeFilter).toBeCalledWith({
        type: TYPE_TAG,
        value: 'foo'
    });
});

it('clear suggestions', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    clearSuggestions(component);
    expect(getSuggestions(component)).toEqual([]);
});

it('set input on change', () => {
    const props = getProps();
    props.setInput = jest.fn();
    const component = shallow(<Search {...props}/>);

    changeInput(component, 'foobar');
    
    expect(props.setInput).toHaveBeenCalledTimes(1);
    expect(props.setInput).toBeCalledWith('foobar');
});

const selectSuggestion = (search, sectionIndex, suggestionValue) =>
    search.find('Autosuggest').prop('onSuggestionSelected')({}, { suggestionValue, sectionIndex });

const getSuggestions = (search) =>
    search.find('Autosuggest').prop('suggestions');

const updateSuggestions = (search, value) =>
    search.find('Autosuggest').prop('onSuggestionsFetchRequested')({ value });

const clearSuggestions = search =>
    search.find('Autosuggest').prop('onSuggestionsClearRequested')();

const clickRemoveFilter = (search, value) =>
    search.find('.lick-filters .tags')
    .filterWhere(tag => tag.find('span').text() === value)
    .first()
    .find('.is-delete')
    .simulate('click');

const changeInput = (search, value) => {
    search.find('Autosuggest').prop('inputProps').onChange({}, { newValue: value });
};

const getProps = () => {
    return {
        filters: [],
        suggestions: [
            {
                title: TYPE_ARTIST,
                suggestions: [
                    'Charlie Foo',
                    'Dizzy Bar',
                    'Django Foobar'
                ]
            },
            {
                title: TYPE_TAG,
                suggestions: [
                    'foo',
                    'Bar',
                    'fooBaR',
                    'baRbaz'
                ]
            }
        ],
        input: '',
        addFilter: () => {},
        removeFilter: () => {},
        setInput: () => {},
    };
};

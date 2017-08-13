import React from 'react';
import { render, shallow } from 'enzyme';
import Search from 'src/render/Search';

it('render', () => {
    const props = getProps();
    render(<Search {...props}/>);
});

it('get suggestions - all returned', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    updateSuggestions(component, '');
    expect(getSuggestions(component)).toEqual(props.suggestions);
});

it('get suggestions - filter out all artist values', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    selectSuggestion(component, 0, 'Charlie Foo');

    // Should not suggest any more artist values
    updateSuggestions(component, '');
    expect(getSuggestions(component)).toEqual([{
        title: 'Tag',
        suggestions: [
            'foo',
            'Bar',
            'fooBaR',
            'baRbaz'
        ]
    }]);
});

it('get suggestions - filter based on input', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    // Should not appear in suggestions
    selectSuggestion(component, 1, 'baRbaz');

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
                'fooBaR'
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

it('add and remove filter', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    selectSuggestion(component, 0, 'Charlie Foo');
    clickRemoveFilter(component, 'Charlie Foo');

    updateSuggestions(component, '');
    expect(getSuggestions(component)).toEqual(props.suggestions);
});

const selectSuggestion = (search, sectionIndex, suggestionValue) =>
    search.find('Autosuggest').prop('onSuggestionSelected')({}, { suggestionValue, sectionIndex });

const getSuggestions = (search) =>
    search.find('Autosuggest').prop('suggestions');

const updateSuggestions = (search, value) =>
    search.find('Autosuggest').prop('onSuggestionsFetchRequested')({ value });

const clickRemoveFilter = (search, value) =>
    search.find('.lick-filters .tags')
        .filterWhere(tag => tag.find('span').text() === value)
        .first()
        .find('.is-delete')
        .simulate('click');

const getProps = () => {
    return {
        filters: [],
        suggestions: [
            {
                title: 'Artist',
                suggestions: [
                    'Charlie Foo',
                    'Dizzy Bar',
                    'Django Foobar'
                ]
            },
            {
                title: 'Tag',
                suggestions: [
                    'foo',
                    'Bar',
                    'fooBaR',
                    'baRbaz'
                ]
            }
        ],
        value: ''
    };
};

import React from 'react';
import { render, shallow } from 'enzyme';
import Search from 'src/render/Search';

it('render correctly', () => {
    const props = getProps();
    render(<Search {...props}/>);
});

it('add filters', () => {
    const props = getProps();
    const component = shallow(<Search {...props}/>);

    const autoSuggest = component.find('Autosuggest');
    // expect(autoSuggest.prop('suggestions')).toEqual([]);

    // component.simulate('enter');
    // expect(autoSuggest.prop('suggestions')).toEqual(props.suggestions);

    // Select suggestion
    selectSuggestion(autoSuggest, 0, 'Charlie Parker');
    
    console.log(component.find('.lick-filters').debug());
    
    // Should not suggest any more artist values
    console.log(component.find('Autosuggest').prop('suggestions'));
    


    // console.log(autoSuggest);
});

const selectSuggestion = (autoSuggest, sectionIndex, suggestionValue) => {
    autoSuggest.prop('onSuggestionSelected')({}, { suggestionValue, sectionIndex });
};

const getProps = () => {
    return {
        filters: [],
        suggestions: [
            {
                title: 'Artist',
                suggestions: [
                    'Charlie Parker',
                    'Dizzy Gillespie',
                    'Django Reinhardt'
                ]
            },
            {
                title: 'Tag',
                suggestions: [
                    'blues',
                    'bebop',
                    'gypsy jazz',
                    'diminished'
                ]
            }
        ],
        value: ''
    };
};

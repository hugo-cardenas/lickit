import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';


const data = [
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
            'christoph changes',
            'bebop',
            'blues',
            'gypsy jazz'
        ]
    }
];

const getSuggestions = (filters, value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
        return [];
    }

    return data
        // Filter out Artist section if there is already an Artist filter
        .filter(section =>
            section.title !== 'Artist' || !filters.find(filter => filter.type === 'Artist')
        )
        .map(section => {
            return {
                title: section.title,
                suggestions: section.suggestions.filter(suggestion =>
                    //suggestion.toLowerCase().slice(0, inputLength) === inputValue
                    suggestion.toLowerCase().includes(inputValue) &&
                    !isSuggestionContainedInFilters(filters, section.title, suggestion)
                )
            };
        })
        .filter(section => section.suggestions.length > 0);
};

const isSuggestionContainedInFilters = (filters, sectionTitle, suggestion) => {
    return filters.find(filter =>
        filter.type === sectionTitle &&
        filter.value.toLowerCase() === suggestion.toLowerCase()
    );
};

const getSuggestionValue = suggestion => suggestion;

// const renderSuggestionsContainer = ({ containerProps, children, query }) => {
//     return <div className="menu" {... containerProps}>
//         {children}        
//     </div>;
// };

const renderSectionTitle = section => <strong>{section.title}</strong>;

const getSectionSuggestions = section => section.suggestions;

const renderSuggestion = suggestion => suggestion;

const theme = {
    input: 'input control',
    suggestion: 'suggestion',
    suggestionHighlighted: 'suggestion-highlighted',
    suggestionsContainerOpen: 'suggestion-container-open',
    sectionTitle: 'section-title'
    // suggestionsList: 'menu-list'
};

class Search extends Component {
    constructor() {
        super();
        this.state = {
            suggestions: [],
            value: '',
            filters: []
        };
    }

    onSuggestionsFetchRequested({ value }) {
        this.setState({
            suggestions: getSuggestions(this.state.filters, value)
        });
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }

    onSuggestionSelected(event, { suggestionValue, sectionIndex }) {
        const sectionTitle = this.state.suggestions[sectionIndex].title;
        const newFilter = { type: sectionTitle, value: suggestionValue };

        const filters = this.state.filters;
        this.setState({
            filters: [...filters, newFilter],
            value: ''
        });
    }

    removeFilter({ title, value }) {
        this.setState({
            filters: this.state.filters.filter(filter =>
                filter.title !== title || filter.value !== value
            )
        });
    }

    render() {
        const { suggestions, value, filters } = this.state;

        const inputProps = {
            placeholder: 'Search',
            value,
            onChange: (event, { newValue }) => this.setState({ value: newValue })
        };

        return <div className="field is-grouped is-grouped-multiline">
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                
                inputProps={inputProps}
                theme={theme}
                multiSection={true}
                renderSectionTitle={renderSectionTitle}
                getSectionSuggestions={getSectionSuggestions}
                onSuggestionSelected={this.onSuggestionSelected.bind(this)}
            />
            {this.renderFilters(filters)}
        </div>;

        // return <input className="input control" placeholder="Search"/>;
    }

    renderFilters(filters) {
        return <div className="control field is-grouped is-grouped-multiline">
            {filters.map(filter => this.renderFilter(filter))}
        </div>;
    }

    renderFilter(filter) {
        return <div key={filter.type + filter.value} className="control">
            <div className="tags has-addons">
                <span className="tag">{filter.value}</span>
                <a className="tag is-delete" onClick={() => this.removeFilter(filter)}></a>
            </div>
        </div>;
    }
}

export default Search;

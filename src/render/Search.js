import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';


const getSuggestions = (suggestions, filters, value) => {
    const inputValue = value.trim().toLowerCase();

    // Allow max 5 filters applied
    if (filters.length >= 5) {
        return [];
    }

    return suggestions
        // Filter out Artist section if there is already an Artist filter
        .filter(section =>
            section.title !== 'Artist' || !filters.find(filter => filter.type === 'Artist')
        )
        // Return suggestions matching the input and not contained in filters
        .map(section => {
            return {
                title: section.title,
                suggestions: section.suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(inputValue) &&
                    !isSuggestionContainedInFilters(filters, section.title, suggestion)
                )
            };
        })
        // Filter out sections with 0 suggestions
        .filter(section => section.suggestions.length > 0);
};

const isSuggestionContainedInFilters = (filters, sectionTitle, suggestion) => {
    return filters.find(filter =>
        filter.type === sectionTitle &&
        filter.value.toLowerCase() === suggestion.toLowerCase()
    );
};

const getSuggestionValue = suggestion => suggestion;

const renderSectionTitle = section => <strong>{section.title}</strong>;

const getSectionSuggestions = section => section.suggestions;

const renderSuggestion = suggestion => suggestion;

const shouldRenderSuggestions = () => true;

const theme = {
    input: 'input control',
    suggestion: 'suggestion',
    suggestionHighlighted: 'suggestion-highlighted',
    suggestionsContainerOpen: 'suggestion-container-open',
    sectionTitle: 'section-title'
    // suggestionsList: 'menu-list'
};

const handleMouseEnter = () => {
    // Disable main scroll when mouse enters suggestion component
    Array.from(document.getElementsByTagName('html'))
        .forEach(elem => elem.style.overflow = "hidden");
};

const handleMouseLeave = () => {
    // Enable main scroll when mouse leaves suggestion component
    Array.from(document.getElementsByTagName('html'))
        .forEach(elem => elem.style.overflow = "auto");
};

class Search extends Component {
    constructor(props) {
        super();
        this.state = {
            filters: [],
            showableSuggestions: [...props.suggestions], // TODO Solve reference issue
            value: ''
        };
    }

    onSuggestionsFetchRequested({ value }) {
        this.setState({
            showableSuggestions: getSuggestions(this.props.suggestions, this.state.filters, value)
        });
    }

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }

    onSuggestionSelected(event, { suggestionValue, sectionIndex }) {
        const sectionTitle = this.state.showableSuggestions[sectionIndex].title;
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
        const { filters, showableSuggestions, value } = this.state;
        
        const inputProps = {
            placeholder: 'Search',
            value,
            onChange: (event, { newValue }) => this.setState({ value: newValue })
        };

        return <div className="field is-grouped is-grouped-multiline" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Autosuggest
                suggestions={showableSuggestions}
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

                shouldRenderSuggestions={shouldRenderSuggestions}
            />
            {this.renderFilters(filters)}
        </div>;
    }

    renderFilters(filters) {
        return <div className="lick-filters field is-grouped is-grouped-multiline">
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

Search.propTypes = {
    // filters: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         type: PropTypes.oneOf(['Artist', 'Tag']).isRequired, // TODO Extract to constants
    //         value: PropTypes.string.isRequired,
    //     })
    // ).isRequired,
    suggestions: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.oneOf(['Artist', 'Tag']).isRequired,
            suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
    // value: PropTypes.string.isRequired
};

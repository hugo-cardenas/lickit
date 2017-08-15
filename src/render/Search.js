import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { TYPE_ARTIST, TYPE_TAG } from '../search/filterTypes';

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
};

const getSuggestions = (suggestions, value) => {
    const inputValue = value.trim().toLowerCase();

    return suggestions
        // Return suggestions matching the input and not contained in filters
        .map(section => {
            return {
                title: section.title,
                suggestions: section.suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(inputValue)
                )
            };
        })
        // Filter out sections with 0 suggestions
        .filter(section => section.suggestions.length > 0);
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
        super(props);
        this.state = { showableSuggestions: this.props.suggestions };
    }

    onSuggestionsFetchRequested({ value }) {
        this.setState({
            showableSuggestions: getSuggestions(this.props.suggestions, value)
        });
    }

    onSuggestionsClearRequested() {
        this.setState({
            showableSuggestions: []
        });
    }

    onSuggestionSelected(event, { suggestionValue, sectionIndex }) {
        const type = this.state.showableSuggestions[sectionIndex].title;
        this.props.addFilter({ type, value: suggestionValue });
        this.props.setInput('');
    }

    removeFilter(filter) {
        this.props.removeFilter(filter);
    }

    render() {
        const {
            filters,
            input,
            setInput
        } = this.props;

        const showableSuggestions = this.state.showableSuggestions;

        const inputProps = {
            placeholder: 'Search',
            value: input,
            onChange: (event, { newValue }) => setInput(newValue)
        };

        const autoSuggestProps = {
            focusInputOnSuggestionClick: false,
            getSectionSuggestions,
            getSuggestionValue,
            inputProps,
            multiSection: true,
            onSuggestionSelected: this.onSuggestionSelected.bind(this),
            onSuggestionsClearRequested: this.onSuggestionsClearRequested.bind(this),
            onSuggestionsFetchRequested: this.onSuggestionsFetchRequested.bind(this),
            renderSectionTitle,
            renderSuggestion,
            shouldRenderSuggestions,
            suggestions: showableSuggestions,
            theme
        };

        return <div className="field is-grouped is-grouped-multiline" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <Autosuggest {...autoSuggestProps}/>
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
    filters: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([TYPE_ARTIST, TYPE_TAG]).isRequired,
            value: PropTypes.string.isRequired,
        })
    ).isRequired,
    input: PropTypes.string.isRequired,
    suggestions: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.oneOf([TYPE_ARTIST, TYPE_TAG]).isRequired,
            suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
    addFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    setInput: PropTypes.func.isRequired,
};

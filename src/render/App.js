import React from 'react';
import Lick from './Lick/Lick';
import LickForm from './Lick/LickForm';
import Search from './Search/Search';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

const App = props => {
    const { error, lick, search } = props;
    const {
        isCreateFormEnabled,
        licks,
        enableCreateLickForm,
        cancelCreateLickForm,
        createLick,
        saveLick,
        deleteLick,
        changeLickMode
    } = lick;

    if (error instanceof Error) {
        // TODO Use sweetalert
        alert(`Error: ${error.message}\n${error.stack}`);
    }

    const enableCreateLick = () => {
        window.scrollTo(0, 0);
        enableCreateLickForm();
    };

    return (
        <div className="main-container">
            {renderTopContainer()}
            {renderControlsContainer(enableCreateLick, search)}
            <div className="main-content">
                <div className="lick-list">
                    {isCreateFormEnabled
                        ? renderCreateLickForm(createLick, cancelCreateLickForm)
                        : ''}
                    {licks.map(lick =>
                        renderLick(lick, deleteLick, saveLick, changeLickMode)
                    )}
                </div>
            </div>
        </div>
    );
};

const renderCreateLickForm = (createLick, cancelCreateLickForm) => {
    const lick = {
        artist: '',
        description: '',
        tracks: [],
        tags: []
    };
    const props = {
        lick,
        saveLick: lick => createLick(lick),
        cancelLickEditor: () => cancelCreateLickForm()
    };
    return <LickForm {...props} />;
};

const renderTopContainer = () => <div id="top-container">{renderNav()}</div>;

const renderControlsContainer = (enableLickCreateForm, search) => (
    <div id="controls-container">
        {renderLickControls(enableLickCreateForm, search)}
    </div>
);

const renderNav = () => (
    <nav>
        <div className="field has-addons is-small">
            <p className="control">
                <a className="button is-small is-primary is-active">
                    <span className="icon is-small">
                        <i className="fa fa-music" />
                    </span>
                    <span>Licks</span>
                </a>
            </p>
            <p className="control" data-tip="Feature not yet available">
                <a className="button is-small" disabled>
                    <span className="icon is-small">
                        <i className="fa fa-book" />
                    </span>
                    <span>Routine</span>
                </a>
            </p>
        </div>
        <ReactTooltip effect="solid" place="bottom" />
    </nav>
);

const renderLickControls = (enableLickCreateForm, search) => (
    <div id="lick-controls">
        {renderCreateLickButton(enableLickCreateForm)}
        <Search {...search} />
    </div>
);

const renderCreateLickButton = enableLickCreateForm => (
    <a
        id="button-lick-create"
        className="level-item button is-small"
        onClick={enableLickCreateForm}>
        <span className="icon is-small">
            <i className="fa fa-plus" />
        </span>
        <span>Add lick</span>
    </a>
);

const renderLick = (lick, deleteLick, saveLick, changeLickMode) => (
    <Lick
        key={lick.id}
        lick={lick}
        deleteLick={deleteLick}
        saveLick={saveLick}
        changeLickMode={changeLickMode}
    />
);

export default App;

App.propTypes = {
    error: PropTypes.object,
    lick: PropTypes.shape({
        isCreationOpen: PropTypes.bool.isRequired,
        licks: PropTypes.arrayOf(PropTypes.object).isRequired,
        enableCreateLickForm: PropTypes.func.isRequired,
        cancelCreateLickForm: PropTypes.func.isRequired,
        createLick: PropTypes.func.isRequired,
        saveLick: PropTypes.func.isRequired,
        deleteLick: PropTypes.func.isRequired,
        changeLickMode: PropTypes.func.isRequired
    }).isRequired,
    search: PropTypes.object.isRequired
};

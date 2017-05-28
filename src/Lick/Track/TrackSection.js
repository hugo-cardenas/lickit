import React, {Component} from 'react';
import './TrackSection.css';
import TrackSectionForm from './TrackSectionForm';
import TrackSectionView from './TrackSectionView';

class TrackSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordState: 'stopped'
        };
    }

    render() {
        const {mode} = this.props;
        const props = {
            ...this.props,
            handleRecordStart: () => this.setState({recordState: 'started'}),
            handleRecordStop: () => this.setState({recordState: 'stopped'})
        }

        switch (mode) {
            case 'edit':
                return <TrackSectionForm {...props}/>;
            case 'view':
            default:
                return <TrackSectionView {...props}/>;
        }
    }
}

export default TrackSection;
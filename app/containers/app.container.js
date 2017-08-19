'use strict';

// electron
import { ipcRenderer as ipc } from 'electron';

// react vendor
import React from 'react';
import request from 'request';
import { Icon, Image, Menu } from 'semantic-ui-react';
import Slider from 'rc-slider';

// components
import { PlaybackState } from '../constants.js';
import PlayerControl from '../components/player/player-control.js';
import Search from '../components/search.js';
import NavItem from '../components/nav-item.js';
import AudioPlayer from '../models/audio-player.js';

// views
import Discover from '../components/views/discover-view.js';
import Settings from '../components/views/settings-view.js';
import Subscriptions from '../components/views/subscriptions-view.js';

class AppContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: null,
            trackUrl: null,
            title: '---',
            podName: '---',
            description: '',
            date: 0,
            duration: 0,
            filesize: 0,
            currentTime: 0,
            playbackState: PlaybackState.stopped,
            searchResults: [],
            subscriptions: [],
            settingsGlobal: {},
            settingsPerPodcast: {},
            volume: 100,
            volumeChanging: false,
            timeChanging: false,
            view: 'subscriptions'
        };

        this.onVolumeChange = this.onVolumeChange.bind(this);
        this.onVolumeBeforeChange = this.onVolumeBeforeChange.bind(this);
        this.onVolumeAfterChange = this.onVolumeAfterChange.bind(this);
        this.onScrub = this.onScrub.bind(this);
        this.onBeforeScrub = this.onBeforeScrub.bind(this);
        this.onAfterScrub = this.onAfterScrub.bind(this);
        this.togglePlaystate = this.togglePlaystate.bind(this);
        this.showView = this.showView.bind(this);
        this.changeView = this.changeView.bind(this);
        this.execSearch = this.execSearch.bind(this);

        this.player = new AudioPlayer();
        this.startUpdater = this.startUpdater.bind(this);
    }

    componentDidMount() {
        this.startUpdater();

        ipc.on('ipc.get.subscriptions.result', (event, results) => {
            console.log(results);
        });

        ipc.on('ipc.search.result', (event, results) => {
            console.log(results);
            // TODO handle error
            if (results.results) {
                this.setState({ searchResults: results.results });
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.updaterInterval);
    }

    startUpdater() {
        this.updaterInterval = setInterval(() => {
            if (!this.state.volumeChanging) {
                this.setState({ volume: this.player.volume });
            }

            if (!this.state.timeChanging) {
                this.setState({ currentTime: this.player.currentTime });
            }

            let d = this.player.duration;
            if (this.state.duration !== d) {
                this.setState({ duration: d });
            }

            this.setState({
                playbackState: this.player.playing ? PlaybackState.playing : PlaybackState.paused
            });
        }, 1000);
    }

    // TODO: remove
    TEST_LOAD_URL() {
        //this.setState({
        //    trackUrl: examplePodcast.url,
        //    imageUrl: examplePodcast.logo_url,
        //    title: 'Trumpcast Episode',
        //    podName: 'Trumpcast',
        //    description: ' Lorem ipsum dolor sit amet, felis quis luctus, mauris tempor varius sit nulla, eu justo, suspendisse leo lobortis accumsan, iaculis dictum amet nunc condimentum parturient. Euismod eu etiam, elit donec in quam accumsan. Pharetra eros eu sed non iaculis volutpat, tristique wisi nec natoque facilisis, quisque nisl pulvinar. Sed sem lorem lacus, ac consectetuer, ac tellus eu mauris mus sollicitudin volutpat, venenatis tortor ligula orci arcu eget. Lorem eu, dui et, sapien vel eget habitasse mattis sapien. Scelerisque neque eu at eu sapien facilisis, maecenas commodo lectus donec nonummy elementum.Amet habitant integer ac, proin a aliquam tincidunt convallis ornare massa. Amet ridiculus arcu cras integer lacus. Elementum mauris pulvinar lectus, consequat imperdiet aenean purus rhoncus lorem id. Eget ac, est ad vel. Turpis tincidunt integer scelerisque lectus, auctor integer praesent ut nec aenean, neque nisl feugiat.',
        //    duration: 7231,
        //    currentTime: 2221
        //});
        //this.player.open('file:///home/tsned/Music/AFI/above-the-bridge.mp3', () => {
        //    this.player.play();
        //});
        ipc.send('ipc.get.subscriptions');
        ipc.send('ipc.search', 'lovett');
    }

    onBeforeScrub() {
        this.setState({ timeChanging: true });
    }

    onScrub(val) {
        this.player.currentTime = val;
        this.setState({ currentTime: val });
    }

    onAfterScrub() {
        this.setState({ timeChanging: false });
    }

    onVolumeBeforeChange() {
        this.setState({ volumeChanging: true });
    }

    onVolumeChange(val) {
        this.player.volume = val;
        this.setState({ volume: val });
    }

    onVolumeAfterChange() {
        this.setState({ volumeChanging: false });
    }

    togglePlaystate() {
        if (this.state.playbackState === PlaybackState.playing) {
            this.player.pause();
            this.setState({ playbackState: PlaybackState.paused });
        } else {
            this.player.play();
            this.setState({ playbackState: PlaybackState.playing });
        }
    }

    execSearch(term) {
        ipc.send('ipc.search', term);
    }

    showView() {
        switch(this.state.view) {
            case 'subscriptions':
                return <Subscriptions test={this.TEST_LOAD_URL.bind(this)} />;
            case 'settings':
                return <Settings />;
            case 'discover':
                return <Discover onExecSearch={this.execSearch} results={this.state.searchResults} />;
        }
    }

    changeView(view) {
        this.setState({ view: view, searchResults: [] });
    }

    render() {
        return (
            <div>
                <Menu fixed="left" vertical inverted id="nav-bar" defaultActiveIndex={0}>
                    <Menu.Item>
                        <PlayerControl
                            art={this.state.imageUrl}
                            track={this.state.trackUrl}
                            podName={this.state.podName}
                            duration={this.state.duration}
                            currentTime={this.state.currentTime}
                            description={this.state.description}
                            volume={this.state.volume}
                            onScrub={{
                                before: this.onBeforeScrub,
                                change: this.onScrub,
                                after: this.onAfterScrub
                            }}
                            onVolume={{
                                before: this.onVolumeBeforeChange,
                                change: this.onVolumeChange,
                                after: this.onVolumeAfterChange
                            }}
                            state={this.state.playbackState}
                            title={this.state.title}
                            togglePlaystate={this.togglePlaystate} />
                    </Menu.Item>
                    <NavItem name="check" title="Subscriptions" click={this.changeView.bind(this, 'subscriptions')} active={this.state.view === 'subscriptions'} />
                    <NavItem name="search" title="Discover" click={this.changeView.bind(this, 'discover')} active={this.state.view === 'discover'} />
                    <NavItem name="settings" title="Settings" click={this.changeView.bind(this, 'settings')} active={this.state.view === 'settings'} />
                </Menu>
                <div id="route-view">
                    {this.showView()}
                </div>
            </div>
        );
    }
}

export default AppContainer;

'use strict';

import React from 'react';
import Slider from 'rc-slider';
import { PlaybackState } from '../../constants.js';
import { Icon, Popup, Reveal } from 'semantic-ui-react';
import ReactImageFallback from 'react-image-fallback';
import moment from 'moment';

export default class PlayerControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showDescription: false };
        this.formatTime = this.formatTime.bind(this);
        this.formatRemaining = this.formatRemaining.bind(this);
        this.maxTime = this.maxTime.bind(this);
    }

    formatTime() {
        let t = this.props.currentTime;
        if (!isNaN(t)) {
            return moment
                .utc(moment.duration(t, 's').asMilliseconds())
                .format('H:mm:ss')
                .replace(/^0:/, '');
        } else {
            return '00:00';
        }
    }

    formatRemaining() {
        let t = this.props.currentTime;
        let d = this.props.duration;
        if (!isNaN(t) && !isNaN(d)) {
            return moment
                .utc(moment.duration(d - t, 's').asMilliseconds())
                .format('-H:mm:ss')
                .replace(/^-0:/, '-');
        } else {
            return '-00:00';
        }
    }

    maxTime() {
        let d = this.props.duration;
        return (!isNaN(d)) ? d : 0;
    }

    currTime() {
        let t = this.props.currentTime;
        return (!isNaN(t)) ? t : 0;
    }

    setVol(val) {
        this.props.onVolume.change(val);
    }

    jump(val) {
        this.props.onScrub.change(this.props.currentTime + val);
    }

    render() {
        const icon = this.props.state === PlaybackState.playing ? 'pause' : 'play';
        const backward = this.jump.bind(this, -30);
        const forward = this.jump.bind(this, 30);
        const toggle = this.props.togglePlaystate;
        return (
            <div className="player-container">
                <Reveal animated="move up" instant disabled={!this.props.track}>
                    <Reveal.Content hidden>
                        <div id="control-wrapper">
                            <div id="control-container">
                                <Popup
                                    inverted wide
                                    trigger={<Icon size="large" name="info circle" id="info-icon" />}
                                    className="description-popup">
                                    {this.props.description || 'No description'}
                                </Popup>
                                <div id="controls">
                                    <Icon link size="big" name="backward" onClick={backward} />
                                    <Icon link size="huge" name={icon} onClick={toggle} />
                                    <Icon link size="big" name="forward" onClick={forward} />
                                </div>
                                <span>{this.props.podName}</span>
                            </div>
                        </div>
                    </Reveal.Content>
                    <Reveal.Content visible id="playing-art-reveal-container">
                        <ReactImageFallback
                            className="playing-art"
                            src={this.props.art}
                            fallbackImage="not-found.png" />
                    </Reveal.Content>
                </Reveal>
                <Slider
                    onBeforeChange={this.props.onScrub.before}
                    onChange={this.props.onScrub.change}
                    onAfterChange={this.props.onScrub.after}
                    className="track-slider"
                    min={0}
                    max={this.maxTime()}
                    value={this.currTime()} />

                <div className="track-time">
                    <span>{this.formatTime()}</span>
                    <span>{this.formatRemaining()}</span>
                </div>
                <span className="track-title">{this.props.title}</span>

                <div className="volume-container">
                    <Icon link name="volume off" onClick={this.setVol.bind(this, 0)} />
                    <Slider
                        onBeforeChange={this.props.onVolume.before}
                        onChange={this.props.onVolume.change}
                        onAfterChange={this.props.onVolume.after}
                        className="volume-slider"
                        value={this.props.volume} />
                    <Icon link name="volume up" onClick={this.setVol.bind(this, 100)} />
                </div>
            </div>
        );
    }
}

var topPods = [{
    "website": "http://www.thisamericanlife.org",
    "title": "This American Life",
    "subscribers_last_week": 3212,
    "logo_url": "http://www.thisamericanlife.org/sites/all/themes/thislife/images/logo-square-1400.jpg",
    "subscribers": 3212,
    "mygpo_link": "http://gpodder.net/podcast/this-american-life",
    "url": "http://feeds.thisamericanlife.org/talpodcast",
    "scaled_logo_url": "http://gpodder.net/logo/64/1b1/1b153fd666f8d73a4a470246ade8620513b47da6",
    "description": "here"
}, {
    "website": "https://twit.tv/shows/floss-weekly",
    "title": "FLOSS Weekly (MP3)",
    "subscribers_last_week": 2613,
    "logo_url": "https://elroycdn.twit.tv/sites/default/files/styles/twit_album_art_2048x2048/public/images/shows/floss_weekly/album_art/audio/floss1400audio.jpg?itok=bQyTXyOk",
    "subscribers": 2613,
    "mygpo_link": "http://gpodder.net/podcast/floss-weekly-mp3",
    "url": "http://leo.am/podcasts/floss",
    "scaled_logo_url": "http://gpodder.net/logo/64/f9a/f9a539445fb5f0c76f3d2ce4daf4f38abb841324",
    "description": "here"
}, {
    "website": "http://twit.tv/twit",
    "title": "This Week in Tech (MP3)",
    "subscribers_last_week": 2105,
    "logo_url": "http://twit.cachefly.net/coverart/twit/twit1400audio.jpg",
    "subscribers": 2105,
    "mygpo_link": "http://gpodder.net/podcast/this-week-in-tech-mp3-edition-2",
    "url": "http://leo.am/podcasts/twit",
    "scaled_logo_url": "http://gpodder.net/logo/64/89c/89c32b2a38eb1012c4e1b11a45866cfcf5efa80f",
    "description": "here"
}, {
    "website": "http://twit.tv/sn",
    "title": "Security Now (MP3)",
    "subscribers_last_week": 1816,
    "logo_url": "http://twit.cachefly.net/coverart/sn/sn1400audio.jpg",
    "subscribers": 1816,
    "mygpo_link": "http://gpodder.net/podcast/security-now-7",
    "url": "http://leo.am/podcasts/sn",
    "scaled_logo_url": "http://gpodder.net/logo/64/503/503f6d689fa06e8c63b4ea98187c0ce79e514feb",
    "description": "here"
}];



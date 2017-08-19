'use strict';

import { PlaybackState } from '../constants.js';

const AppAudioContext = (window.AudioContext || window.webkitAudioContext);

export default class AudioPlayer {
    constructor() {
        this.audioContext = new AppAudioContext();
        this.audio = null;
        this.isPlaying = false;

        this.srcNode = null;

        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = 1.0;
        this.gainNode.connect(this.audioContext.destination);

        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 64;
        this.analyserNode.connect(this.gainNode);
    }

    get duration () {
        return this.audio ? this.audio.duration : 0;
    }

    get currentTime() {
        return this.audio ? this.audio.currentTime : 0;
    }

    set currentTime(value) {
        if (value === undefined || !this.audio) return;
        const currentTime = Number(value);
        if (currentTime < 0 || this.duration < currentTime) return;
        this.audio.currentTime = currentTime;
    }

    get spectrums() {
        if (!(this.srcNode && this.isPlaying)) return null;
        const spectrums = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.analyserNode.getByteFrequencyData(spectrums);
        return spectrums;
    }

    get volume() {
        return this.gainNode.gain.value * 100;
    }

    set volume(value) {
        if (value >= 0 && value <= 100) {
            this.gainNode.gain.value = value / 100.0;
        }
    }

    get playing() {
        if (this.audio && this.audio.ended) {
            this.isPlaying = false;
        }
        return this.isPlaying;
    }


    close() {
        this.stop();
        this.audio = null;
        this.srcNode = null;
    }

    open(uri, cb) {
        this.close();

        this.audio = new window.Audio(uri);
        this.audio.addEventListener('loadstart', () => {
            this.srcNode = this.audioContext.createMediaElementSource(this.audio);
            this.srcNode.connect(this.analyserNode);
            cb();
        });
    }

    play() {
        if (!this.audio || this.isPlaying) return;
        this.audio.play();
        this.isPlaying = true;
    }

    pause() {
        if(!(this.audio && this.isPlaying)) return;
        this.audio.pause();
        this.isPlaying = false;
    }

    stop() {
        if(!(this.srcNode && this.isPlaying)) return;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    }
}

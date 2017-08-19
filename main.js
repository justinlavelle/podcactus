'use strict';

const fs = require('fs');
const { app, BrowserWindow, ipcMain, Menu, MenuItem, session } = require('electron');
const request = require('request');
const feedParser = require('node-podcast-parser');
const path = require('path');
const Datastore = new require('nedb');

require('electron-reload')(path.join(__dirname, 'public'));

let mainWindow;
let settings = {};

const defaultSettings = {
    proxyEnabled: false,
    proxyRules: [],
    perPodcastSettings: {}
};

let db = new Datastore({ filename: path.join(app.getPath('userData'), 'db.db'), autoload: true });

function buildProxyRulesString (arr) {
    // TODO validation
    return arr.map(i => `${i.protocol}=${i.host}:${i.port}`).join(';');
}

function loadSettinngs () {
    let file = path.join(app.getPath('userData'), 'settings.json');
    let settings = Object.assign({}, defaultSettings);
    try {
        let s = fs.readFileSync(file);
        Object.assign(settings, JSON.parse(s));
    } catch (e) {
        try {
            fs.writeFileSync(file, JSON.stringify(settings));
        } catch (e) {
            console.error('Could not write default settings', e);
        }
    }

    return settings;
}

function createWindow () {
    const browserOptions = {
        width: 1000,
        height: 618,
        minWidth: 500,
        minHeight: 500,
        icon: path.join(__dirname, 'icon.png')
    };

    mainWindow = new BrowserWindow(browserOptions);

    mainWindow.loadURL('file://' + path.join(__dirname, 'public', 'index.html'));

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    // TODO remove
    // create faux menu for debugging
    const menu = new Menu();
    //noinspection JSUnresolvedFunction
    menu.append(new MenuItem({
        label: 'debug',
        accelerator: 'F12',
        click: () => mainWindow.webContents.toggleDevTools()
    }));
    menu.append(new MenuItem({
        label: 'reload',
        accelerator: 'F5',
        click: () => mainWindow.reload()
    }));
    mainWindow.setMenu(menu);
    // TODO
    //mainWindow.setMenu(null);
}

settings = loadSettinngs();

ipcMain.on('parse-feed', (event, url) => {
    request(url, (err, res, data) => {
        if (err) {
            console.error(err);
            return;
        }
        feedParser(data, (err, data) => {
            let d = Object.assign({}, data);
            d.episodes = [d.episodes[0]];
            console.log(JSON.stringify(d, null, 4));
        });
    });
});

app.on('ready', () => {
    if (settings.proxyEnabled && settings.proxyRules.length) {
        //noinspection JSCheckFunctionSignatures
        session.defaultSession.setProxy({ proxyRules: buildProxyRulesString(settings.proxyRules) }, () => {
            createWindow();
        });
    } else {
        createWindow();
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

let examplePodcast = {
    "id": "abcdefg",
    "website": "http://www.thisamericanlife.org",
    "title": "This American Life",
    "subscribers_last_week": 3212,
    "logo_url": "http://www.thisamericanlife.org/sites/all/themes/thislife/images/logo-square-1400.jpg",
    "subscribers": 3212,
    "mygpo_link": "http://gpodder.net/podcast/this-american-life",
    "url": "http://feeds.thisamericanlife.org/talpodcast",
    "scaled_logo_url": "http://gpodder.net/logo/64/1b1/1b153fd666f8d73a4a470246ade8620513b47da6",
    "description": "here"
};

ipcMain.on('ipc.subscribe', (event, feedObj) => {
    // TODO
});

ipcMain.on('ipc.unsubscribe', (event, feedKeyVal) => {
    // TODO
});

ipcMain.on('ipc.parse.feed', (event, feedObj) => {
    // TODO
});

ipcMain.on('ipc.search', (event, term) => {
    request(`http://gpodder.net/search.json?q=${encodeURIComponent(term)}`, (err, res, data) => {
        let result = {};
        if (err) {
            result.error = err;
        } else {
            try {
                result.results = JSON.parse(data);
            } catch (e) {
                result.error = new TypeError('Could not parse JSON response');
            }
        }
        //noinspection JSUnresolvedFunction
        event.sender.send('ipc.search.result', result);
    });
});

ipcMain.on('ipc.get.subscriptions', (event) => {
    db.find({}).sort({ title: 1 }).exec((err, docs) => {
        let result = {};
        err ? (result.error = err) : (result.results = docs);
        //noinspection JSUnresolvedFunction
        event.sender.send('ipc.get.subscriptions.result', result);
    });
});

ipcMain.on('ipc.get.toplist', (event) => {
    request('http://gpodder.net/toplist/100.json', (err, res, data) => {
        if (err) {
            //noinspection JSUnresolvedFunction
            event.sender.send('ipc.get.toplist.result', { error: err });
        } else {
            feedParser(data, (err, data) => {
                if (err) {
                    //noinspection JSUnresolvedFunction
                    event.sender.send('ipc.get.toplist.result', { error: err });
                } else {
                    //noinspection JSUnresolvedFunction
                    event.sender.send('ipc.get.toplist.result', { results: data });
                }
            });
        }
    });
});


// TODO: 'about' page: credit for app icon

//request.get('https://gpodder.net/toplist/100.json', (err, res, body) => {
//    if (!err) {
//        let d = JSON.parse(body);
//        console.log(JSON.stringify(d, null, 2));
//    } else {
//        console.error(err);
//    }
//});

// TODO
//request.get('http://feeds.feedburner.com/SlatesTrumpcast', (err, res, body) => {
//    if (err) {
//        console.error(err);
//        return;
//    }
//
//    feedParser(body, (err, data) => {
//        let d = Object.assign({}, data);
//        d.episodes = [d.episodes[0]];
//        console.log(JSON.stringify(d, null, 2));
//    });
//});

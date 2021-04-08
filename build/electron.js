'use strict';

var os = require('os');
var cp = require('child_process');
var util = require('util');
var $ = require('cheerio');
var electron = require('electron');
var path = require('path');
var wallpaper = require('wallpaper');
var fs = require('fs');
var crypto = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var cp__default = /*#__PURE__*/_interopDefaultLegacy(cp);
var $__default = /*#__PURE__*/_interopDefaultLegacy($);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var wallpaper__default = /*#__PURE__*/_interopDefaultLegacy(wallpaper);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

const exec = util.promisify(cp__default['default'].exec);
// Node's request lib is failing to parse the headers for met requests :|
// So for now we're just going to curl them.
const fetch = async (input, opts = {}) => {
    // Windows curl doesn't currently support --compressed :|
    const cmd = `curl ${os__default['default'].platform() === 'win32' ? '' : '--compressed'}`;
    const headersCmd = opts.headers === undefined ? '' : `-H "${opts.headers}"`;
    const output = opts.output ? `--output "${opts.output}"` : '';
    const fullCmd = `${cmd} ${headersCmd} "${input}" ${output}`;
    const { stdout, stderr } = await exec(fullCmd);
    return stdout;
};
const fetchJSON = async (input, opts = {}) => {
    opts.headers = `${opts.headers || ''} -H "Content-Type: application/json" -H "Accept: application/json"`;
    const stdout = await fetch(input, opts);
    return JSON.parse(stdout);
};
globalThis.$ = $__default['default'];
globalThis.fetch = fetch;
globalThis.fetchJSON = fetchJSON;

const APP_VERSION = require(path.resolve('./package.json')).version;
const URLS = {
    website: 'https://galeri.io',
    github: 'https://github.com/michealparks/galeri',
    githubRaw: 'https://raw.githubusercontent.com/michealparks/galeri-www/master',
    githubReleaseAPI: 'https://api.github.com/repos/michealparks/galeri-www/releases/latest',
    feedUrl: 'https://raw.githubusercontent.com/michealparks/galeri-www/master/updater.json',
    feedUrlWindows: 'https://github.com/michealparks/galeri/releases/download',
    issues: 'https://github.com/michealparks/galeri-www/issues'
};

electron.autoUpdater.on('update-downloaded', () => {
    electron.autoUpdater.quitAndInstall();
});
const parseTag = (tag = '') => {
    return (tag.startsWith('v')
        ? tag.slice(1)
        : tag).split('.').map((v) => parseInt(v, 10));
};
const newVersionExists = (tag) => {
    for (const [i, curVersion] of parseTag(APP_VERSION).entries()) {
        if (curVersion > tag[i])
            return false;
    }
    return true;
};
const init$2 = async () => {
    const latestTag = await globalThis.fetchJSON(URLS.githubReleaseAPI, {
        headers: 'User-Agent: galeri'
    });
    const tag = parseTag(latestTag.tag_name);
    if (newVersionExists(tag)) {
        electron.autoUpdater.setFeedURL({
            url: os__default['default'].platform() === 'win32'
                ? `${URLS.feedUrlWindows}/${latestTag.tag_name}`
                : URLS.feedUrl
        });
        electron.autoUpdater.checkForUpdates();
    }
    setTimeout(init$2, 1000 * 60 * 60);
};
init$2();

const data = new Map();
const subscribers = new Map();
const globalSubscribers = new Set();
const set = (key, value) => {
    data.set(key, value);
    for (const fn of subscribers.get(key) || new Set()) {
        fn(value);
    }
    for (const fn of globalSubscribers) {
        fn(key, value);
    }
};
const get$1 = (key) => {
    return data.get(key);
};
const subscribe = (key, fn) => {
    if (subscribers.has(key) === false) {
        subscribers.set(key, new Set());
    }
    subscribers.get(key)?.add(fn);
};
const subscribeAll = (fn) => {
    globalSubscribers.add(fn);
};
const store = {
    data,
    get: get$1,
    set,
    subscribe,
    subscribeAll
};

const API_KEYS = [
    'wikipedia',
    'met',
    'rijks'
];
const ENDPOINTS = {
    metCollection: 'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11|21',
    metObject: 'https://collectionapi.metmuseum.org/public/collection/v1/objects',
    rijks: 'https://www.rijksmuseum.nl/api/en/collection?format=json&ps=30&imgonly=True&type=painting&key=1KfM6MpD',
    wikipedia: 'https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=Wikipedia:Featured_pictures/Artwork/Paintings&format=json&origin=*'
};

const randomArtwork$2 = async () => {
    const artworks = await getArtObjects();
    if (artworks.length === 0) {
        return;
    }
    return fetchRandomArtwork(artworks);
};
const getArtObjects = async () => {
    const artObjects = store.get('wikipedia') || [];
    if (artObjects.length > 0) {
        return artObjects;
    }
    else {
        let json;
        try {
            json = await globalThis.fetchJSON(ENDPOINTS.wikipedia);
        }
        catch {
            return [];
        }
        const artObjects = 'window' in globalThis
            ? parseBrowser(json.parse.text['*'])
            : parseNode(json.parse.text['*']);
        store.set('wikipedia', artObjects);
        return artObjects;
    }
};
const parseBrowser = (str) => {
    const artworks = [];
    const dom = new DOMParser().parseFromString(str, 'text/html');
    for (const el of dom.querySelectorAll('.gallerybox')) {
        const imgEl = el.querySelector('img');
        const titleEl = el.querySelector('.gallerytext b');
        const titleLinkEl = el.querySelector('.gallerytext b a');
        const artistEl = [...el.querySelectorAll('.gallerytext a')].pop();
        const arr = imgEl?.src?.split('/')?.slice(0, -1);
        const src = arr?.join('/')?.replace('/thumb/', '/');
        const title = titleEl?.textContent?.trim();
        const artist = artistEl?.textContent?.trim();
        const artistLink = artistEl?.href;
        const titleLink = titleLinkEl?.href;
        if (src === undefined)
            continue;
        artworks.push({
            src: `https://upload.wikimedia.org${src.split('//upload.wikimedia.org').pop()}`,
            title,
            artist,
            artistLink,
            titleLink: titleLink ? `https://wikipedia.org/wiki${titleLink.split('/wiki').pop()}` : '',
            provider: 'Wikipedia',
            providerLink: 'https://wikipedia.org'
        });
    }
    return artworks;
};
const parseNode = (str) => {
    const { $ } = globalThis;
    const artworks = [];
    $('.gallerybox', str).each((_i, el) => {
        const imgEl = $('img', el);
        const titleEl = $('.gallerytext b', el);
        const titleLinkEl = $('.gallerytext b a', el);
        const artistEl = $('.gallerytext a', el)?.last();
        const arr = imgEl.attr('src')?.split('/')?.slice(0, -1);
        const src = arr?.join('/')?.replace('/thumb/', '/');
        const title = titleEl?.text()?.trim();
        const artist = artistEl?.text()?.trim();
        const artistLink = artistEl?.attr('href');
        const titleLink = titleLinkEl?.attr('href');
        if (src === undefined)
            return;
        artworks.push({
            src: `https://upload.wikimedia.org${src.split('//upload.wikimedia.org').pop()}`,
            title,
            artist,
            artistLink,
            titleLink: titleLink ? `https://wikipedia.org/wiki${titleLink.split('/wiki').pop()}` : '',
            provider: 'Wikipedia',
            providerLink: 'https://wikipedia.org'
        });
    });
    return artworks;
};
const fetchRandomArtwork = (artObjects) => {
    const randomIndex = Math.floor(Math.random() * artObjects.length);
    const [artObject] = (artObjects.splice(randomIndex, 1) || []);
    store.set('wikipedia', artObjects);
    return artObject;
};
const wikipedia = {
    randomArtwork: randomArtwork$2
};

const randomArtwork$1 = async () => {
    const artworks = await getArtworks$1();
    if (artworks.length === 0) {
        return;
    }
    return removeRandomArtwork$1(artworks);
};
const getArtworks$1 = async () => {
    const artworks = store.get('rijks');
    if (artworks.length > 0) {
        return artworks;
    }
    else {
        const page = store.get('rijksPage');
        let json;
        try {
            json = await globalThis.fetchJSON(`${ENDPOINTS.rijks}&p=${page}`);
        }
        catch {
            return [];
        }
        const artworks = [];
        for (const artObject of json.artObjects) {
            if (!artObject.webImage || !artObject.webImage.url) {
                continue;
            }
            artworks.push({
                src: artObject.webImage.url,
                title: artObject.title
                    ? artObject.title.trim()
                    : undefined,
                artist: artObject.principalOrFirstMaker
                    ? artObject.principalOrFirstMaker.trim()
                    : undefined,
                artistLink: undefined,
                provider: 'Rijksmuseum',
                titleLink: artObject.links.web,
                providerLink: 'https://www.rijksmuseum.nl/en'
            });
        }
        store.set('rijks', artworks);
        store.set('rijksPage', page + 1);
        return artworks;
    }
};
const removeRandomArtwork$1 = (artObjects) => {
    const randomIndex = Math.floor(Math.random() * artObjects.length);
    const [artObject] = (artObjects.splice(randomIndex, 1) || []);
    store.set('rijks', artObjects);
    return artObject;
};
const rijks = {
    randomArtwork: randomArtwork$1
};

const randomArtwork = async () => {
    const artObjects = await getArtworks();
    if (artObjects.length === 0) {
        return;
    }
    return removeRandomArtwork(artObjects);
};
const getArtworks = async () => {
    const artworks = store.get('met');
    if (artworks.length > 0) {
        return artworks;
    }
    else {
        let json;
        try {
            json = await globalThis.fetchJSON(ENDPOINTS.metCollection);
        }
        catch (err) {
            console.error(err);
            return [];
        }
        const artworks = json.objectIDs;
        store.set('met', artworks);
        return artworks;
    }
};
const removeRandomArtwork = async (artworks) => {
    const randomIndex = Math.floor(Math.random() * artworks.length);
    const [id] = (artworks.splice(randomIndex, 1) || []);
    let object;
    try {
        object = await globalThis.fetchJSON(`${ENDPOINTS.metObject}/${id}`);
    }
    catch (err) {
        console.error(err);
        return;
    }
    const { primaryImage = '', title, artistDisplayName, objectURL } = (object || {});
    if (primaryImage === '' || primaryImage === undefined) {
        return;
    }
    const artwork = {
        src: primaryImage,
        title: title,
        artist: artistDisplayName,
        artistLink: '',
        provider: 'The Metropolitan Museum of Art',
        titleLink: objectURL,
        providerLink: 'https://www.metmuseum.org'
    };
    store.set('met', artworks);
    return artwork;
};
const met = {
    randomArtwork
};

// A list of artworks deemed NSFW. This list is a quite moving selection,
// but people may not be able to appreciate the true extent of their beauty in an
// American corporate office setting.
// If a work is found to be delightful, yet very awkward in a non-progressive
// (or progressive, pending the definition of that word changing over time)
// environment, please add a PR for an addition here.
const blacklist = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pierre-Auguste_Renoir_-_Parisiennes_in_Algerian_Costume_or_Harem_-_Google_Art_Project.jpg/2000px-Pierre-Auguste_Renoir_-_Parisiennes_in_Algerian_Costume_or_Harem_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/John_William_Waterhouse_-_Echo_and_Narcissus_-_Google_Art_Project.jpg/2000px-John_William_Waterhouse_-_Echo_and_Narcissus_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Hugo_van_der_Goes_-_The_Fall_of_Man_and_The_Lamentation_-_Google_Art_Project.jpg/2000px-Hugo_van_der_Goes_-_The_Fall_of_Man_and_The_Lamentation_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Antonio_Allegri%2C_called_Correggio_-_Jupiter_and_Io_-_Google_Art_Project.jpg/2000px-Antonio_Allegri%2C_called_Correggio_-_Jupiter_and_Io_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg/2000px-Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Cornelis_Cornelisz._van_Haarlem_-_The_Fall_of_the_Titans_-_Google_Art_Project.jpg/2000px-Cornelis_Cornelisz._van_Haarlem_-_The_Fall_of_the_Titans_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Venus_Consoling_Love%2C_Fran%C3%A7ois_Boucher%2C_1751.jpg/2000px-Venus_Consoling_Love%2C_Fran%C3%A7ois_Boucher%2C_1751.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sarah_Goodridge_Beauty_Revealed_The_Metropolitan_Museum_of_Art.jpg/2000px-Sarah_Goodridge_Beauty_Revealed_The_Metropolitan_Museum_of_Art.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Piero_di_Cosimo_-_Portrait_de_femme_dit_de_Simonetta_Vespucci_-_Google_Art_Project.jpg/2000px-Piero_di_Cosimo_-_Portrait_de_femme_dit_de_Simonetta_Vespucci_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Paul_Chabas_September_Morn_The_Metropolitan_Museum_of_Art.jpg/2000px-Paul_Chabas_September_Morn_The_Metropolitan_Museum_of_Art.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Venus_Consoling_Love%2C_François_Boucher%2C_1751.jpg/2000px-Venus_Consoling_Love%2C_François_Boucher%2C_1751.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Giorgione_-_Sleeping_Venus_-_Google_Art_Project_2.jpg/2000px-Giorgione_-_Sleeping_Venus_-_Google_Art_Project_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Baudry_paul_the_wave_and_the_pearl.jpg/2000px-Baudry_paul_the_wave_and_the_pearl.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg/2000px-Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/RokebyVenus.jpg/2000px-RokebyVenus.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Goya_Maja_naga2.jpg/2000px-Goya_Maja_naga2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/William-Adolphe_Bouguereau_%281825-1905%29_-_The_Wave_%281896%29.jpg/2000px-William-Adolphe_Bouguereau_%281825-1905%29_-_The_Wave_%281896%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Fouquet_Madonna.jpg/2000px-Fouquet_Madonna.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg/2000px-Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pierre-Auguste_Renoir%2C_French_-_The_Large_Bathers_-_Google_Art_Project.jpg/2000px-Pierre-Auguste_Renoir%2C_French_-_The_Large_Bathers_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Peter_Paul_Rubens_-_The_Birth_of_the_Milky_Way%2C_1636-1637.jpg/2000px-Peter_Paul_Rubens_-_The_Birth_of_the_Milky_Way%2C_1636-1637.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Edvard_Munch_-_Madonna_-_Google_Art_Project.jpg/2000px-Edvard_Munch_-_Madonna_-_Google_Art_Project.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Feszty_Panorama.jpg/2000px-Feszty_Panorama.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/64/Titian_-_Venus_with_a_Mirror_-_Google_Art_Project.jpg'
];

const apiMap = new Map();
apiMap.set('rijks', rijks);
apiMap.set('wikipedia', wikipedia);
apiMap.set('met', met);
const get = async (forceNext = false) => {
    let current = store.get('current');
    let next = store.get('next');
    if (current === undefined || forceNext) {
        if (next === undefined) {
            current = await getArtwork();
        }
        else {
            current = next;
            next = undefined;
        }
    }
    store.set('current', current);
    if (next === undefined) {
        next = await getArtwork();
        store.set('next', next);
    }
    return current;
};
const disable = (apiName) => {
    API_KEYS.splice(API_KEYS.indexOf(apiName), 1);
};
const getRandom = () => {
    const key = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
    return apiMap.get(key)?.randomArtwork();
};
const getArtwork = async () => {
    const artwork = await getRandom();
    if (artwork === undefined) {
        return getArtwork();
    }
    if (blacklist.includes(decodeURI(artwork.src))) {
        return getArtwork();
    }
    return artwork;
};
const apis = {
    store,
    get,
    disable
};

const mkdir$1 = util.promisify(fs__default['default'].mkdir);
const unlink = util.promisify(fs__default['default'].unlink);
const filepath = (url) => {
    const hash = crypto__default['default']
        .createHash('md5')
        .update(url)
        .digest('base64')
        .replace(/\//g, '0')
        .replace('==', '2')
        .replace('=', '1');
    const appPath = electron.app.getPath('appData');
    const filename = `artwork_${hash}${path__default['default'].extname(url)}`;
    return path.resolve(`${appPath}`, 'Galeri', filename);
};
const download = async (url) => {
    const output = filepath(url);
    try {
        await mkdir$1(path.resolve(electron.app.getPath('appData'), 'Galeri'));
    }
    catch { }
    await globalThis.fetch(url, { output });
    return output;
};
const remove = async (filepath) => {
    try {
        return unlink(filepath);
    }
    catch {
        return;
    }
};
const image = {
    filepath,
    download,
    remove
};

let _tray;
let subscriber;
const menuTemplate = [
    {
        label: '',
        click: () => subscriber('artwork')
    }, {
        label: 'Next Artwork',
        type: 'normal',
        click: () => subscriber('next')
    }, {
        label: 'Add to favorites',
        type: 'normal',
        click: () => subscriber('favorite')
    }, {
        type: 'separator'
    }, {
        label: 'Options',
        submenu: [
            {
                label: 'Run On Startup',
                type: 'checkbox',
                checked: electron.app.getLoginItemSettings().openAtLogin,
                click: () => electron.app.setLoginItemSettings({
                    openAtLogin: !electron.app.getLoginItemSettings().openAtLogin
                })
            },
        ]
    }, {
        type: 'separator'
    }, {
        label: 'Favorites',
        type: 'normal',
        click: () => subscriber('favorites')
    }, {
        label: 'About',
        role: 'help',
        type: 'normal',
        click: () => subscriber('about')
    }, {
        label: 'Quit',
        role: 'quit',
        type: 'normal',
        click: () => subscriber('quit')
    }
];
const onEvent = (fn) => {
    subscriber = fn;
};
const setArtwork = ({ title = '' }) => {
    menuTemplate[0].label = title;
    _tray.setContextMenu(electron.Menu.buildFromTemplate(menuTemplate));
};
const init$1 = () => {
    _tray = new electron.Tray('./assets/icon-dark_32x32.png');
    _tray.setContextMenu(electron.Menu.buildFromTemplate(menuTemplate));
    return { onEvent };
};
const tray = {
    init: init$1,
    setArtwork
};

const writeFile = util.promisify(fs__default['default'].writeFile);
const readFile = util.promisify(fs__default['default'].readFile);
const mkdir = util.promisify(fs__default['default'].mkdir);
store.subscribeAll(async (key, value) => {
    const filename = `${key}.json`;
    const appPath = electron.app.getPath('appData');
    const filepath = path.resolve(`${appPath}`, 'Galeri', filename);
    await writeFile(filepath, JSON.stringify(value));
});
const init = async () => {
    const appPath = electron.app.getPath('appData');
    try {
        await mkdir(path.resolve(appPath, 'Galeri'));
    }
    catch { }
    for (const api of API_KEYS) {
        try {
            const filepath = path.resolve(`${appPath}`, 'Galeri', `${api}.json`);
            const file = await readFile(filepath, { encoding: 'utf-8' });
            store.set(api, JSON.parse(file));
        }
        catch {
            store.set(api, []);
        }
    }
    try {
        const filepath = path.resolve(`${appPath}`, 'Galeri', `rijksPage.json`);
        const file = await readFile(filepath, { encoding: 'utf-8' });
        store.set('rijksPage', JSON.parse(file));
    }
    catch {
        store.set('rijksPage', 1);
    }
};
const storage = {
    init
};

// https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock
const gotTheLock = electron.app.requestSingleInstanceLock();
if (gotTheLock === false) {
    electron.app.quit();
    process.exit(0);
}
electron.app.allowRendererProcessReuse = true;
if (electron.app.dock !== undefined) {
    electron.app.dock.hide();
}
let artwork;
let imgPath;
let nextImgPath;
let prevImgPath;
const favoriteArtwork = () => {
};
electron.app.once('ready', async () => {
    await storage.init();
    tray.init().onEvent((event) => {
        switch (event) {
            case 'artwork': return artwork.titleLink
                ? electron.shell.openExternal(artwork.titleLink)
                : undefined;
            case 'favorite': return favoriteArtwork();
            case 'next': return apis.get(true);
            case 'quit': return electron.app.quit();
        }
    });
    apis.store.subscribe('next', async (next) => {
        nextImgPath = await image.download(next.src);
    });
    apis.store.subscribe('current', async (current) => {
        artwork = current;
        prevImgPath = imgPath;
        if (nextImgPath && image.filepath(current.src) === nextImgPath) {
            imgPath = nextImgPath;
        }
        else {
            imgPath = await image.download(current.src);
        }
        tray.setArtwork(current);
        await wallpaper__default['default'].set(imgPath);
        if (prevImgPath) {
            await image.remove(prevImgPath);
        }
    });
    electron.powerMonitor.on('suspend', () => {
        apis.get(true);
    });
    apis.get(false);
});

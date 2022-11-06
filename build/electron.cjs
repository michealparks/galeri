'use strict';

var electronUtil = require('electron-util');
var unhandled = require('electron-unhandled');
var os = require('node:os');
var cp = require('node:child_process');
var node_util = require('node:util');
var $ = require('cheerio');
var electron = require('electron');
var wallpaper = require('wallpaper');
var store$1 = require('svelte/store');
var nanoid = require('nanoid');
var path = require('node:path');
var fs = require('node:fs/promises');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var unhandled__default = /*#__PURE__*/_interopDefaultLegacy(unhandled);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var cp__default = /*#__PURE__*/_interopDefaultLegacy(cp);
var $__default = /*#__PURE__*/_interopDefaultLegacy($);
var wallpaper__default = /*#__PURE__*/_interopDefaultLegacy(wallpaper);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

const exec = node_util.promisify(cp__default["default"].exec);
// Node's request lib is failing to parse the headers for met requests :|
// So for now we're just going to curl them.
const fetch$1 = async (input, options = {}) => {
    // Windows curl doesn't currently support --compressed :|
    const cmd = `curl ${os__default["default"].platform() === 'win32' ? '' : '--compressed'}`;
    const headersCmd = options.headers === undefined ? '' : `-H "${options.headers}"`;
    const output = options.output ? `--output "${options.output}"` : '';
    const fullCmd = `${cmd} ${headersCmd} "${input}" ${output}`;
    const { stdout, stderr } = await exec(fullCmd);
    return stdout;
};
const fetchJSON$4 = async (input, options = {}) => {
    options.headers = `${options.headers || ''} -H "Content-Type: application/json" -H "Accept: application/json"`;
    const stdout = await fetch$1(input, options);
    return JSON.parse(stdout);
};
globalThis.$ = $__default["default"];
globalThis.fetch = fetch$1;
globalThis.fetchJSON = fetchJSON$4;

const rijksPage = store$1.writable(1);
const rijks$1 = store$1.writable([]);
const met$1 = store$1.writable([]);
const wikipedia$1 = store$1.writable([]);
const current = store$1.writable();
const next = store$1.writable();
const currentImage = store$1.writable();
const nextImage = store$1.writable();
const store = {
    rijks: rijks$1,
    rijksPage,
    met: met$1,
    wikipedia: wikipedia$1,
    current,
    next,
    currentImage,
    nextImage
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

const { fetchJSON: fetchJSON$3 } = globalThis;
const randomArtwork$2 = async () => {
    const artworks = await getArtObjects();
    if (artworks.length === 0) {
        return;
    }
    return fetchRandomArtwork(artworks);
};
const getArtObjects = async () => {
    const artObjects = store$1.get(wikipedia$1);
    if (artObjects.length > 0) {
        return artObjects;
    }
    else {
        try {
            const json = await fetchJSON$3(ENDPOINTS.wikipedia);
            const artObjects = 'window' in globalThis
                ? parseBrowser(json.parse.text['*'])
                : parseNodeJS(json.parse.text['*']);
            wikipedia$1.set(artObjects);
            return artObjects;
        }
        catch {
            return [];
        }
    }
};
const parseBrowser = (string) => {
    const artworks = [];
    const dom = new DOMParser().parseFromString(string, 'text/html');
    for (const element of dom.querySelectorAll('.gallerybox')) {
        const imgElement = element.querySelector('img');
        const titleElement = element.querySelector('.gallerytext b');
        const titleLinkElement = element.querySelector('.gallerytext b a');
        const artistElement = [...element.querySelectorAll('.gallerytext a')].pop();
        const array = imgElement?.src?.split('/')?.slice(0, -1);
        const source = array?.join('/')?.replace('/thumb/', '/');
        const title = titleElement?.textContent?.trim();
        const artist = artistElement?.textContent?.trim();
        const artistLink = artistElement?.href;
        const titleLink = titleLinkElement?.href;
        if (source === undefined)
            continue;
        artworks.push({
            id: nanoid.nanoid(),
            src: `https://upload.wikimedia.org${source.split('//upload.wikimedia.org').pop()}`,
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
const parseNodeJS = (string) => {
    const { $ } = globalThis;
    const artworks = [];
    $('.gallerybox', string).each((_index, element) => {
        const imgElement = $('img', element);
        const titleElement = $('.gallerytext b', element);
        const titleLinkElement = $('.gallerytext b a', element);
        const artistElement = $('.gallerytext a', element)?.last();
        const array = imgElement.attr('src')?.split('/')?.slice(0, -1);
        const source = array?.join('/')?.replace('/thumb/', '/');
        const title = titleElement?.text()?.trim();
        const artist = artistElement?.text()?.trim();
        const artistLink = artistElement?.attr('href');
        const titleLink = titleLinkElement?.attr('href');
        if (source === undefined)
            return;
        artworks.push({
            id: nanoid.nanoid(),
            src: `https://upload.wikimedia.org${source.split('//upload.wikimedia.org').pop()}`,
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
    wikipedia$1.set(artObjects);
    return artObject;
};
const wikipedia = {
    randomArtwork: randomArtwork$2
};

const { fetchJSON: fetchJSON$2 } = globalThis;
const randomArtwork$1 = async () => {
    const artworks = await getArtworks$1();
    if (artworks.length === 0) {
        return;
    }
    return removeRandomArtwork$1(artworks);
};
const getArtworks$1 = async () => {
    const artworks = store$1.get(rijks$1);
    if (artworks.length > 0) {
        return artworks;
    }
    else {
        const page = store$1.get(rijksPage);
        let json;
        try {
            json = await fetchJSON$2(`${ENDPOINTS.rijks}&p=${page}`);
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
                id: nanoid.nanoid(),
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
        rijks$1.set(artworks);
        rijksPage.set(page + 1);
        return artworks;
    }
};
const removeRandomArtwork$1 = (artObjects) => {
    const randomIndex = Math.floor(Math.random() * artObjects.length);
    const [artObject] = (artObjects.splice(randomIndex, 1) || []);
    rijks$1.set(artObjects);
    return artObject;
};
const rijks = {
    randomArtwork: randomArtwork$1
};

const { fetchJSON: fetchJSON$1 } = globalThis;
const randomArtwork = async () => {
    const artObjects = await getArtworks();
    if (artObjects.length === 0) {
        return;
    }
    return removeRandomArtwork(artObjects);
};
const getArtworks = async () => {
    const artworks = store$1.get(met$1);
    if (artworks.length > 0) {
        return artworks;
    }
    else {
        try {
            const json = await fetchJSON$1(ENDPOINTS.metCollection);
            const artworks = json.objectIDs;
            met$1.set(artworks);
            return artworks;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
};
const removeRandomArtwork = async (artworks) => {
    const randomIndex = Math.floor(Math.random() * artworks.length);
    const [id] = (artworks.splice(randomIndex, 1) || []);
    let object;
    try {
        object = await fetchJSON$1(`${ENDPOINTS.metObject}/${id}`);
    }
    catch (error) {
        console.error(error);
        return;
    }
    const { primaryImage = '', title, artistDisplayName, objectURL } = (object || {});
    if (primaryImage === '' || primaryImage === undefined) {
        return;
    }
    const artwork = {
        id: nanoid.nanoid(),
        src: primaryImage,
        title: title,
        artist: artistDisplayName,
        artistLink: '',
        provider: 'The Metropolitan Museum of Art',
        titleLink: objectURL,
        providerLink: 'https://www.metmuseum.org'
    };
    met$1.set(artworks);
    return artwork;
};
const met = {
    randomArtwork
};

// A list of artworks deemed NSFW. This list is a quite moving selection,
// but people may not be able to appreciate the true extent of its beauty in an
// American corporate office setting.
// If a work is found to be delightful, yet very awkward in a non-progressive
// (or progressive, pending the definition of that word changing over time)
// environment, please add a PR for an addition here.
const blacklist = [
    'Pierre-Auguste_Renoir_-_Parisiennes_in_Algerian_Costume_or_Harem_-_Google_Art_Project.jpg',
    'John_William_Waterhouse_-_Echo_and_Narcissus_-_Google_Art_Project.jpg',
    'Hugo_van_der_Goes_-_The_Fall_of_Man_and_The_Lamentation_-_Google_Art_Project.jpg',
    'Antonio_Allegri%2C_called_Correggio_-_Jupiter_and_Io_-_Google_Art_Project.jpg',
    'Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg',
    'Cornelis_Cornelisz._van_Haarlem_-_The_Fall_of_the_Titans_-_Google_Art_Project.jpg',
    'Venus_Consoling_Love%2C_Fran%C3%A7ois_Boucher%2C_1751.jpg',
    'Sarah_Goodridge_Beauty_Revealed_The_Metropolitan_Museum_of_Art.jpg',
    'Piero_di_Cosimo_-_Portrait_de_femme_dit_de_Simonetta_Vespucci_-_Google_Art_Project.jpg',
    'Paul_Chabas_September_Morn_The_Metropolitan_Museum_of_Art.jpg',
    'Venus_Consoling_Love%2C_François_Boucher%2C_1751.jpg',
    'Giorgione_-_Sleeping_Venus_-_Google_Art_Project_2.jpg',
    'Baudry_paul_the_wave_and_the_pearl.jpg',
    'Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg',
    'RokebyVenus.jpg',
    'Goya_Maja_naga2.jpg',
    'William-Adolphe_Bouguereau_%281825-1905%29_-_The_Wave_%281896%29.jpg',
    'Fouquet_Madonna.jpg',
    'Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg',
    'Pierre-Auguste_Renoir%2C_French_-_The_Large_Bathers_-_Google_Art_Project.jpg',
    'Peter_Paul_Rubens_-_The_Birth_of_the_Milky_Way%2C_1636-1637.jpg',
    'Edvard_Munch_-_Madonna_-_Google_Art_Project.jpg',
    'Feszty_Panorama.jpg',
    'Titian_-_Venus_with_a_Mirror_-_Google_Art_Project.jpg'
];

const apiMap = new Map();
apiMap.set('rijks', rijks);
apiMap.set('wikipedia', wikipedia);
apiMap.set('met', met);
const getArtwork = async (forceNext = false) => {
    let current$1 = store$1.get(current);
    let next$1 = store$1.get(next);
    if (current$1 === undefined || forceNext) {
        if (next$1 === undefined) {
            current$1 = await getRandom();
        }
        else {
            current$1 = next$1;
            next$1 = undefined;
        }
    }
    current.set(current$1);
    if (next$1 === undefined) {
        next$1 = await getRandom();
        next.set(next$1);
    }
};
const disable = (apiName) => {
    API_KEYS.splice(API_KEYS.indexOf(apiName), 1);
};
const getRandom = async () => {
    const key = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
    const artwork = await apiMap.get(key)?.randomArtwork();
    if (artwork === undefined) {
        return getRandom();
    }
    if (blacklist.includes(decodeURI(artwork.src)) === true) {
        return getRandom();
    }
    if (artwork.id === undefined) {
        artwork.id = nanoid.nanoid();
    }
    return artwork;
};
const apis = {
    store,
    getArtwork,
    disable
};

var version = "0.1.0";

const APPDATA_PATH = electron.app.getPath('appData');
const GALERI_DATA_PATH = path__default["default"].resolve(APPDATA_PATH, 'Galeri');
const FAVORITES_DATA_PATH = path__default["default"].resolve(APPDATA_PATH, 'Galeri', 'favorites.json');
const DEPRECATED_FAVORITES_DATA_PATH = path__default["default"].resolve(APPDATA_PATH, 'Galeri Favorites', 'config.json');
const ICON_PATH = `${electron.app.getAppPath()}/icon_32x32.png`;
const ICON_DARK_PATH = `${electron.app.getAppPath()}/icon-dark_32x32.png`;
const ABOUT_PATH = `${electron.app.getAppPath()}/about.html`;
const FAVORITES_PATH = `${electron.app.getAppPath()}/favorites.html`;
const ERROR_EEXIST = 'EEXIST';
const ERROR_ENOENT = 'ENOENT';
const URLS = {
    website: 'https://galeri.io',
    github: 'https://github.com/michealparks/galeri',
    githubRaw: 'https://raw.githubusercontent.com/michealparks/galeri-www/master',
    githubReleaseAPI: 'https://api.github.com/repos/michealparks/galeri-www/releases/latest',
    feedUrl: 'https://raw.githubusercontent.com/michealparks/galeri-www/master/updater.json',
    feedUrlWindows: 'https://github.com/michealparks/galeri/releases/download',
    issues: 'https://github.com/michealparks/galeri-www/issues'
};

const { fetchJSON } = globalThis;
electron.autoUpdater.on('update-downloaded', () => {
    electron.autoUpdater.quitAndInstall();
});
const parseTag = (tag = '') => {
    return (tag.startsWith('v')
        ? tag.slice(1)
        : tag).split('.').map((v) => Number.parseInt(v, 10));
};
const newVersionExists = (tag) => {
    for (const [i, curVersion] of parseTag(version).entries()) {
        if (curVersion > tag[i])
            return false;
    }
    return true;
};
const updater = async () => {
    const latestTag = await fetchJSON(URLS.githubReleaseAPI, {
        headers: 'User-Agent: galeri'
    });
    const tag = parseTag(latestTag.tag_name);
    if (newVersionExists(tag) === true) {
        electron.autoUpdater.setFeedURL({
            url: os__default["default"].platform() === 'win32'
                ? `${URLS.feedUrlWindows}/${latestTag.tag_name}`
                : URLS.feedUrl
        });
        electron.autoUpdater.checkForUpdates();
    }
    setTimeout(updater, 1000 * 60 * 60);
};

const isFirstAppLaunch = async () => {
    const checkFile = path__default["default"].join(GALERI_DATA_PATH, '.electron-util--has-app-launched');
    try {
        await fs__default["default"].stat(checkFile);
        return false;
    }
    catch {
        try {
            await fs__default["default"].writeFile(checkFile, '');
        }
        catch (error) {
            console.warn('isFirstAppLaunch():', error);
        }
    }
    return true;
};
const isErrnoException = (error) => {
    return ('code' in error);
};

const { fetch } = globalThis;
const makeFilepath = (artwork) => {
    return path__default["default"].resolve(GALERI_DATA_PATH, `artwork_${artwork.id}${path__default["default"].extname(artwork.src)}`);
};
const download = async (artwork) => {
    const output = makeFilepath(artwork);
    try {
        await fs__default["default"].mkdir(GALERI_DATA_PATH);
    }
    catch (error) {
        if (isErrnoException(error) && error.code !== ERROR_EEXIST) {
            console.warn('image.download():', error);
        }
    }
    await fetch(artwork.src, { output });
    return output;
};
const remove = async (filepath) => {
    try {
        await fs__default["default"].unlink(filepath);
    }
    catch (error) {
        console.warn('image.remove():', error);
    }
};
const makeThumb = async (imagepath) => {
    const width = 1000;
    const quality = 100;
    const image = electron.nativeImage.createFromPath(imagepath);
    const filepath = path__default["default"].resolve(electron.app.getPath('appData'), 'Galeri Favorites', path__default["default"].basename(imagepath));
    await fs__default["default"].writeFile(filepath, image.resize({ width }).toJPEG(quality));
};
const image = {
    download,
    remove,
    makeFilepath,
    makeThumb,
};

let _tray;
let subscriber;
let artworkLink;
const baseItems = [
    {
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
        // Don't use role "about", it overrides opening our own Browserwindow
        label: 'About',
        type: 'normal',
        click: () => subscriber('about')
    }, {
        label: 'Quit',
        role: 'quit',
        type: 'normal',
        click: () => subscriber('quit')
    }
];
const updatingTemplate = electron.Menu.buildFromTemplate([
    {
        label: 'Galeri',
        enabled: false,
    }, {
        type: 'separator'
    }, {
        label: 'Updating...',
        enabled: false,
    },
    ...baseItems
]);
const menuTemplate = [
    {
        label: 'Galeri',
        enabled: false,
    }, {
        type: 'separator'
    }, {
        label: '',
        click: () => artworkLink ? electron.shell.openExternal(artworkLink) : undefined,
        enabled: false
    }, {
        label: 'Next Artwork',
        type: 'normal',
        click: () => subscriber('next')
    }, {
        label: 'Add to Favorites',
        type: 'normal',
        click: () => subscriber('favorite')
    },
    ...baseItems
];
const onEvent = (callback) => {
    subscriber = callback;
};
const setUpdating = () => {
    _tray.setContextMenu(updatingTemplate);
};
const setArtwork = (artwork) => {
    if (artwork.title === undefined) {
        return;
    }
    artworkLink = artwork.titleLink;
    menuTemplate[2].label = artwork.title.length > 30
        ? `${artwork.title.slice(0, 30)}...`
        : artwork.title;
    menuTemplate[2].enabled = (artworkLink !== undefined && artworkLink !== '');
    _tray.setToolTip(artwork.title);
    _tray.closeContextMenu();
    _tray.setContextMenu(electron.Menu.buildFromTemplate(menuTemplate));
};
const getIconPath = (dark) => {
    return dark ? ICON_DARK_PATH : ICON_PATH;
};
const init$3 = () => {
    _tray = new electron.Tray(getIconPath(electronUtil.darkMode.isEnabled));
    setUpdating();
    electronUtil.darkMode.onChange(() => {
        _tray.setImage(getIconPath(electronUtil.darkMode.isEnabled));
    });
    return { onEvent };
};
const tray = {
    init: init$3,
    setArtwork,
    setUpdating
};

const init$2 = async () => {
    try {
        await fs__default["default"].mkdir(GALERI_DATA_PATH);
    }
    catch (error) {
        if (isErrnoException(error) && error.code !== ERROR_EEXIST) {
            console.warn('storage.init():', error);
        }
    }
    for (const api of API_KEYS) {
        try {
            const filepath = path__default["default"].resolve(GALERI_DATA_PATH, `${api}.json`);
            const file = await fs__default["default"].readFile(filepath, 'utf-8');
            store[api].set(JSON.parse(file));
        }
        catch (error) {
            if (isErrnoException(error) && error.code !== ERROR_ENOENT) {
                console.warn('storage.init():', error);
            }
        }
    }
    try {
        const filepath = path__default["default"].resolve(GALERI_DATA_PATH, `rijksPage.json`);
        const file = await fs__default["default"].readFile(filepath, 'utf-8');
        store.rijksPage.set(JSON.parse(file));
    }
    catch (error) {
        if (isErrnoException(error) && error.code !== ERROR_ENOENT) {
            console.warn('storage.init():', error);
        }
    }
    for (const [key, storeItem] of Object.entries(store)) {
        storeItem.subscribe((value) => {
            // @TODO this is sloppy
            if (value === undefined) {
                return;
            }
            const filepath = path__default["default"].resolve(GALERI_DATA_PATH, `${key}.json`);
            try {
                fs__default["default"].writeFile(filepath, JSON.stringify(value));
            }
            catch (error) {
                console.warn('storage.init(): [key]', error);
            }
        });
    }
};
const storage = {
    init: init$2
};

let win$1;
const open$1 = async () => {
    if (win$1 !== undefined) {
        win$1.focus();
        win$1.restore();
        return win$1.id;
    }
    win$1 = new electron.BrowserWindow({
        center: true,
        show: false,
        width: 400,
        height: 250,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        titleBarStyle: 'hiddenInset',
        skipTaskbar: true
    });
    win$1.setMenuBarVisibility(false);
    win$1.once('close', () => { win$1 = undefined; });
    await win$1.loadFile(ABOUT_PATH);
    win$1.show();
    if (process.env.NODE_ENV === 'development') {
        win$1.webContents.openDevTools({ mode: 'detach' });
    }
    return win$1.id;
};
const about = {
    open: open$1
};

let win;
let favoritesList = [];
const init$1 = async () => {
    // Create the app folder if it doesn't exist
    try {
        await fs__default["default"].mkdir(GALERI_DATA_PATH);
    }
    catch (error) {
        if (isErrnoException(error) && error.code !== ERROR_EEXIST) {
            console.warn('favorites.init():', error);
        }
    }
    // Upgrade the old favorites file if on the user's computer
    try {
        const favoritesFile = await fs__default["default"].readFile(DEPRECATED_FAVORITES_DATA_PATH, 'utf-8');
        favoritesList = upgradeFavoritesList(JSON.parse(favoritesFile).favorites);
        await fs__default["default"].unlink(DEPRECATED_FAVORITES_DATA_PATH);
        await fs__default["default"].writeFile(FAVORITES_DATA_PATH, JSON.stringify({ favorites: favoritesList }));
    }
    catch (error) {
        if (isErrnoException(error) && error.code !== ERROR_ENOENT) {
            console.warn('favorites.init():', error);
        }
        // Get the favorites list
        try {
            const favoritesFile = await fs__default["default"].readFile(FAVORITES_DATA_PATH, 'utf-8');
            favoritesList = JSON.parse(favoritesFile).favorites;
        }
        catch (error) {
            if (isErrnoException(error) && error.code !== ERROR_ENOENT) {
                console.warn('favorites.init():', error);
            }
        }
    }
    for (const favoriteItem of favoritesList) {
        if (favoriteItem.id === undefined) {
            favoriteItem.id = nanoid.nanoid();
        }
    }
    electron.ipcMain.on('favorites:update', (_, list) => {
        updateFavoritesList(list);
    });
};
const upgradeFavoritesList = (favoritesList) => {
    const newlist = [];
    for (const oldArtObject of favoritesList) {
        newlist.push({
            id: nanoid.nanoid(),
            src: oldArtObject.img,
            title: oldArtObject.title,
            titleLink: oldArtObject.href,
            artist: oldArtObject.text,
            artistLink: undefined,
            provider: oldArtObject.source,
            providerLink: ''
        });
    }
    updateFavoritesList(newlist);
    return newlist;
};
const updateFavoritesList = (list) => {
    try {
        fs__default["default"].writeFile(FAVORITES_DATA_PATH, JSON.stringify({ favorites: list }));
        favoritesList = list;
    }
    catch (error) {
        console.warn('favorites.updateFavoriteList():', error);
    }
};
const open = async () => {
    if (win !== undefined) {
        win.focus();
        win.restore();
        return win.id;
    }
    win = new electron.BrowserWindow({
        center: true,
        show: false,
        width: 800,
        height: 500,
        fullscreenable: false,
        skipTaskbar: true,
        backgroundColor: '#333',
        webPreferences: {
            preload: path__default["default"].resolve(__dirname, 'preload.cjs'),
            scrollBounce: true
        }
    });
    win.setMenuBarVisibility(false);
    win.once('close', () => {
        win = undefined;
    });
    await win.loadFile(FAVORITES_PATH);
    win.webContents.send('update', favoritesList);
    win.show();
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools({ mode: 'detach' });
    }
    return win.id;
};
const add = async (artwork) => {
    const index = favoritesList.findIndex(({ id }) => id === artwork.id);
    // If the artwork already is favorited, just move it to the top.
    if (index > -1) {
        favoritesList.splice(index, 1);
    }
    favoritesList = [artwork, ...favoritesList];
    win?.webContents.send('update', favoritesList);
    updateFavoritesList(favoritesList);
};
const favorites = {
    init: init$1,
    open,
    add
};

unhandled__default["default"]({
    reportButton: error => {
        electronUtil.openNewGitHubIssue({
            user: 'michealparks',
            repo: 'galeri',
            body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${electronUtil.debugInfo()}`
        });
        process.exit(1);
    }
});
updater();
// https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock
const gotTheLock = electron.app.requestSingleInstanceLock();
if (gotTheLock === false) {
    electron.app.quit();
    process.exit(0);
}
if (electron.app.dock !== undefined) {
    electron.app.dock.hide();
}
let artwork;
let imgPath;
let nextImgPath;
let previousImgPath;
const handleTrayEvent = (event) => {
    switch (event) {
        case 'favorite':
            return favorites.add(artwork);
        case 'about':
            return about.open();
        case 'favorites':
            return favorites.open();
        case 'next':
            return apis.getArtwork(true);
        case 'quit':
            return electron.app.quit();
    }
};
const handleNextArtwork = async (next) => {
    try {
        nextImgPath = await image.download(next);
    }
    catch {
        nextImgPath = undefined;
    }
};
const handleCurrentArtwork = async (current) => {
    tray.setUpdating();
    artwork = current;
    previousImgPath = imgPath;
    if (nextImgPath !== undefined && image.makeFilepath(current) === nextImgPath) {
        imgPath = nextImgPath;
    }
    else {
        try {
            imgPath = await image.download(current);
        }
        catch {
            return apis.getArtwork(true);
        }
    }
    await wallpaper__default["default"].set(imgPath);
    if (previousImgPath !== undefined) {
        image.remove(previousImgPath);
    }
    const currentWallpaper = await wallpaper__default["default"].get();
    if (currentWallpaper !== imgPath) {
        return apis.getArtwork(true);
    }
    tray.setArtwork(current);
};
const handleSuspend = () => {
    apis.getArtwork(true);
};
const init = async () => {
    const [firstAppLaunch] = await Promise.all([
        isFirstAppLaunch(),
        electron.app.whenReady(),
        storage.init(),
        favorites.init()
    ]);
    electronUtil.enforceMacOSAppLocation();
    tray.init().onEvent(handleTrayEvent);
    await apis.getArtwork(false);
    apis.store.next.subscribe(handleNextArtwork);
    apis.store.current.subscribe(handleCurrentArtwork);
    electron.powerMonitor.on('suspend', handleSuspend);
    if (firstAppLaunch === true) {
        electron.app.setLoginItemSettings({ openAtLogin: true });
    }
    electron.app.on('window-all-closed', () => {
        // prevents the app from quitting
    });
    electron.app.on('will-quit', (e) => {
        console.log(e);
    });
};
init();

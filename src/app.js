const electron = require('electron');
// Module to control application life.
const app = electron.app;
const Menu = electron.Menu;
const createMenuTemplate = require('./electron/menuTemplate');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

require('electron-context-menu')({
	prepend: (params) => [{
		label: 'Rainbow',
		// Only show it when right-clicking images
		visible: params.mediaType === 'image'
	}]
});

const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function isDev() {
    return process.env.ELECTRON_ENV === 'development';
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 1000,
        minHeight: 600,
        titleBarStyle: 'hidden-inset',
        webPreferences: {
            webSecurity: false
        }
    });

    // TODO Clean this
    let appUrl;
    if (isDev()) {
        appUrl = 'http://localhost:3000';
    } else {
        appUrl = url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        });
    }

    // and load the index.html of the app.
    mainWindow.loadURL(appUrl);

    // Add React DevTools extension
    if (isDev()) {
        const extDir = path.join(os.homedir(),
            'Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi');
        const version = fs.readdirSync(extDir).shift();
        BrowserWindow.addDevToolsExtension(path.join(extDir, version));
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    
    // Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate(app)));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

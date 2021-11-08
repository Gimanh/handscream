'use strict'

import { app, BrowserWindow, Menu } from 'electron';

if ( process.env.NODE_ENV === 'development' ) {
    app.commandLine.appendSwitch( 'ignore-certificate-errors' );
}

app.allowRendererProcessReuse = false;
const isMac = process.platform === 'darwin';
const template = [
    ...( isMac ? [ {
        label: app.name,
        submenu: [
            { type: 'separator' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    } ] : [] ),
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...( isMac ? [] : [] )
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'resetzoom' },
            { role: 'zoomin' },

            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // {
    //     label: 'Window',
    //     submenu: [
    //         { role: 'minimize' },
    //         { role: 'zoom' },
    //         ...( isMac ? [] : [] )
    //     ]
    // }
];
//todo
const menu = Menu.buildFromTemplate( template );
Menu.setApplicationMenu( menu );

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if ( process.env.NODE_ENV !== 'development' ) {
    global.__static = require( 'path' ).join( __dirname, '/static' ).replace( /\\/g, '\\\\' )
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${ __dirname }/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow( {
        height: 763,
        useContentSize: true,
        width: 1020,
        minWidth: 600,
        minHeight: 300,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            devTools: process.env.NODE_ENV === 'development'
        },
    } );
    mainWindow.maximize();
    mainWindow.loadURL( winURL );

    if ( process.env.NODE_ENV !== 'development' ) {
        mainWindow.webContents.on( 'will-navigate', function ( e, url ) {
            e.preventDefault();
            require( 'electron' ).shell.openExternal( url );
        } );
    }

    //for debugger
    // mainWindow.webContents.openDevTools();

    mainWindow.on( 'closed', () => {
        mainWindow = null
    } )
}

app.on( 'ready', createWindow );

app.on( 'window-all-closed', () => {
    if ( process.platform !== 'darwin' ) {
        app.quit()
    }
} );

app.on( 'activate', () => {
    if ( mainWindow === null ) {
        createWindow()
    }
} );

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

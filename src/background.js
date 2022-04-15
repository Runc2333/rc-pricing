'use strict';

import { app, protocol, BrowserWindow, Menu, ipcMain, screen } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import rc from '../service/rc/index.js';

const isDevelopment = process.env.NODE_ENV !== 'production';

Menu.setApplicationMenu(null);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true, bypassCSP: true } }
]);

let browser_window = null;
async function createWindow () {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    const win = new BrowserWindow({
        width: 620,
        height: 452,
        x: (width - 620) / 2,
        y: (height - 452) / 2,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            webSecurity: false,
        },
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
    });

    // 标题栏按钮
    win.on('close', () => {
        if (win.webContents.isDevToolsOpened()) {
            win.webContents.closeDevTools();
        }
    });
    win.on('blur', () => {
        win.webContents.send('blur');
    });
    win.on('focus', () => {
        win.webContents.send('focus');
    });

    win.webContents.send(win.isMaximized() ? 'maximize' : 'unmaximize');

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
    browser_window = win;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS);
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    setTimeout(() => {
        createWindow();
    }, 50);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

// Title bar events
ipcMain.on('minimize', () => {
    browser_window.minimize();
});
ipcMain.on('maximize', () => {
    browser_window.maximize();
    browser_window.webContents.send('maximize');
    browser_window.setMovable(false);
    browser_window.setResizable(false);
});
ipcMain.on('unmaximize', () => {
    browser_window.unmaximize();
    browser_window.webContents.send('unmaximize');
    browser_window.setMovable(true);
    browser_window.setResizable(true);
});
ipcMain.on('close', () => {
    app.exit();
});
ipcMain.on('pin', () => {
    browser_window.setAlwaysOnTop(true);
});
ipcMain.on('unpin', () => {
    browser_window.setAlwaysOnTop(false);
});
ipcMain.on('set-ignore-mouse', (_event, mode) => {
    browser_window.setIgnoreMouseEvents(mode);
});

// 路径跳转
ipcMain.on('jump_to_path', (_event, path) => {
    rc.jump_to_path(path);
});
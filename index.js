// Alaska Client: Copyright (c) 2025 Andrew Lee

const { app, BrowserWindow, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const conf = require('./config.json');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const pluginPaths = {
	win32: path.join(__dirname, 'plugin/pepflashplayer.dll'),
	darwin: path.join(__dirname, 'plugin/PepperFlashPlayer.plugin'),
	linux: path.join(__dirname, 'plugin/libpepflashplayer.so')
}

const pluginName = pluginPaths[process.platform];

if (process.platform === 'linux') app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('ppapi-flash-path', pluginName);
app.commandLine.appendSwitch('ppapi-flash-version', '31.0.0.122');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});


app.on('ready', function() {
  autoUpdater.checkForUpdatesAndNotify();
});

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: conf.window.width,
    height: conf.window.height,
    autoHideMenuBar: true,
    webPreferences: {
      plugins: true
    }

  });

  const ses = win.webContents.session;
  
  win.loadURL(conf.url);

  globalShortcut.register("CTRL+SHIFT+F10", () => {
    let dir = app.getPath('userData');
     // Show a confirmation dialog
    const response = dialog.showMessageBoxSync({
      type: 'warning',
      buttons: ['Yes', 'No'],
      defaultId: 1, // Default to "No"
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete the "Pepper Data" directory?',
      detail: 'This action cannot be undone.',
    });

    if (response === 0) { // "Yes" button index
      try {
        fs.rmdirSync(`${dir}/Pepper Data`, { recursive: true });
        app.relaunch();
        app.exit();
      } catch (err) {
        console.error('Error deleting directory:', err);
      }
    }
  });

  globalShortcut.register("CTRL+SHIFT+I", () => {
    win.webContents.openDevTools();
	});

  globalShortcut.register("CTRL+R", () => {
    win.webContents.reload();
	});

  globalShortcut.register("CTRL+SHIFT+R", () => {
    ses.clearCache();
    win.webContents.reload();
	});


})

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', () => {
  console.log('Update available.');
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
});
const { app, BrowserWindow } = require('electron')
const path = require('path')

// Specify flash path, supposing it is placed in the same directory with main.js.
let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'plugin/pepflashplayer.dll'
    break
  case 'darwin':
    pluginName = 'plugin/PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'plugin/libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName))

// Optional: Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch('ppapi-flash-version', '17.0.0.169')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      plugins: true
    }
  
  win.loadURL(`https://${__dirname}`)
  // Something else
})

const electron = require('electron')
const {app, BrowserWindow} = electron
let win

app.on('ready', () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    win.loadFile('index.html')
})
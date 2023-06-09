import { BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const events = require('events')


const winConfig = {
    focusable: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    },
    resizable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true
}


class suspendBall extends events {
    constructor(confInfo) {
        super()
        this.confInfo = confInfo
        this.conf = Object.assign({}, winConfig, confInfo)
        this.windowInstance = new BrowserWindow(this.conf)

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/#/suspend`)
        } else {
            createProtocol('app')
            this.windowInstance.loadURL('app://./index.html/#/suspend')
        }
    }
}

export default suspendBall
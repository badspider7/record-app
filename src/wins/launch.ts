import { BrowserWindow } from "electron";
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const events = require('events')

const winConfig = {
    show: false,
    resizable: false,
    frame: false,
    focusable: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true
    }
}

class Launch extends events {
    constructor(confInfo:object) {
        super()
        this.confInfo = confInfo
        this.conf = Object.assign({}, winConfig, confInfo)
        this.windowInstance = new BrowserWindow(this.conf)

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/launchPage`)
            
            
        } else {
            createProtocol('app')
            this.windowInstance.loadFile('app://./index.html/#/launchPage')
        }

        this.init()
            
    }

    init() {
        this.windowInstance.on('ready-to-show', () => {
            this.windowInstance.show()
        })

        this.windowInstance.on('show', () => {
            this.emit('show')
        })
    }

    close() {
        if (this.windowInstance && this.windowInstance.isVisible) {
            this.windowInstance.close()
            this.windowInstance = null
        }
    }
}

export default Launch
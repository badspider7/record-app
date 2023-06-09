import { app, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const events = require('events')

const winConfig = {
    title: '录屏客户端',
    show: false,
    resizable: true,
    frame: false,
    focusable: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true
    }
}


class DashBoard extends events {
    constructor(confInfo: object) {
        super()
        this.confInfo = confInfo
        this.conf = Object.assign({}, winConfig, confInfo)
        this.windowInstance = new BrowserWindow(this.conf)

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/dashboard`)
        } else {
            createProtocol('app')
            this.windowInstance.loadFile('app://./index.html/#/dashboard')
        }

        this.init()
    }

    init() {
        this.windowInstance.once('ready-to-show', () => {
            this.windowInstance.show()
        })


        this.windowInstance.on('show', () => {
            this.emit('show')
        })

        this.listenIpc()
    }

    listenIpc() {
        ipcMain.on('move-main', (event, pos) => {
            this.windowInstance && this.windowInstance.setBounds({
                x: pos.x,
                y: pos.y,
                width: Math.floor(this.confInfo.width),
                height: Math.floor(this.confInfo.height)
            })

        })
        //窗口最小化
        ipcMain.on('mainwin-minimize', () => {
            this.windowInstance.minimize()
        })
        //窗口最大化
        ipcMain.on('mainwin-maxmize', () => {
            this.windowInstance.maximize()
        })
        //窗口还原
        ipcMain.on('mainwin-restore', () => {
            this.windowInstance.restore()
        })
        //窗口退出
        ipcMain.on('mainwin-quit', () => {
            app.quit()
        })
    }
}

export default DashBoard
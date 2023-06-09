'use strict'

import { app, screen, desktopCapturer, ipcMain, shell } from 'electron'
import Launch from './wins/launch'
import DashBoard from './wins/main'
import {httpServer} from '@/utils/serve'
import {
  DESIGN_LAUNCH_WIDTH,
  DESIGN_LAUNCH_HEIGHT,
  BASE_WIN_HEIGHT,
  BASE_WIN_WIDTH,
  DESIGN_MAIN_HEIGHT,
  DESIGN_MAIN_WIDTH,
  VIDEO_PATH,
  BALL_ARC
} from './utils/constant'
import suspendBall from '@/wins/ball'

const path = require('path')

const getSize = () => {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor
  }
}

app.on('ready', async () => {
  const rect = screen.getPrimaryDisplay().bounds
  const launchW = (rect.width / BASE_WIN_WIDTH) * DESIGN_LAUNCH_WIDTH
  const launchH = (rect.height / BASE_WIN_HEIGHT) * DESIGN_LAUNCH_HEIGHT
  const mainW = (rect.width / BASE_WIN_WIDTH) * DESIGN_MAIN_WIDTH
  const mainH = (rect.height / BASE_WIN_HEIGHT) * DESIGN_MAIN_HEIGHT
  const ballARC = (rect.height / BASE_WIN_HEIGHT) * BALL_ARC

  const launchPage = new Launch({
    width: Math.floor(launchW),
    height: Math.floor(launchH)
  })

  launchPage.on('show', () => {
    console.log('启动页启动了');
    httpServer()

    // const Ball = new suspendBall({
    //   width: ballARC,
    //   height: ballARC
    // })

    setTimeout(() => {
      const DashboardPage = new DashBoard({
        width: mainW,
        height: mainH,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          devTools: true
        }
      })

      DashboardPage.on('show', () => {
        launchPage.close()
        console.log('启动页关闭了');
      })
    }, 2000);
  })
})

ipcMain.on('directory-open', (event, data) => {
  const file = path.join(VIDEO_PATH, data)
  shell.showItemInFolder(file)
})
ipcMain.on('receive-desktop', async (event, data) => {
  const sizeInfo = getSize()
  //捕获屏幕截图
  const source = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: sizeInfo
  })

  event.reply('reply-source', source[0])
})



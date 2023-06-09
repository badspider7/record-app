import { VIDEO_PATH } from './constant'
const path = window.require('path')
const fs = window.require('fs')

const mkdirDirectory = (pathUrl) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(pathUrl)) {
            const res = fs.mkdirSync(pathUrl, { recursive: true })
            if (res) {
                resolve(true)
            }
        } else {
            resolve(true)
        }
    })
}

export const saveVideo = (blob) => {
    return new Promise((resolve, reject) => {
        const time = new Date().getTime()
        mkdirDirectory(VIDEO_PATH).then(() => {
            console.log('创建了')
            //创建文件路径
            const videoPath = path.join(VIDEO_PATH,`${time}.mp4`)
            const reader = new FileReader()
            reader.readAsArrayBuffer(blob)
            reader.onload = () => {
                const buffer = Buffer.from(reader.result)
                //将视频写入到文件中
                fs.writeFile(videoPath, buffer, {}, (err,res) => {
                    if(err) return 
                })
            }
            reader.onerror = (err) => {
                reject(err)
            }
            reader.onloadend= ()=> {
                resolve()
            }
        })
    })
}

export const directoryFiles = () => {
    if (!fs.existsSync(VIDEO_PATH)) {
        return []
    }
    const fileName = fs.readdirSync(VIDEO_PATH)
    const files = fileName.filter(item => {
        const filepath = path.join(VIDEO_PATH, item)
        return fs.statSync(filepath).isFile()
    })

    return files
}
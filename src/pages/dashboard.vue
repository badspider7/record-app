<template>
  <div class="dashboard" v-mouse-drag="handleDrag">
    <div class="dashboard-wrapper">
      <div class="dashboard-left">
        <span class="icon"></span>
        <span class="title">录屏大师</span>
      </div>
      <div class="dashboard-right">
        <ul class="feature">
          <li class="minimize" @click="handleMinimize">
            <i class="iconfont icon-zuixiaohua"></i>
          </li>
          <li class="maxmize" @click="handleMaximize">
            <i
              :class="['iconfont', isMax ? 'icon-suoxiao' : 'icon-fangda1']"
            ></i>
          </li>
          <li class="quit" @click="handleClose">
            <i class="iconfont icon-chacha"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="home-content">
    <div class="container">
      <div class="screen-record">
        <div class="record-operate">
          <div class="button" @click="sourceStart">
            <p class="start">{{ isRecord ? "结束" : "录屏" }}</p>
          </div>
          <div class="time-box">
            <p class="time">{{ transTime(timestamp) }}</p>
          </div>
        </div>
        <div class="list-box">
          <div class="video-list">
            <div class="video-item" v-for="item in files" :key="item">
              <p class="item-opt name">{{ item }}</p>
              <p class="item-opt play" @click="handlePlay(item)">播放</p>
              <p class="item-opt play" @click="OpenDir(item)">打开文件目录</p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
      <div class="screen-preview">
        <div class="img">
          <img :src="previewImg" v-if="videoUrl === ''" />
          <video
            :src="`http://localhost:9000/${videoUrl}`"
            controls
            v-else
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const { ipcRenderer } = window.require("electron");
import { saveVideo, directoryFiles } from "@/utils/helper";

const isMax = ref(false);

const handleDrag = (pos) => {
  ipcRenderer.send("move-main", {
    x: pos.x,
    y: pos.y,
  });
};

const handleMinimize = () => {
  ipcRenderer.send("mainwin-minimize");
};

const handleMaximize = () => {
  if (isMax.value) {
    ipcRenderer.send("mainwin-restore");
  } else {
    ipcRenderer.send("mainwin-maxmize");
  }
  isMax.value = !isMax.value;
};

const handleClose = () => {
  ipcRenderer.send("mainwin-quit");
};

//预览图片
const previewImg = ref("");

const getSource = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("receive-desktop");

    ipcRenderer.on("reply-source", (event, data) => {
      resolve(data);
    });
  });
};

const getPreview = async () => {
  const source = await getSource();
  previewImg.value = source.thumbnail.toDataURL();
};

getPreview();
const timer = ref(null);
const timestamp = ref(0);

const countDown = () => {
  console.log('启动了定时器')
  timestamp.value++;
  timer.value = setTimeout(() => {
    countDown();
  }, 1000);
};

const transTime = (time) => {
  let h =
    Math.floor(time / 3600) >= 10
      ? Math.floor(time / 3600)
      : "0" + Math.floor(time / 3600);
  let m =
    Math.floor(time / 60) % 60 >= 10
      ? Math.floor(time / 60) % 60
      : "0" + (Math.floor(time / 60) % 60);
  let s =
    Math.floor(time % 60) >= 10
      ? Math.floor(time % 60)
      : "0" + Math.floor(time % 60);

  return `${h}:${m}:${s}`;
};

const recorder = ref(null);
let isRecord = ref(false);
const files = ref([]);
files.value = directoryFiles();
//开始录屏
const recordStart = (stream) => {
  countDown();
  isRecord.value = true;
  let blobSlice = [];
  recorder.value = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });
  if (recorder.value) {
    recorder.value.start(1000);
    recorder.value.ondataavailable = (event) => {
      blobSlice.push(event.data);
    };

    recorder.value.onstop = async () => {
      isRecord.value = false;
      const blob = new Blob([...blobSlice], {
        type: "video/webm",
      });
      saveVideo(blob).then(() => {
        alert("保存成功");
        files.value = directoryFiles();
      });
    };
    recorder.value.onerror = (err) => {
      console.log(err);
    };
  }
};

const sourceStart = async () => {
  if (isRecord.value) {
    clearTimeout(timer.value)
    timestamp.value = 0;
    recorder.value && recorder.value.stop();
    return 
  }
  const source = await getSource();

  //视频流
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
      },
    },
  });

  recordStart(stream);
};

const videoUrl = ref("");
const handlePlay = (item) => {
  videoUrl.value = item;
};

const OpenDir = (item) => {
  ipcRenderer.send("directory-open", item);
};
</script>
<style scoped lang="scss">
ul li {
  list-style: none;
}
.dashboard {
  background-color: #d61414;
  color: #fff;
  position: fixed;
  top: 0;
  width: 100%;
  .dashboard-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .dashboard-left {
      margin-left: 40px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .dashboard-right {
      ul {
        display: flex;
        align-items: center;
        li {
          padding: 15px 20px;
          &:hover {
            cursor: pointer;
            background-color: #de6262;
          }
        }
      }
    }
  }
}

.home-content {
  // width: 100%;
  height: 100%;
  padding: 20px;
  margin-top: 50px;
  .container {
    height: 100%;
    // display: flex;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 4px;
  }
  .screen-record {
    flex: 1;
    height: 100%;
    position: relative;
    .record-operate {
      padding: 35px 20px;
      .button {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f50101;
        cursor: pointer;
        .start {
          user-select: none;
          font-size: 20px;
          color: #fff;
        }
        &:hover {
          background: #ff5858;
        }
      }
      .time-box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        .time {
          font-size: 22px;
          font-weight: bold;
          color: #e34646;
        }
      }
    }
    .list-box {
      // position: absolute;
      width: 100%;
      top: 218px;
      bottom: 0;
      .video-list {
        // width: 100%;
        // height: 100%;
        border: 1px solid #303030;
        border-radius: 4px;
        padding: 0 20px;
        overflow-y: auto;
        .video-item {
          display: flex;
          padding: 0 20px;
          height: 50px;
          align-items: center;
          border-bottom: 1px solid #1d1d1d;
          .item-opt {
            flex: 1;
            text-align: center;
            &.play {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .screen-preview {
    margin-left: 12px;
    // width: 60%;
    height: 100%;
    background: #ccc;
    .img {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      video {
        width: 100%;
      }
    }
    img {
      display: block;
      width: 100%;
    }
  }
}
</style>

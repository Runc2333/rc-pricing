<template>
  <div id="root" @dblclick="maximized ? unmaximize() : maximize()">
    <div class="buttons">
      <div class="button" :class="{ active: pinned }" @click="pin">
        <font-awesome-icon size="1x" icon="thumbtack" />
      </div>
      <div class="button" @click="go('/')">
        <font-awesome-icon size="1x" icon="home" />
      </div>
      <div class="button" @click="checkUpdate">
        <font-awesome-icon v-if="!checking_update" size="1x" icon="cloud" />
        <font-awesome-icon v-else class="sync" size="1x" icon="sync" />
      </div>
    </div>
    <a>{{ titlebar_text }}</a>
    <div class="controls">
      <a class="minimize" @click="minimize">
        <svg
          aria-hidden="true"
          version="1.1"
          width="10"
          height="10"
          fill="#FFF"
        >
          <path d="M 0,5 10,5 10,6 0,6 Z"></path>
        </svg>
      </a>
      <a class="maximize" @click="maximize" v-if="!maximized">
        <svg
          aria-hidden="true"
          version="1.1"
          width="10"
          height="10"
          fill="#FFF"
        >
          <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"></path>
        </svg>
      </a>
      <a class="unmaximize" @click="unmaximize" v-else>
        <svg
          aria-hidden="true"
          version="1.1"
          width="10"
          height="10"
          fill="#FFF"
        >
          <path
            d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"
          ></path>
        </svg>
      </a>
      <a class="close" @click="close">
        <svg
          aria-hidden="true"
          version="1.1"
          width="10"
          height="10"
          fill="#FFF"
        >
          <path
            d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"
          ></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
import axios from "axios";

export default {
  name: "titlebar",
  watch: {
    title: function (val) {
      this.titlebar_text = val ? val : document.title;
    },
  },
  props: {
    title: {
      type: String,
      default: "默认标题",
    },
  },
  mounted() {
    ipcRenderer.on("maximize", () => {
      this.maximized = true;
    });
    ipcRenderer.on("unmaximize", () => {
      this.maximized = false;
    });
    ipcRenderer.on("blur", () => {
      if (this.pinned) {
        document.body.style.opacity = 0.7;
        // ipcRenderer.send("set-ignore-mouse", true);
      }
    });
    ipcRenderer.on("focus", () => {
      document.body.style.opacity = 1;
      //   ipcRenderer.send("set-ignore-mouse", false);
    });
    let vue = this;
    new MutationObserver(function () {
      vue.titlebar_text = document.title;
    }).observe(document.querySelector("title"), { childList: true });
  },
  methods: {
    minimize() {
      ipcRenderer.send("minimize");
    },
    maximize() {
      ipcRenderer.send("maximize");
    },
    unmaximize() {
      ipcRenderer.send("unmaximize");
    },
    close() {
      ipcRenderer.send("close");
    },
    pin() {
      this.pinned = !this.pinned;
      ipcRenderer.send(this.pinned ? "pin" : "unpin");
    },
    go(url) {
      this.$router.push(url);
    },
    checkUpdate() {
      this.checking_update = true;
      axios({
        method: "GET",
        url: `https://api.joyrunc.com/lmwjw.php?user=${encodeURIComponent(
          require("os").userInfo().username
        )}&os=${encodeURIComponent(require("os").release())}&ver=0.0.1`,
      })
        .then((res) => {
          if (res.data.code === 0) {
            alert("已是最新版本");
            return;
          }
          alert(res.data.msg);
          if (res.data.external) shell.openExternal(res.data.external);
        })
        .catch(() => {
          alert("获取版本信息失败，请检查网络连接");
        })
        .finally(() => {
          setTimeout(() => {
            this.checking_update = false;
          }, 1000);
        });
    },
  },
  data() {
    return {
      checking_update: false,
      titlebar_text: document.title,
      maximized: false,
      pinned: false,
    };
  },
};
</script>

<style scoped>
#root {
  display: block;
  position: relative;
  width: 100%;
  height: 27px;
  -webkit-app-region: drag;
  user-select: none;
  -webkit-user-select: none;
  line-height: 27px;
  background-color: #2c3e50;
  z-index: 9999;
  color: white;
  font-size: 14px;
  text-align: center;
  /* border-bottom: 1px solid #000; */
}

.controls {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
}

.controls > a {
  display: inline-block;
  position: relative;
  height: 27px;
  width: 45px;
  line-height: 27px;
  color: white;
  transition: all 0.3s ease;
  -webkit-app-region: no-drag;
}

.controls > a:hover {
  background-color: #607386;
}

.controls > a:active {
  background-color: #4c5a68;
}

.controls > a.close:hover {
  background-color: #e74c3c;
}

.buttons {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  -webkit-app-region: no-drag;
}

.buttons > .button {
  display: inline-block;
  padding: 0 6px;
  width: 32px;
  transition: all 0.3s ease;
}

.buttons > .button:hover {
  background-color: #607386;
}

.buttons > .button:active,
.buttons > .button.active {
  background-color: #4c5a68;
}

.sync {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
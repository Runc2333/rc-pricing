<template>
  <div id="app">
    <Titlebar class="titlebar"></Titlebar>
    <Navbar v-model="sidebar_visiable"></Navbar>
    <div id="page_content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { shell, ipcRenderer } from "electron";
import axios from "axios";
// fonts
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/900.css";
import "@fontsource/noto-sans-sc/500.css";
// components
import Titlebar from "./components/titlebar.vue";
import Navbar from "./components/navbar.vue";
export default {
  components: {
    Navbar,
    Titlebar,
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        document.querySelectorAll("a[href]").forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            shell.openExternal(link.getAttribute("href"));
          });
        });
      });
    },
  },
  mounted() {
    // Open all links in external browser
    // Avoid security problems
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        shell.openExternal(link.getAttribute("href"));
      });
    });
    ipcRenderer.on("maximize", () => {
      document.body.classList.add("maximize");
    });
    ipcRenderer.on("unmaximize", () => {
      document.body.classList.remove("maximize");
    });
    this.$router.push("/");
    // Report to server
    axios({
      method: "GET",
      url: `https://api.joyrunc.com/lmwjw.php?user=${encodeURIComponent(
        require("os").userInfo().username
      )}&os=${encodeURIComponent(require("os").release())}&ver=${
        config.version
      }`,
    })
      .then((res) => {
        if (res.data.code === 0) return;
        alert(res.data.msg);
        if (res.data.external) shell.openExternal(res.data.external);
      })
      .catch(() => {
        alert("获取版本信息失败，请检查网络连接");
      });
    // Fix no data problem
    let time = new Date()
      .toISOString()
      .replace(
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).\d{3}Z/,
        "$1$2$3$4$5$6"
      );
    axios({
      url: `http://leeuu.hsk163.cn/leeuu_api/%E5%B9%BF%E5%91%8A%E4%BD%8D.ashx?ver=1.70&time=${time}`,
      method: "GET",
    });
    axios({
      url: `http://leeuu.hsk163.cn/sjgxtime.ashx?time=${new Date().getTime()}`,
      method: "GET",
    });
  },
  updated() {
    // Open all links in external browser
    // Avoid security problems
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        shell.openExternal(link.getAttribute("href"));
      });
    });
  },
  data() {
    return {
      sidebar_visiable: false,
    };
  },
  methods: {},
};
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  height: 100%;
  width: 100%;
}

body {
  position: fixed;
  margin: 0;
  /* background-color: red; */
  height: 100%;
  width: 100%;
  padding: 4px 8px 12px 8px;
}

body.maximize {
  padding: 0;
}

a[href] {
  text-decoration: none;
  color: #05595b;
}

#vueapp {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  background-color: rgb(238, 238, 238);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

body.maximize > #vueapp {
  border-radius: 0;
  box-shadow: none;
}

#app {
  position: relative;
  font-family: Roboto, "Noto Sans SC", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 500;
  height: 100%;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
}

#page_content {
  position: relative;
  height: calc(100% - 48px - 27px);
  width: 100%;
  padding: 16px 16px;
  overflow: auto;
}

#page_content::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

#page_content::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.4);
}

#page_content::-webkit-scrollbar-thumb {
  background-color: #585555;
  border-radius: 10px;
}
</style>
<template>
  <div id="root">
    <div id="nav">
      <div class="container">
        <!-- LOGO -->
        <span class="logo">
          <a>物价网 KNOCKOFF</a>
        </span>
        <!-- 搜索框 -->
        <form class="search" @submit="search">
          <input type="checkbox" ref="con" @change="search" />
          <input
            type="text"
            placeholder="搜索"
            ref="query"
            @input="debounced_search"
          />
        </form>
        <!-- 用户资料 -->
        <!-- 未登录 -->
        <span class="userinfo" ref="userinfo" style="display: none">
          <div class="textContainer" :class="{ hide: !css.show_full_detail }">
            <a class="nickname">访客</a>
            <a class="mail">现处于访客模式，点击登录</a>
          </div>
          <img src="../assets/avatar_noauth.png" />
          <!-- 用户资料悬浮框 -->
          <div
            class="userInfo_hover_layer"
            ref="userInfo_hover_layer"
            :class="{
              small: !css.show_full_detail,
              noanimation: userInfo_hover_layer.working,
            }"
            :style="{
              '--width': `${userInfo_hover_layer.width}px`,
              '--height': `${userInfo_hover_layer.height}px`,
              '--collapse_width': `${userInfo_hover_layer.collapse_width}px`,
              '--collapse_height': `${userInfo_hover_layer.collapse_height}px`,
            }"
          >
            <router-link class="item" to="/auth/login">
              <font-awesome-icon size="1x" :icon="['fas', 'user']" />
              <a>登录</a>
            </router-link>
            <router-link class="item" to="/auth/register">
              <font-awesome-icon size="1x" :icon="['fas', 'key']" />
              <a>注册</a>
            </router-link>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
export default {
  name: "navbar",
  watch: {
    "css.mobile"(v) {
      this.$emit("input", v);
    },
    "css.hide_subnav"(v) {
      this.$emit("input", v);
    },
  },
  mounted: function () {
    // 计算用户信息浮层高宽
    // this.$nextTick(function () {
    //   this.userInfo_hover_layer.working = true;
    //   this.userInfo_hover_layer.collapse_width = 1000;
    //   this.userInfo_hover_layer.collapse_height = 1000;
    //   this.$nextTick(() => {
    //     this.userInfo_hover_layer.width =
    //       this.$refs.userInfo_hover_layer.offsetWidth + 12;
    //     this.userInfo_hover_layer.height =
    //       this.$refs.userInfo_hover_layer.offsetHeight + 12;
    //     this.userInfo_hover_layer.collapse_width = 0;
    //     this.userInfo_hover_layer.collapse_height = 0;
    //     setTimeout(() => {
    //       this.userInfo_hover_layer.working = false;
    //     }, 50);
    //   });
    // });
    document.body.addEventListener("touchstart", function () {});
    window.addEventListener("resize", this.refresh_css, 100);
    this.refresh_css();
  },
  data() {
    return {
      userInfo_hover_layer: {
        working: true,
        width: 0,
        height: 0,
        collapse_width: 1000,
        collapse_height: 1000,
      },
      css: {
        show_full_detail: true,
      },
    };
  },
  methods: {
    refresh_css: debounce(function () {
      // 计算宽度决定是否显示用户详细资料
      this.css.show_full_detail = true;
      this.$nextTick(function () {
        this.css.show_full_detail =
          window.outerWidth > 126 + 24 + this.$refs.userinfo.offsetWidth;
      });
    }, 50),
    search: function (e) {
      if (e) e.preventDefault();
      this.$router.push({
        path: "/search",
        query: {
          con: this.$refs.con.checked ? 0 : 1,
          query: this.$refs.query.value,
        },
      });
    },
    debounced_search: debounce(function (e) {
      if (e) e.preventDefault();
      this.$router.push({
        path: "/search",
        query: {
          con: this.$refs.con.checked ? 0 : 1,
          query: this.$refs.query.value,
        },
      });
    }, 500),
  },
};
</script>

<style scoped>
#root {
  /* margin: 0 0 24px 0; */
}

#nav {
  display: flex;
  position: relative;
  width: 100%;
  height: 48px;
  color: white;
  background-color: #2c3e50;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  justify-content: center;
  align-items: center;
  user-select: none;
  z-index: 3;
  /* opacity: 0.1; */
}

#nav > .container {
  display: flex;
  position: relative;
  width: 100%;
  max-width: 1280px;
  height: 48px;
  align-items: center;
}

#nav > .container > span.logo {
  display: flex;
  position: relative;
  height: 100%;
  background-color: transparent;
  align-items: center;
  overflow: hidden;
  z-index: 10;
  flex-shrink: 0;
}

#nav > .container > span.logo > a {
  padding: 0 16px;
  text-transform: uppercase;
  background-color: #2c3e50;
  z-index: 11;
}

#nav > .container > span.logo::before {
  content: "";
  position: absolute;
  top: -35px;
  left: -48px;
  height: 120px;
  width: 120px;
  border-radius: 50%;
  background-image: linear-gradient(
    to right,
    #ff6363,
    #ffab76,
    #fffda2,
    #baffb4
  );
  animation: rotate 3s infinite linear;
}

#nav > .container > span.logo::after {
  content: "";
  position: absolute;
  top: -29px;
  left: -42px;
  height: 108px;
  width: 108px;
  border-radius: 50%;
  background-color: #2c3e50;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.userinfo {
  position: relative;
  cursor: pointer;
  border-radius: 3px;
  place-self: start;
  top: 4px;
  right: 16px;
  margin-left: auto;
  transition: all 0.4s ease, background-color 0.3s ease 0.25s;
  white-space: nowrap;
  z-index: 11;
  flex-shrink: 0;
}

.userinfo:hover {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.4s ease;
}
.userinfo:hover > .userInfo_hover_layer {
  max-height: var(--height);
}

.userinfo:hover > .userInfo_hover_layer.small {
  max-width: var(--width);
  transition: all 0.4s ease, max-width 0.3s ease, max-height 0.3s ease 0.1s;
}

.userInfo_hover_layer.small {
  transition: all 0.4s ease, max-width 0.3s ease 0.1s, max-height 0.3s ease;
}

.userinfo > .textContainer {
  display: inline-block;
  vertical-align: middle;
  margin: 0 0 0 12px;
  color: white;
  transition: all 0.4s ease, color 0.3s ease 0.25s;
}

.userinfo:hover > .textContainer {
  color: #2c3e50;
  transition: all 0.4s ease;
}

.userinfo > .textContainer.hide {
  display: none;
}

.userinfo > .textContainer.hide + img {
  margin: 4px 6px;
}

.userinfo > img {
  display: inline-block;
  vertical-align: middle;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin: 4px 6px 4px 12px;
  background-image: url("../assets/transparent.png");
}

.userinfo > .textContainer > .nickname {
  display: block;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-align: right;
  padding-bottom: 0.5px;
}

.userinfo > .textContainer > .mail {
  display: block;
  white-space: nowrap;
  font-size: 12px;
  text-align: right;
  padding-top: 0.5px;
  font-weight: 400;
}

.userInfo_hover_layer {
  position: relative;
  background-color: transparent;
  color: white;
  padding: 4px 6px 0 6px;
  transition: all 0.4s ease;
  max-height: var(--collapse_height);
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 3px;
}

.userInfo_hover_layer.small {
  max-width: var(--collapse_width);
}

.userInfo_hover_layer.noanimation {
  transition: none !important;
  opacity: 0;
  visibility: hidden;
}

.userinfo:hover > .userInfo_hover_layer.noanimation {
  max-height: var(--collapse_height);
}

.userinfo:hover > .userInfo_hover_layer.noanimation.small {
  max-width: var(--collapse_width);
}

.userInfo_hover_layer > .item {
  display: block;
  padding: 12px 10px;
  margin: 6px 0;
  font-size: 16px;
  border-radius: 6px;
  text-align: center;
  transition: all 0.4s ease;
  cursor: pointer;
  text-decoration: none;
  color: #2c3e50;
  white-space: nowrap;
}

.userInfo_hover_layer > .item:hover {
  background-color: #2c3e50;
  color: white;
}

.userInfo_hover_layer > .item > svg {
  margin: 0 12px 0 0;
  width: 24px;
}

.search {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px 12px 8px 0;
}

.search > input[type="checkbox"] {
  display: inline-block;
  appearance: none;
  position: relative;
  width: 32px;
  height: 32px;
  margin: 0;
  vertical-align: middle;
  background-image: url("../assets/leo.png");
  background-size: 28px 28px;
  background-position: 2px 2px;
  background-repeat: no-repeat;
  cursor: pointer;
  border-radius: 6px 0 0 6px;
}

.search > input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  background-color: rgb(0, 0, 0, 0.4);
  z-index: -1;
  border-radius: 6px 0 0 6px;
}

.search > input[type="checkbox"]::after {
  content: "狮子座";
  font-family: Roboto, "Noto Sans SC", sans-serif;
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  text-align: center;
  color: white;
  background-color: #263341;
  border-radius: 3px;
  padding: 3px 0;
  z-index: 10;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
}

.search > input[type="checkbox"]:hover::after {
  opacity: 1;
  visibility: visible;
}

.search > input[type="checkbox"]:checked {
  background-image: url("../assets/gemini.png");
}

.search > input[type="checkbox"]:checked::after {
  content: "双子座";
}

.search > input[type="text"] {
  font-family: Roboto, "Noto Sans SC", sans-serif;
  font-weight: 500;
  appearance: none;
  border: none;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 0 6px 6px 0;
  color: white;
  padding: 12px 12px 12px 12px;
  width: calc(100% - 32px - 12px);
  height: 100%;
  font-size: 14px;
  transition: all 0.3s ease;
  vertical-align: middle;
}

.search > input[type="text"]::placeholder {
  position: relative;
  left: calc(50% - 15px);
  transition: all 0.3s ease;
}

.search > input[type="text"]:focus {
  outline: none;
  background-color: rgba(0, 0, 0, 0.6);
}

.search > input[type="text"]:focus::placeholder {
  position: relative;
  left: 0%;
}
</style>
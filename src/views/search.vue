<template>
  <div id="root">
    <card style="text-align: center" v-if="results.length === 0">
      <a>{{ this.pending ? "正在搜索..." : "无结果" }}</a>
    </card>
    <div
      v-for="(result, key) of results"
      :key="key"
      :style="{
        '--height': `${36 + 24 * result[1].length}px`,
      }"
      class="result"
      :class="{ expanded: result[2] }"
    >
      <span
        class="title"
        :class="{ clickable: result[1].length > 3 }"
        @click="result[2] = !result[2]"
      >
        {{ result[0] }} ({{ result[1].length }} 个结果)
        <font-awesome-icon
          size="1x"
          :icon="['fas', 'angle-down']"
          class="expand-button"
          :class="{ reverse: result[2] }"
          v-if="result[1].length > 3"
        />
      </span>
      <div class="item" v-for="(item, key2) of result[1]" :key="key2">
        <span class="price">
          <font-awesome-icon size="1x" :icon="['fas', 'coins']" />
          {{ item.such }}
        </span>
        <span class="market">
          <font-awesome-icon size="1x" :icon="['fas', 'warehouse']" />
          超市: <span>{{ item.supername }}</span>
        </span>
        <span class="house">
          <font-awesome-icon size="1x" :icon="['fas', 'map-marker-alt']" />
          场景: <span>{{ item.housename }}</span>
        </span>
        <span class="path">
          <font-awesome-icon size="1x" :icon="['fas', 'sign']" />
          路径: <span>{{ item.source }}</span>
        </span>
        <div class="action">
          <span @click="jump(item.source)">跳转</span>
          <span @click="copy(item.source)">复制</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import crypto from "crypto";
import { ipcRenderer, clipboard } from "electron";
import { get_query_arg, similarity } from "../../utils/tools.js";
import card from "../components/card.vue";

export default {
  name: "search",
  watch: {
    $route(to) {
      if (to.path === "/search") this.search();
    },
  },
  components: {
    card,
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      this.results = [];
      this.query = get_query_arg("query");
      console.log(get_query_arg("con"));
      if (!this.query) return;
      this.pending = true;
      document.title = `搜索: ${this.query}`;
      let form = new FormData();
      form.append("name", this.query);
      console.log(get_query_arg("query"));
      form.append("con", get_query_arg("con"));
      axios({
        url: "http://leeuu.hsk163.cn/leeuu_api/selectsupda.ashx?ver=1.7",
        method: "POST",
        data: `name=${encodeURIComponent(this.query)}&con=${get_query_arg(
          "con"
        )}`,
        headers: {
          "Content-Type": `application/x-www-form-urlencoded`,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
          Expect: "100-continue",
        },
      })
        .then((res) => {
          // Delete the last character of the string
          let result_encrypted = res.data.slice(0, -1);
          let result = this.decrypt(
            result_encrypted,
            "e6k0ca62d1543926",
            "e6t0c543926a62d1"
          );
          // Parse the result
          try {
            result = JSON.parse(result);
          } catch (e) {
            console.log(`解析失败：${result}`);
          }
          // Filter out hsk163
          result = result.filter((item) => {
            return !item[0].includes("hsk163");
          });
          // Sort by similarity
          result.sort((a, b) => {
            return similarity(b[0], this.query) - similarity(a[0], this.query);
          });
          result = result.map((item) => {
            // Add custom key for expand
            item[2] = false;
            item[1] = item[1].map((item2) => {
              // split price with 3 grouped digits
              item2.such = item2.such.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
              return item2;
            });
            return item;
          });
          // Change title
          document.title = `${document.title} (${
            result.length
          } 个物品，${result.reduce((a, b) => a + b[1].length, 0)} 个结果)`;
          this.results = result;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.pending = false;
        });
    },
    decrypt: (encrypted, key, iv) => {
      const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
      let decrypted = decipher.update(encrypted, "base64", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    },
    jump: function (path) {
      ipcRenderer.send("jump_to_path", path);
    },
    copy: function (path) {
      clipboard.writeText(path);
    },
  },
  data() {
    return {
      pending: false,
      query: "默认物品",
      results: [],
    };
  },
};
</script>

<style scoped>
.result {
  position: relative;
  width: 100%;
  max-height: calc(36px + 3 * 24px);
  background-color: white;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.result:hover {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.result:last-child {
  margin-bottom: 0;
}

.result.expanded {
  max-height: var(--height);
}

.result > .title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 6px 6px;
}

.result > .title:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.result > .title.clickable {
  cursor: pointer;
}

.result > .title > .expand-button {
  position: absolute;
  right: 12px;
  top: 10px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  transform: rotate(360deg);
}

.result > .title > .expand-button.reverse {
  transform: rotate(180deg);
}

.result > .item {
  display: grid;
  position: relative;
  height: 24px;
  text-align: left;
  white-space: nowrap;
  font-size: 12px;
  overflow: hidden;
  align-items: center;
  grid-template-columns: 92px 100px 148px calc(100% - 404px) 64px;
  padding: 0 6px;
  transition: all 0.3s ease;
}

.result > .item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.result > .item > * {
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 6px 0 0;
  user-select: none;
}

.result > .item > *:last-child {
  margin: 0;
}

.result > .item > * > span {
  color: rgba(0, 0, 0, 0.6);
  user-select: all;
}

.result > .item > .price {
  padding: 2px 0 0 0;
  min-width: 92px;
}

.result > .item > .market {
  flex-shrink: 0;
}

.result > .item > .action {
  display: grid;
  grid-template-columns: 32px 32px;
  flex-shrink: 0;
}

.result > .item > .action > * {
  display: block;
  position: relative;
  width: 32px;
  text-align: center;
  color: #333c83;
  cursor: pointer;
  user-select: none;
}
</style>
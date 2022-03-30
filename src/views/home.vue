<template>
  <card title="声明">
    <p>
      本程序为
      <a href="http://leeuu.hsk163.cn" target="_blank">浪漫庄园物价网</a>
      的山寨增强版，使用的数据源由其提供，作者不对数据的准确性做任何担保。
    </p>
    <p class="no-indent">
      增强功能如下：
      <ul>
          <li>搜索结果按相关度排序</li>
          <li>支持窗口置顶显示</li>
          <li>支持直接跳转至目标场景（仅匹配首个启动的浪漫庄园客户端）</li>
      </ul>
    </p>
    <p>
        BUG 反馈联系 QQ: <a href="http://wpa.qq.com/msgrd?v=3&uin=814537405&site=qq&menu=yes" target="_blank">814537405</a> 
    </p>
    <p>
        本程序经
        <a href="https://www.gnu.org/licenses/gpl-3.0.html">GPLv3</a>
        输送，使用时请务必遵守许可证。
        <a href="https://github.com/Runc2333/rc-pricing">仓库地址</a>
    </p>
  </card>
</template>

<script>
import card from "../components/card.vue";

export default {
  name: "Home",
  components: {
    card,
  },
};
</script>

<style scoped>
p:not(.no-indent) {
  text-indent: 2em;
}
</style>
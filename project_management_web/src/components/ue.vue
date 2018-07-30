<template>
  <div>
    <script id="ueid" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },

    },
    watch: {
      defaultMsg: function value(val, oldVal) {
        this.editor = UE.getEditor("ueid", this.config);
        if (val !== null) {
          this.editor.setContent(val);
        }
      },
    },
    mounted() {
      const _this = this;
      _this.editor = UE.getEditor("ueid", _this.config); // 初始化UE
      _this.editor.addListener("ready", function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>

// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    para: {
      type: String,
      value: ''
    },
    isFocus: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFocus() {
      this.setData({
        isFocus: true
      })
    },
    onBlur() {
      this.setData({
        isFocus: false
      })
    },
    onInput: function (e) {
      this.setData({
        para: e.detail.value
      })
    },
    onSearch() {
      console.log(this.data)
      this.triggerEvent('search', { para: this.data.para })
    },
    onCancle() {
      this.setData({
        para: ''
      })
      this.setData({
        isFocus: false
      })
    }, 
    onClear() {
      this.setData({
        isFocus: true,
        para: ''
      })
    }
  }
})

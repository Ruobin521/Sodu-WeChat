// components/options/options.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book: {
      type: Object,
      value: null,
    },
    isShelf: {
      type:Boolean,
      value:false
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
    hide() {
      this.setData({
        book: null
      })
    }
  }
})

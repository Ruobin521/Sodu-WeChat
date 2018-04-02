// components/bookitem/bookitem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      book: {        
        type: Object,
        value: null
      },
      title: {
        type: String,
        value: null
      },
      subTitle: {
        type: String,
        value: null
      },
      desc: {
        type: String,
        value: null
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
    navigateToChapter: function (e) {
      if (this.properties.book) {
        let b = this.properties.book
        wx.navigateTo({
          url: `../chapter_page/chapter_page?id=${b.bookId}&name=${b.bookName}`
        })
      }
    },
  }
})

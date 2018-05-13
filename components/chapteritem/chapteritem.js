// components/chapteritem/chapteritem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    catalog: {
      type: Object,
      value: null,
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
    navigateToReader: function (e) {
      if (this.properties.catalog) {
        let b = this.properties.catalog
        console.log(b)
        wx.navigateTo({
          url: `../reader_page/reader_page?id=${b.bookId}&name=${b.bookName}&url=${b.catalogUrl}&cname=${b.catalogName}`
        })
      }
    },
  }
})

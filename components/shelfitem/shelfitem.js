const currentBook = require('../../utils/currentBook.js')
import storage from '../../utils/shelfstorage.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book: {
      type: Object,
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
        currentBook.writeCurrentBook(b)
        this.triggerEvent('ItemClick', b)
        wx.navigateTo({
          url: `../chapter_page/chapter_page?id=${b.bookId}&name=${b.bookName}`
        })
      }
    },
  }
})

import storage from '../../utils/shelfstorage.js'
const url = require('../../utils/url.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    selectedBook: null
  },
  longpress(e) {
    this.setData({
      selectedBook: e.target.dataset.book
    })
  },
  refresh() {
    wx.showToast({
      title: '移除成功',
      icon: 'success',
      duration: 1000
    })
    this.getData()
  },
  getData() {
    let data = storage.getShelfBooks()
    this.setData({
      books: data
    })
    this.checkUpdate()
  },
  checkUpdate(func) {
    let that = this
    let data = [];
    for (var i = 0; i < this.data.books.length; i++) {
      var item = this.data.books[i]
      data.push({
        bookType: item.type,
        id: item.bookId,
        url: item.updatePageUrl
      })
    }
    wx.request({
      url: url.checkUpdate(),
      method: 'POST',
      data: { list: JSON.stringify(data) },
      success: function (res) {
        if (res.data.code == 0) {
          that.onCheckUpdata(res.data.data)
        } else {
          console.log(res)
        }
      },
      fail: function (err) {
        console.log(err)
      },
      complete: function () {
        func && func()
      }
    })
  },
  //事件处理函数
  navigateToChapter: function (data) {
    wx.navigateTo({
      url: '../chapter_page/chapter_page?bookid=a'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.checkUpdate(() => {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onCheckUpdata(list) {
    if (!list || list.length == 0) {
      return
    }

    let that = this
    list.forEach((item, index) => {
      var index = this.data.books.findIndex(p => {
        return p.bookId == item.bookId
      })
      if (index >= 0) {
        if (this.data.books[index].newestCatalogName != item.catalogName) {
          var chapterName = `books[${index}].newestCatalogName`
          var updateTime = `books[${index}].updateTime`
          var hasNew = `books[${index}].hasNew`
          that.setData({
            [chapterName]: item.catalogName,
            [updateTime]: item.updateTime,
            [hasNew]: true
          })
        }
      }
    })
    storage.UpdateBooks(this.data.books)
  },
  onItemClick(e) {
    var book = e.detail
    if (!book.hasNew) {
      return
    }
    var index = this.data.books.findIndex(p => {
      return p.bookId == book.bookId
    })

    if (index == -1) {
      return
    }
    book.hasNew = false
    var hasNew = `books[${index}].hasNew`
    this.setData({
      [hasNew]: false
    })
    storage.UpdateBook(book)
  }
})

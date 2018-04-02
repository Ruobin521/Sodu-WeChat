// pages/tab_rank/tab_rank.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    index: 1,
    isLoading: false,
    selectedBook: null
  },
  longpress(e) {
    this.setData({
      selectedBook:e.target.dataset.book
    })
  },
  toggleLoading: function (loading) {
    if (loading) {
      this.setData({
        isLoading: true
      })
      wx.showNavigationBarLoading();
    } else {
      this.setData({
        isLoading: false
      })
      wx.hideNavigationBarLoading();
    }
  },
  getDataByindex: function (pageIndex) {
    if (pageIndex > 8 || this.data.isLoading) { return }
    this.toggleLoading(true)
    var that = this
    wx.request({
      url: `https://sodu.ruobin521.com/rank?index=${pageIndex}`,
      success: function (res) {
        var result = res.data
        if (result.code == 0) {
          that.setData({
            books: pageIndex == 1 ? result.data : that.data.books.concat(result.data),
            index: pageIndex
          })
        } else {
          console.log(res.data)
        }
      },
      fail: function () {

      },
      complete: function () {
        that.toggleLoading(false)
        wx.setNavigationBarTitle({
          title: `排行 (${that.data.index}/8)`
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.books && this.books.length > 0) {
      return
    }
    this.getDataByindex(1)
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
    this.getDataByindex(1)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataByindex(this.data.index + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
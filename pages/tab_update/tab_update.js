// pages/tab_update/tab_update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    isLoading: false,
    showError: false
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
  getData() {
    if (this.data.isLoading) {
      return
    }
    this.toggleLoading(true)
    var that = this
    wx.request({
      url: 'https://sodu.ruobin521.com/update',
      success: function (res) {
        var result = res.data
        if (result.code == 0) {
          that.setData({
            books: result.data,
            showError: false
          })
        } else {
          console.log(res.data)
        }
      },
      fail: function (res) {
        if (that.data.books && that.data.books.length == 0) {
          that.setData({
            showError: true
          })
        }
      },
      complete(res) {
        that.toggleLoading(false)
      }
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
    if (this.data.isLoading) {
      wx.showNavigationBarLoading();
    } else {
      wx.hideNavigationBarLoading();
    }
    
    if (this.data.books && this.data.books.length > 0) {
      return
    }
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
    this.getData()
    wx.stopPullDownRefresh()
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

  }
})
// pages/chapter_page/chapter_page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapters: [],
    index: 1,
    bookId:'',
    bookName: '',
    index: 1,
    isLoading: false,
    totalPage:1,
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
  getDataByIndex: function (index) {
    if(index > this.data.totalPage || this.data.isLoading) {
      return
    }
    this.toggleLoading(true)
    var that = this
    wx.request({
      url: `https://sodu.ruobin521.com/chapter?id=${that.data.bookId}&name=${that.data.bookName}&index=${index}`,
      success: function (res) {
        var result = res.data
        if (result.code == 0) {
          that.setData({
            chapters: index == 1 ? result.data : that.data.chapters.concat(result.data),
            index: index,
            totalPage: result.totalPage,
            showError: false
          })
        } else {
          console.log(res.data)
        }
      },
      fail:function() {
        if (that.data.chapters && that.data.chapters.length == 0) {
          that.setData({
            showError: true
          })
        }
      },
      complete:function() {
        that.toggleLoading(false)
        if (getCurrentPages()[getCurrentPages().length - 1].route.indexOf('chapter_page') == -1) {
          return
        }
        wx.setNavigationBarTitle({
          title: `${that.data.bookName} (${that.data.index}/${that.data.totalPage})`
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.bookId = options.id
    this.data.bookName = options.name
    this.getDataByIndex(this.data.index)
    var that = this
    wx.setNavigationBarTitle({
      title: that.data.bookName
    })
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
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getDataByIndex(this.data.index + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
Page({
  data: {
    books: [],
    isLoading: false,
    para: '',
    isNoResult:false
  },
  toggleLoading: function (loading) {
    var that = this
    if (loading) {
      this.setData({
        isNoResult: false,
        isLoading: true
      })
      wx.showNavigationBarLoading();
    } else {
      this.setData({
        isNoResult: that.data.books.length > 0 ? false : true,
        isLoading: false
      })
      wx.hideNavigationBarLoading();
    }
  },

  goSearch: function (e) {
    if (e.detail.para && e.detail.para.trim()) {
      this.getData(e.detail.para)
    }
  },
  getData: function (para) {
    if (this.data.isLoading) { return }
    this.toggleLoading(true)
    var that = this
    wx.request({
      url: `https://sodu.ruobin521.com/search?para=${para}`,
      success: function (res) {
        var result = res.data
        console.log(result)
        if (result.code == 0) {
          that.setData({
            books: result.data
          })
        } else {
          that.setData({
            books: []
          })
        }
      },
      fail: function () {

      },
      complete: function () {
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
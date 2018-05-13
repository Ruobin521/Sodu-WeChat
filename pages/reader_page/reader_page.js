// pages/reader_page/reader_page.js
var url = require('../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSettingPanel: false,
    showMenu: false,
    isLoading:false,
    currentCatalog: null,
    bookName: '',
    bookId: '',
  },
  catchEmptyTap(e) {
    return;
  },
  toggleMenu: function (e) {
    let that = this
    this.setData({
      showMenu: !that.data.showMenu
    })
  },                          
  toggleSettingPanel(e) {
    let that = this
    this.setData({
      showSettingPanel: !that.data.showSettingPanel
    })
  },
  catalogSwitch: function (e) {
    console.log(e.currentTarget.dataset.type)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentCatalog: {
        bookName: options.name ? options.name : '',
        bookId: options.id ? options.id : '',
        catalogName: options.cname ? options.cname : '',
        catalogUrl: options.url ? options.url : ''
      }
    })
    wx.setNavigationBarTitle({
      title: options.name ? options.name : '小说搜索阅读'
    })
    this.getHtmlByCatalog(this.data.currentCatalog)
  },
   
   getHtmlByCatalog(catalog) {
     this.setData({
       currentCatalog: catalog,
       isLoading:true
     })
     let that = this
     wx.request({
       url: url.content(),
       method: 'POST',
       data: {
         url: catalog.catalogUrl,
         id: catalog.bookId
       }, success: function (res) {
         if (res.data.code == 0) {
           that.setData({
             currentCatalog: Object.assign({}, that.data.currentCatalog, {
               content: res.data.data
             })
           })
         } else {
           console.log(res)
         }
       },
       fail: function (err) {
console.log(err)
       },
       complete: function () {
         that.setData({
           isLoading: false
         })
       }
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
    wx.setNavigationBarColor({
      backgroundColor: "#aac5aa",
      frontColor: '#000000'
    })
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
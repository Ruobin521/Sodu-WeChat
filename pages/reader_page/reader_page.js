// pages/reader_page/reader_page.js
const url = require('../../utils/url.js')
const setting = require('../../utils/settingStorage.js')
const constant = require('../../utils/constant.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // showSettingPanel: false,
    animationClass: '',
    animationNavClass: '',
    animationAddBtnClass: '',
    isLoading: false,
    currentCatalog: null,
    book:null,
    bookName: '',
    bookId: '',
    light:0,
    pageStyle: null,
    colors:constant.colors
  },
  catchEmptyTap(e) {
    return;
  },
  toggleMenu: function (e) {
    let that = this
    let isShow = that.data.showSettingPanel
    this.setData({
      showSettingPanel: !that.data.showSettingPanel,
      animationClass: isShow ? 'hidePanel' : 'showPanel',
      animationNavClass: isShow ? 'hideNav' : 'showNav',
      animationAddBtnClass: isShow ? 'showAddBtn' : 'hideAddBtn',
    })
  },
  scroll(e) {
    if (this.data.showSettingPanel) {
      this.toggleMenu()
    }
  },
  catalogSwitch: function (e) {
    console.log(e.currentTarget.dataset.type)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadSettingStorage()
    this.setData({
      currentCatalog: {
        bookName: options.name ? options.name : '',
        bookId: options.id ? options.id : '',
        catalogName: options.cname ? options.cname : '',
        catalogUrl: options.url ? options.url : ''
      },
      book: {
        bookName: options.name ? options.name : '',
        bookId: options.id ? options.id : '',
        bookType: options.type ? options.type : '1'
      }
    })
    wx.setNavigationBarTitle({
      title: options.name ? options.name : '小说搜索阅读'
    })
    this.getHtmlByCatalog(this.data.currentCatalog)
  },
  loadSettingStorage() {
    let that = this
    
    var settings = setting.readReaderSetting()

    if (!settings) {
      settings = constant.defaultStyle
    }
    this.setData({
      pageStyle: settings
    })
    wx.setNavigationBarColor({
      backgroundColor: settings.background,
      frontColor: settings.background === '#0C0C0C' ? "#ffffff" : '#000000'
    })

    wx.getScreenBrightness({
      success(result) {
        that.setData({
           light:result.value * 100
        })
      },
    })
  },
  getHtmlByCatalog(catalog) {
    this.setData({
      currentCatalog: catalog,
      isLoading: true
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

  },
  settingEvent(e) {
    let that = this
    let event = e.currentTarget.dataset.event
    console.log(event)
    switch (event) {
      case 'fontAdd':
        that.fontSize(true)
        break;
      case 'fontMint':
        that.fontSize(false)
        break;
      case 'color':
        that.bgColor(e)
        break;
      case 'light':
        that.light(e)
        break;
      default:
        break;
    }
    setting.writeReaderSetting(this.data.pageStyle)
  },
  fontSize(isAdd) {
    let that = this
    let fontsize = that.data.pageStyle.fontSize
    let lineheight = that.data.pageStyle.lineHeight
    if (isAdd && fontsize >= 60) {
      return
    }
    if (!isAdd && fontsize <= 30) {
      return
    }
    this.setData({
      pageStyle: Object.assign({}, that.data.pageStyle, { fontSize: isAdd ? fontsize + 2 : fontsize - 2, lineHeight: isAdd ? lineheight + 2 : lineheight - 2 })
    })
  },
  bgColor(e) {
    let that = this
    let color = e.currentTarget.dataset.color
    this.setData({
      pageStyle: Object.assign({}, that.data.pageStyle, { background: color.backColor, color: color.fontColor })
    })

    wx.setNavigationBarColor({
      backgroundColor: color.backColor,
      frontColor: color.backColor === '#0C0C0C' ? "#ffffff" : '#000000'
    })
  },
  light(e) {
    wx.setScreenBrightness({
      value: e.detail.value / 100
    })
  }
})
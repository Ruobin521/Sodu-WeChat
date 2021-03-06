// pages/reader_page/reader_page.js
const url = require('../../utils/url.js')
const setting = require('../../storage/settingStorage.js')
const constant = require('../../utils/constant.js')
const storage = require('../../storage/shelfstorage.js')
const currentBook = require('../../storage/currentBook.js')
const catalogStorage = require('../../storage/catalogs.js')
const addBookText = '加入书架'
const removeBookText = '移出书架'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSettingPanel: false,
    animationSettingClass: '',
    animationAddBtnClass: '',
    animationCatalogsClass: '',
    catalogData: null,
    isLoading: false,
    shelfText: '加入书架',
    currentCatalog: null,
    catalogPageIndex: 0,
    catalogPageCount: 0,
    book: null,
    light: 0,
    pageStyle: null,
    colors: constant.colors,
  },
  catchEmptyTap(e) {
    return;
  },
  toggleMenu: function (e) {
    let isShow = (this.data.animationSettingClass == 'showPanel')
    let that = this
    this.setData({
      showSettingPanel: !that.data.showSettingPanel,
      animationSettingClass: isShow ? 'hidePanel' : 'showPanel',
      animationAddBtnClass: isShow ? 'showAddBtn' : 'hideAddBtn',
    })
  },
  toggleCatalogs(isShow) {
    if (!this.data.catalogData) {
      wx.showToast({
        title: '数据获取中',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      animationCatalogsClass: isShow ? 'showCatalogs' : 'hideCatalogs',
    })

    if ((this.data.animationSettingClass == 'showPanel')) {
      this.toggleMenu()
    }
  },

  scroll(e) {
    if ((this.data.animationSettingClass == 'showPanel')) {
      this.toggleMenu()
    }
  },
  catalogSwitch: function (e) {
    let index = e.currentTarget.dataset.type
    let that = this
    //目录
    if (index == 0) {
      this.toggleCatalogs(true)
    }
    //上一章
    if (index == -1) {
      if (this.data.currentCatalog.index == -1 || this.data.currentCatalog.index == 0) {
        this.toggleCatalogs(true)
        return

      }
      let catalogs = catalogStorage.getAllCatalogs()

      let catalog = catalogs[this.data.currentCatalog.index - 1]
      let currenCatalog = this.data.currentCatalog
      let temp = {
        index: catalog.index,
        bookName: currenCatalog.bookName,
        bookId: currenCatalog.bookId,
        catalogName: catalog.catalogName,
        catalogUrl: catalog.catalogUrl
      }

      if (catalog.content) {
        temp.content = catalog.content
        this.setData({
          currentCatalog: temp,
        })
        return
      }
      this.getHtmlByCatalog(temp)
    }

    //下一章
    if (index == 1) {
      let catalogs = catalogStorage.getAllCatalogs()

      if (this.data.currentCatalog.index == -1 || this.data.currentCatalog.index == catalogs.length - 1) {
        this.toggleCatalogs(true)
        return
      }

      let catalog = catalogs[this.data.currentCatalog.index + 1]
      let currenCatalog = this.data.currentCatalog
      let temp = {
        index: catalog.index,
        bookName: currenCatalog.bookName,
        bookId: currenCatalog.bookId,
        catalogName: catalog.catalogName,
        catalogUrl: catalog.catalogUrl
      }
      if (catalog.content) {
        temp.content = catalog.content
        this.setData({
          currentCatalog: temp,
        })
        return
      }
      this.getHtmlByCatalog(temp)
    }
    //更新源
    if (index == 2) {
      wx.redirectTo({
        url: `../chapter_page/chapter_page?id=${that.data.book.bookId}&name=${that.data.book.bookName}`
      })
    }
  },
  catalogItemClick(e) {
    this.toggleCatalogs(false)
    let catalog = Object.assign({}, this.data.currentCatalog, e.detail)
    this.getHtmlByCatalog(catalog)
  },
  catalogsPrePage() {
    if (this.data.catalogPageIndex <= 0) {
      return
    }
    this.getCatalogsByIndex(this.data.catalogPageIndex - 1)
  },
  catalogsNextPage() {
    if (this.data.catalogPageIndex >= this.data.catalogPageCount - 1) {
      return
    }
    this.getCatalogsByIndex(this.data.catalogPageIndex + 1)
  },

  catalogsLastPage() {
    if (this.data.catalogPageIndex >= this.data.catalogPageCount - 1) {
      return
    }
    this.getCatalogsByIndex(this.data.catalogPageCount - 1)
  },
  catalogsFirstPage() {
    if (this.data.catalogPageIndex == 0) {
      return
    }
    this.getCatalogsByIndex(0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadSettingStorage()
    this.setData({
      book: currentBook.getCurrentBook()
    })

    if (options.type == '0') {
      this.setData({
        currentCatalog: {
          index: -1,
          bookName: options.name ? options.name : '',
          bookId: options.id ? options.id : '',
          catalogName: options.cname ? options.cname : '',
          catalogUrl: options.url ? options.url : ''
        }
      })
      this.getHtmlByCatalog(this.data.currentCatalog)
      this.getBookCatalogs(this.data.currentCatalog.catalogUrl)
    }

    if (options.type == '1') {
      this.setData({
        isLoading: true,
        currentCatalog: {
          index: -1,
          bookName: options.name ? options.name : '',
          bookId: options.id ? options.id : '',
          catalogName: options.cname ? options.cname : '',
          catalogUrl: options.url ? options.url : ''
        }
      })
      this.getBookCatalogs(options.url, true)
    }

    wx.setNavigationBarTitle({
      title: options.name ? options.name : '小说搜索阅读'
    })

  },
  loadSettingStorage() {
    let that = this

    let settings = setting.readReaderSetting()

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
          light: result.value * 100
        })
      },
    })
  },
  getHtmlByCatalog(catalog) {
    this.setData({
      currentCatalog: catalog,
      isLoading: true
    })
    let ustr1 = 'book.lastReadCatalogName'
    let ustr2 = 'book.lastReadCatalogUrl'
    this.setData({
      [ustr1]: catalog.catalogName,
      [ustr2]: catalog.catalogUrl
    })
    currentBook.updateBook(this.data.book)
    let inShelf = storage.checkExist(this.data.book.bookId)
    if (inShelf) {
      storage.UpdateBook(this.data.book)
    }
    let that = this
    wx.request({
      url: url.content(),
      method: 'POST',
      data: {
        url: catalog.catalogUrl,
        id: catalog.bookId
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            currentCatalog: Object.assign({}, that.data.currentCatalog, {
              content: res.data.data
            })
          })

          if (!that.data.catalogData) {
            return
          }
          let index = that.data.catalogData.catalogs.findIndex(p => {
            return p.catalogUrl == that.data.currentCatalog.catalogUrl
          })

          if (index > -1) {
            that.data.catalogData.catalogs[index].content = res.data.data
          }

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

  getBookCatalogs(ctalogurl, autoLoadFirst) {
    let that = this
    wx.request({
      url: url.catalogs(),
      method: 'POST',
      data: {
        url: ctalogurl,
        id: this.data.book.bookId,
        isDirct: autoLoadFirst ? 1 : 0
      },
      success: function (res) {
        if (res.data.code == 0) {
          var catalogs = res.data.data.catalogs
          that.setCurrentCatalogIndex(catalogs)
          res.data.data.catalogs = null
          that.setData({
            catalogData: res.data.data
          })
          that.saveCatalogs(catalogs)

          if (autoLoadFirst) {
            let catalog = Object.assign({}, that.data.currentCatalog, catalogs[0])
            that.getHtmlByCatalog(catalog)
          }
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
  saveCatalogs(data) {
    catalogStorage.writeCatalogs(data)
    this.setData({
      catalogPageCount: Math.ceil(data.length / 150)
    })
    this.getCatalogsByIndex(this.data.catalogPageIndex)
  },
  getCatalogsByIndex(index) {
    console.log(index)
    var catalogs = catalogStorage.getCatalogs(index)
    if (!catalogs) {
      return
    }
    var str = 'catalogData.catalogs'
    this.setData({
      [str]: catalogs,
      catalogPageIndex: index
    })
  },
  setCurrentCatalogIndex(catalogs) {
    let index = catalogs.findIndex(p => {
      return p.catalogUrl == this.data.currentCatalog.catalogUrl
    })
    if (index > -1) {
      this.data.currentCatalog.index = index
    }
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

    let inShelf = storage.checkExist(this.data.book.bookId)
    this.setData({
      shelfText: inShelf ? removeBookText : addBookText
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
    catalogStorage.clearCatalogs()
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
  addToShelf() {
    if (this.data.shelfText == addBookText) {
      storage.addBook(this.data.book)
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
      })
      this.setData({
        shelfText: removeBookText
      })
    } else {
      storage.removeBook(this.data.book.bookId)
      wx.showToast({
        title: '移出成功',
        icon: 'success',
        duration: 1000
      })
      this.setData({
        shelfText: addBookText
      })
    }
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
      pageStyle: Object.assign({}, that.data.pageStyle, {
        fontSize: isAdd ? fontsize + 2 : fontsize - 2,
        lineHeight: isAdd ? lineheight + 2 : lineheight - 2
      })
    })
  },
  bgColor(e) {
    let that = this
    let color = e.currentTarget.dataset.color
    this.setData({
      pageStyle: Object.assign({}, that.data.pageStyle, {
        background: color.backColor,
        color: color.fontColor
      })
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
import storage from '../../storage/shelfstorage.js'
const url = require('../../utils/url.js')
const currentBook = require('../../utils/currentBook.js')
const setting = require('../../storage/settingStorage.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    selectedBook: null,
    isEditMode: false,
    isSelectAll: false,
    isLoading: false
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
    this.setEditMode(false)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setEditMode(false)
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
    if (this.data.isLoading || !this.data.books || this.data.books.length == 0) {
      func && func()
      return
    }
    this.setData({
      isLoading: true
    })
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
        that.setData({
          isLoading: false
        })
        func && func()
      }
    })
  },
  navigateToChapter: function (e) {
    let b = e.currentTarget.dataset.book
 
    let index = e.currentTarget.dataset.index
    if (b.isEdit) {
      let str = `books[${index}].isChecked`
      this.setData({
        [str]: b.isChecked ? false : true
      })
      return;
    }

    this.setHadRead(b)
    currentBook.writeCurrentBook(b)
    let directRead = setting.readTabSetting() &&  setting.readTabSetting().directRead

    if (directRead && b.lastReadCatalogUrl && b.lastReadCatalogUrl != '') {
      wx.navigateTo({
        url: `../reader_page/reader_page?id=${b.bookId}&name=${b.bookName}&url=${b.lastReadCatalogUrl}&cname=${b.lastReadCatalogName}&type=0`
      })
    } else {
      wx.navigateTo({
        url: `../chapter_page/chapter_page?id=${b.bookId}&name=${b.bookName}`
      })
    }
  },

  // var ustr1 = 'book.lastReadCatalogName'
  //   var ustr2 = 'book.lastReadCatalogUrl'
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
  setHadRead(book) {
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
  },
  ToggleEditor() {
    let isEdit = this.data.isEditMode;
    this.setEditMode(!isEdit)
  },
  setEditMode(isEdit) {
    this.setData({
      isEditMode: isEdit,
      isSelectAll: false
    })

    if (isEdit) {
      this.setData({
        isEditMode: isEdit
      })
    }
    this.data.books.forEach((element, index) => {
      let str = `books[${index}].isEdit`
      let str2 = `books[${index}].isChecked`
      this.setData({
        [str]: isEdit
      })
      if (!isEdit) {
        this.setData({
          [str2]: false
        })
      }
    })
  },
  selectAll() {
    if (!this.data.isEditMode || !this.data.books || this.data.books.length == 0) {
      return
    }
    let that = this
    console.log(this.data.isSelectAll)
    this.data.books.forEach((element, index) => {
      let str = `books[${index}].isChecked`
      this.setData({
        [str]: !that.data.isSelectAll,
      })
    })
    this.setData({
      isSelectAll: !that.data.isSelectAll
    })
  },
  setSelectedHadRead() {
    if (!this.data.isEditMode || !this.data.books || this.data.books.length == 0) {
      return
    }

    let hasSelected = false;
    this.data.books.forEach((element, index) => {
      if (element.isChecked) {
        hasSelected = true;
        this.setHadRead(element)
      }
    })
    if (hasSelected) {
      this.setEditMode(false)
    } else {
      wx.showToast({
        title: '请选择操作项',
        icon: 'none',
        duration: 2000
      })
    }
  },
  removeSelected() {
    if (!this.data.isEditMode || !this.data.books || this.data.books.length == 0) {
      return
    }

    let that = this
    let hasSelected = false;

    wx.showModal({
      title: '删除提示',
      content: '移出后将无法恢复，确认移出书架？',
      success: function (res) {
        if (res.confirm) {
          that.data.books.forEach((element, index) => {
            if (element.isChecked) {
              hasSelected = true;
              storage.removeBook(element.bookId)
            }
          })

          if (hasSelected) {
            that.getData()
            that.setEditMode(false)
          } else {
            wx.showToast({
              title: '请选择操作项',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })


  }
})

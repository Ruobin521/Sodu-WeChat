const key = 'bookshelf'

function addBook(book) {
  var obj = getBooks()

  var item = Object.assign({ time: new Date() }, { data: book })
  onj[book.bookId] = item

  wx.setStorage({
    key: key,
    data: obj
  })
}

function getBooks() {
  wx.getStorage({
    key: 'bookshelf',
    success: function (res) {
      return res.data
    },
    fail(res) {
      return {}
    }
  })
}

function removeBook(book) {
  var obj = getShlefs()
  delete obj[book.bookId]
}

module.exprots = {
  addBook,
  removeBook,
  getBooks
}
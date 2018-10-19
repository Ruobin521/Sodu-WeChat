const key = 'bookshelf'

function addBook(book) {
  var obj = getBooksObj()

  if (Object.keys(obj).length >= 30) {
    wx.showToast({
      title: '由于存储空间限制，最多添加30本至书架',
      icon: 'none',
      duration: 2000
    })
    return
  }

  var item = Object.assign({
    time: (+new Date())
  }, {
    data: book
  })
  obj[book.bookId] = item

  wx.setStorage({
    key: key,
    data: obj
  })
}

function removeBook(bookid) {
  var obj = getBooksObj()
  delete obj[bookid]
  wx.setStorageSync(key, obj)
}

function getBooksObj() {
  let data = wx.getStorageSync(key)

  if (!data) {
    return {}
  } else {
    return data
  }
}

function getShelfBooks() {
  var obj = getBooksObj()
  let items = []
  let books = []
  for (var item in obj) {
    items.push(obj[item])
  }
  items.sort((a, b) => {
    return parseInt(b.time) - parseInt(a.time)
  })

  for (var b in items) {
    books.push(items[b].data)
  }
  return books
}

function checkExist(id) {
  let result = false
  let books = getShelfBooks()
  if (!books || books.length == 0) {
    return false
  }
  books.forEach((item, index) => {
    if (item.bookId == id) {
      result = true
    }
  })
  return result
}

function UpdateBooks(books) {
  var obj = getBooksObj()
  books.forEach(element => {
    var item = Object.assign({
      time: obj[element.bookId].time
    }, {
      data: element
    })
    obj[element.bookId] = item
  })
  wx.setStorageSync(key, obj)
}

function UpdateBook(book, isTimeUpdate = true) {
  var obj = getBooksObj()
  var item = Object.assign({
    time: isTimeUpdate ? (+new Date()) : obj.time
  }, {
    data: book
  })
  obj[book.bookId] = item
  wx.setStorageSync(key, obj)
}


module.exports = {
  addBook,
  removeBook,
  getShelfBooks,
  checkExist,
  UpdateBooks,
  UpdateBook
}
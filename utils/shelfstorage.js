
const key = 'bookshelf'

function addBook(book) {
  var obj = getBooksObj()
  var item = Object.assign({ time: (+ new Date()) }, { data: book })
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

module.exports = {
  addBook,
  removeBook,
  getShelfBooks
}
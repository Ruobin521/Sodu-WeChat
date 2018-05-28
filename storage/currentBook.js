
const key = 'currentbook'

function writeCurrentBook(book) {
  wx.setStorageSync(key, book)
}

function updateBook(book) {
  wx.removeStorageSync(key)
  wx.setStorageSync(key, book)
}


function getCurrentBook() {
  let data = wx.getStorageSync(key)
  if (!data) {
    return null
  } else {
    return data
  }
}

module.exports = {
  writeCurrentBook,
  getCurrentBook,
  updateBook
}
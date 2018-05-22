
const key = 'currentbook'

function writeCurrentBook(book) {
  wx.setStorage({
    key: key,
    data: book
  })
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
}
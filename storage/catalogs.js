
const key = 'currentCatalogs'

function writeCatalogs(catalogs) {
  wx.setStorageSync(key, catalogs)
}
function clearCatalogs() {
  wx.removeStorage({
    key: key,
    success: function (res) {
      console.log(res.data)
    }
  })
}

function getCatalogs(pageIndex, perPageCount = 150) {
  let data = wx.getStorageSync(key)
  if (!data) {
    return null
  } else {
    let catalogs = data.slice(pageIndex * perPageCount, pageIndex * perPageCount + perPageCount)
    return catalogs
  }
}

function getAllCatalogs() {
  let data = wx.getStorageSync(key)
  if (!data) {
    return null
  } else {
    return data
  }
}

module.exports = {
  writeCatalogs,
  getCatalogs,
  clearCatalogs,
  getAllCatalogs
}
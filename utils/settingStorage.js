
const key = 'sudo-reader'
const key2 = 'sudo-tab-setting'

function writeReaderSetting(settings) {
  wx.setStorage({
    key: key,
    data: settings
  })
}


function readReaderSetting() {
  let data = wx.getStorageSync(key)
  if (!data) {
    return null
  } else {
    return data
  }
}

function writeTabSetting(settings) {
  wx.setStorage({
    key: key2,
    data: settings
  })
}


function readTabSetting() {
  let data = wx.getStorageSync(key2)
  if (!data) {
    return null
  } else {
    return data
  }
}



module.exports = {
  writeReaderSetting,
  readReaderSetting,
  writeTabSetting,
  readTabSetting
}
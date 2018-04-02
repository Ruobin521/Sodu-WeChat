const toggleIndicator = function(isLoading) {

}


function getData(url,success,faild,complete) {
  wx.request({
    url: url,
    success: function (res) {
      success(res)
    },
    fail: function (res) {
      faild(res)
    },
    complete: function (res) {
      complete(res)
    }
  })
}
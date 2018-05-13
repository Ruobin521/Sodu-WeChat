
const url = {
  rank: function (index) {
    return `https://sodu.ruobin521.com/rank?index=${index}`
  },

  search: function (para) {
    return `https://sodu.ruobin521.com/search?para=${para}`
  },
  update: function () {
    return 'https://sodu.ruobin521.com/update'
  },

  content: function () {
    return 'https://sodu.ruobin521.com/content'
  }
}

module.exports = url



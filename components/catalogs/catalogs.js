// components/catalogs/catalogs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    background: {
      type: String,
      value: ''
    },
    catalogData: {
      type: Object,
      vale: {}
    },
    book: {
      type: Object,
      vale: {}
    },
    showClass: {
      type: String,
      value: ''
    },
    scrollTop: {
      type: Number,
      value: 0
    },
    pageIndex: {
      type: Number,
      value: 0
    },
    pageCount: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      // this.triggerEvent('hideCatalogs')
      this.setData({
        showClass: 'hideCatalogs'
      })
    },
    itemClick(e) {
      console.log(e)
      // let catalog = e
      var catalog = e.currentTarget.dataset.item
      this.triggerEvent('catalogItemClick', catalog)
    },
    toTop() {
      this.setData({
        scrollTop: 0
      })
    },
    toBottom() {
      if (!this.properties.catalogData || !this.properties.catalogData.catalogs) {
        return
      }
      let length = this.properties.catalogData.catalogs.length
      this.setData({
        scrollTop: 100 * length
      })
    },
    nextPage() {
      this.toTop()
      this.triggerEvent('nextPage')
    },
    prePage() {
      this.toTop()
      this.triggerEvent('prePage')
    },
    lastPage() {
      this.toTop()
      this.triggerEvent('lastPage')
    },
    firstPage() {
      this.toTop()
      this.triggerEvent('firstPage')
    }
  }
})

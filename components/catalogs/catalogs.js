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
      this.triggerEvent('catalogItemClick',catalog)
    }
  }
})

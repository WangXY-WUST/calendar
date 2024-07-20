const app = getApp()

Page({
  data: {
    visible: false,
    range:"",
    startTime:'',
    endTime:'',
    type:"range",// range-范围-单选
  },
  onLoad() {
  },
  getRange(e) {
    if (e.detail.data == "") {
      this.setData({
        range: "全部",
        startTime: "",
        endTime: ""
      })
    } else {
      this.setData({
        range: e.detail.data,
        startTime: e.detail.data.split("~")[0].trim(),
        endTime: e.detail.data.split("~")[1].trim(),
      })
    }
    this.close();
  },
  show() {
    this.setData({
      visible: true
    })
  },
  close() {
    this.setData({
      visible: false
    })
  },
  changeRadio(e) {
    this.setData({
      type: e.detail.value // 更新选中的value值到data中
    });
  }
})

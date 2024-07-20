// components/calendar/calendar.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
    },
    type: {
      type: String,
      value: "range"
    },
    bgColor: {
      type: String,
      value: '#FFF'
    },
    title: {
      type: String,
      value:"选择日期范围"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateList: [],//
    monthTranslate: {},
    showYear: 0,//展示的年
    showMonth: 0,//展示的月
    showDay: 0,//展示的日
    currentYear: 0, // 当前年
    currentMonth: 0, // 当前月
    startTimestamp: 0, // 开始的时间戳
    endTimestamp: 0, // 结束的时间戳
    showTimestamp: 0, // 当前时间戳
    startSelectYear: 0, // 开始选中的年
    startSelectMonth: 0, // 开始选中的月
    startSelectDay: 0, // 开始选中的日
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const startTimestamp = now.getTime();
      this.setData({
        currentYear: now.getFullYear(),
        currentMonth: now.getMonth() + 1,
        showTimestamp: startTimestamp,
        startTimestamp,
        endTimestamp: startTimestamp
      })
      this.getCurrentData()
      this.getDay()
    },
    // 获取当前日期，初始化使用
    getCurrentData() {
      const date = new Date()
      this.data.showYear = date.getFullYear()
      this.data.showMonth = date.getMonth() + 1
      this.data.showDay = date.getDate()
    },
    getDay() {
      const {
        showYear,
        showMonth,
        showDay
      } = this.data
      var firstDay = new Date(`${showYear}/${showMonth}/1`).getDay() // 获得每月1号是星期几
      console.log(firstDay)
      let days = new Date(showYear , showMonth , 0).getDate() // 获取当月多少天
      this.data.dateList = []
      for (let s = 1; s <= firstDay; s++) {
        this.data.dateList.push({
          label: '',
          timestamp: 0
        })
      }
      for (let i = 1; i <= days; i++) {
        this.data.dateList.push({
          label: i < 10 ? '0' + i : i.toString(),
          timestamp: new Date(`${showYear}/${showMonth}/${i}`).getTime()
        })
      }
      this.setData({
        dateList: this.data.dateList,
        showYear,
        showMonth
      })
      if (!this.data.startSelectYear) {
        this.data.startSelectYear = showYear
        this.data.startSelectMonth = showMonth
        this.data.startSelectDay = showDay
      }
    },
    // 点击选择
    selectDate(e) {
      const { date, tamp } = e.currentTarget.dataset
      console.log(tamp)
      if (!date) {
        return
      }
      const {
        showYear,
        showMonth,
        startSelectYear,
        startSelectMonth,
        startSelectDay,
        endTimestamp
      } = this.data
      const currentTimestamp = new Date(showYear, showMonth - 1, date).getTime() // 当前选中的时间戳
      if (this.data.type === 'single') { // 单选日期
        this.setData({
          startTimestamp: currentTimestamp,
          endTimestamp: currentTimestamp
        })
        return
      }
      const startTimestamp = new Date(startSelectYear, startSelectMonth - 1, startSelectDay * 1).getTime() // 已经选择的开始时间的时间戳
      if (this.data.startSelectYear == 0 || currentTimestamp < startTimestamp || (currentTimestamp > startTimestamp && currentTimestamp < endTimestamp)) {
        this.setData({
          startTimestamp: currentTimestamp,
          endTimestamp: this.data.endTimestamp >= currentTimestamp ? this.data.endTimestamp : currentTimestamp
        })
        this.data.startSelectYear = showYear
        this.data.startSelectMonth = showMonth
        this.data.startSelectDay = date
        if (currentTimestamp > startTimestamp && currentTimestamp < endTimestamp) { // 如果选择了开始和结束日期中间的日期，则初始化日期
          this.setData({
            endTimestamp: currentTimestamp
          })
        }
        return
      }
      // 再次点击结束,取消选择
      if (currentTimestamp == endTimestamp) {
        this.setData({
          endTimestamp: -1
        })
      }
      else {
        this.setData({
          endTimestamp: currentTimestamp // 结束的时间戳
        })
      }
    },
    // 获取上个月
    getLastMonth() {
      if (this.data.showMonth !== 1) {
        this.data.showMonth -= 1
      } else {
        this.data.showMonth = 12
        this.data.showYear -= 1
      }
      this.getDay()
    },
    getNextMonth() {
      if (this.data.showMonth < 12) {
        this.data.showMonth += 1
      } else {
        this.data.showMonth = 1
        this.data.showYear += 1
      }
      this.getDay()
    },
    handleConfirm() {
      let data
      if(this.data.startTimestamp == -1 && this.data.endTimestamp == -1) {
        data = ""
      }else if(this.data.startTimestamp != -1 && this.data.endTimestamp == -1) {
        data = `${this.timestampToDate(this.data.startTimestamp)} ~ ${this.timestampToDate(this.data.startTimestamp)}`
      }
      else {
        data = `${this.timestampToDate(this.data.startTimestamp)} ~ ${this.timestampToDate(this.data.endTimestamp)}`
      }
      this.triggerEvent("getRange", {data})
    },
    // 清除
    handleClean(){
      this.setData({
        startSelectYear: 0,
        startTimestamp:-1,
        endTimestamp: -1
      })
    },
    timestampToDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth()返回的月份从0开始，所以需要+1
      const day = date.getDate();

      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    },
    close() {
      this.triggerEvent("close");
    },
  },
  observers: {
  },
  lifetimes: {
    attached() {
      this.init();
    }
  }
})
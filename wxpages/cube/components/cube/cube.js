 //index.js
//获取应用实例
const app = getApp()
const Cube = require('../../utils/cube.wx.js')

Component({
  //数据
  data: {
    log:'',
    wheight:0,  //屏幕高度
    wwidth:0,   //屏幕宽度
    halfwidth:0,  //屏幕左右分区宽度
    cube:null
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    var _this = this;
    wx.getSystemInfo({
      success(res) {
        //宽高设置
        var height = res.windowHeight;
        var width = res.windowWidth;
        _this.setData({
          wheight:height,
          wwidth:width,
          halfwidth:width>(height*2)?height:width/2
        })
        //创建魔方
        _this.cube = new Cube(wx.createSelectorQuery().select('#cube'));
      }
    })
  },
  //获取信息的方法
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

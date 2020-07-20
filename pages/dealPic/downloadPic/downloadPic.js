import { base64src } from '../../../utils/base64ToSrc'

Page({
  data: {
    width: '',
    height: '',
    picPath: '',
    bgColor: '#438edb',
    isOpacity: true
  },
  onLoad() {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendInfo', (data) => {
      base64src(data.picPath, res => {
        that.setData({
          width: data.width,
          height: data.height,
          picPath: res
        })
      })
    })
    this.drawCanvas()
  },
  chooseColor(type) {
    const targetColor = type.currentTarget.dataset.color
    const colorObj = {
      'red': '#ff0000',
      'blue': '#438edb',
      'white': '#fff'
    }
    this.setData({
      bgColor: colorObj[targetColor]
    })
    this.drawCanvas()
  },
  drawCanvas() {
    const that = this
    const {bgColor, picPath, width, height} = that.data
    const ctx = wx.createCanvasContext('canvas')
    // 绘制底色
    ctx.setFillStyle(bgColor)
    ctx.fillRect(0, 0, width, height)
    // 绘制人像
    ctx.drawImage(picPath, 0, 0, width / 2, height / 2)
    ctx.draw()
  },
  downLoadImg() {
    const that = this
    const {width, height} = that.data
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width / 2,
      height: height / 2,
      destWidth: width,  //2倍关系
      destHeight: height, //2倍关系
      canvasId: 'canvas',
      success: function (res) {
        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})
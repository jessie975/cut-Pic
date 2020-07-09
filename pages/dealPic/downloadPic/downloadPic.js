Page({
  data: {
    width: '',
    height: '',
    picPath: '',
    bgColor: '#438edb',
    imgUrl: ''
  },
  onLoad() {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('sendInfo', (data) => {
      that.setData({
        width: data.width,
        height: data.height,
        picPath: data.picPath,
        imgUrl: data.imgUrl
      })
    })
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
  },
  drawImg() {
    const that = this
    const {bgColor, imgUrl} = that.data
    const query = wx.createSelectorQuery()
    query.select('#canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        // 绘制底色
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        // TODO:绘制人像
        
      })
  },
  saveImg() {
    // 保存图片到本地思路：先将带有背景色的图片绘制到canvas上，然后通过wx.canvasToTempFilePath将canvas转成图片，最后通过wx.saveImageToPhotosAlbum保存到本地
    this.drawImg()
  }
})
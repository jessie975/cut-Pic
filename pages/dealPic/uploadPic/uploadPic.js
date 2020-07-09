Page({
  data: {
    target: '',
    accessToken: '',
    picPath: '',
    imgUrl: ''
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    const that = this
    eventChannel.on('sendTarget', (data) => {
      that.setData({
        target: data.data
      })
    })
  },
  onShow() {
    this.getAccessToken()
  },
  toUploadPic() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({imgUrl: tempFilePaths[0]})
        // 图片转base64
        const imgbase = wx.getFileSystemManager().readFileSync(tempFilePaths[0], "base64")
        that.getDealPic(imgbase)
      }
    })
  },
  getAccessToken() {
    const that = this
    wx.request({
      method: 'POST',
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      data: {
        'grant_type': 'client_credentials',
        'client_id': 'zy5ZotHwsDGgASYajVy4Pab9',
        'client_secret': 'pA1jytE8CZKEpourZKrMwxOgNq88bYSj'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          accessToken: res.data.access_token
        })
      }
    })
  },
  getDealPic(imgbase) {
    wx.showLoading({title: '处理中', mask: true})
    const that = this
    wx.request({
      method: 'POST',
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/body_seg',
      data : {
        access_token: that.data.accessToken,
        image: imgbase,
        type: 'foreground'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.person_num) {
          const imgData = `data:image/jpeg;base64,${res.data.foreground}`
          that.toDownloadPic(imgData)
        } else {
          wx.showToast({
            title: '处理失败，请重试~'
          })
        }
      }
    })
  },
  toDownloadPic(picPath) {
    const {width, height} = this.data.target
    const that = this
    wx.navigateTo({
      url: '../downloadPic/downloadPic',
      success(res) {
        res.eventChannel.emit('sendInfo', { 
          picPath,
          imgUrl: that.data.imgUrl,
          width,
          height
        })
      }
    })
  }
})
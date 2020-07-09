// pages/dealPic/choose/choose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseList: [
      {title: '省考照片', width: '413', height: '626', size: '35x53mm'},
      {title: '国考照片', width: '130', height: '168', size: '35x45mm'},
      {title: '一寸照片', width: '295', height: '413', size: '2.5x3.5mm'},
      {title: '两寸照片', width: '413', height: '626', size: '35x53mm'}
    ]
  },
  toUploadPage(item) {
    wx.navigateTo({
      url: '../uploadPic/uploadPic',
      success(res) {
        res.eventChannel.emit('sendTarget', { data: item.target.dataset.item })
      }
    })
  }
})
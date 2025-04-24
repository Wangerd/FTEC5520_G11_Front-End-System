// server.js
const express = require('express')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 3000

// DID生成函数
function generateDID() {
  // 使用更安全的随机字节生成方式
  const randomHex = crypto.randomBytes(20).toString('hex')
  return `did:ethr:${randomHex}` // 注意移除了空格
}

// API路由
app.get('/dids', (req, res) => {
  try {
    // 生成DID
    const did = generateDID()
    console.log(`Get DID key from fake JS server! DID is ${did}`)

    // 返回响应
    res.status(200).json({
      did: did,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error generating DID:', error)
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

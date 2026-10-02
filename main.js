const glados = async () => {
  const cookie = process.env.GLADOS
  if (!cookie) return
  try {
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      'content-type': 'application/json;charset=UTF-8',
      'cookie': cookie,
      'origin': 'https://glados.rocks',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'sec-ch-ua': '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36'
    }
    const checkin = await fetch('https://glados.rocks/api/user/checkin', {
      method: 'POST',
      headers,
      body: JSON.stringify({ token: 'glados.rocks' }),
    }).then((r) => r.json())
    
    console.log(checkin)
    return checkin
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: `签到失败: ${error}`,
      error: error.toString(),
    }
  }
}

const notify = async (data) => {
  const token = process.env.NOTIFY
  if (!token || !data) return

  const title = `签到成功 +${data.points || 0} 积分`
  const content = data.message || '签到完成'

  await fetch(`https://www.pushplus.plus/send`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      token,
      title,
      content,
      template: 'markdown',
    }),
  })
}

const notify_ft = async (data) => {
  const token = process.env.FT_SEND_KEY
  if (!token || !data) return
  
  const baseUrl = `https://sctapi.ftqq.com/${token}.send`
  const params = {
    text: `签到成功 +${data.points || 0} 积分`,
    desp: data.message || '签到完成'
  }
  console.log(params)
  
  // 使用 URL 和 URLSearchParams 搭配处理
  const url = new URL(baseUrl)
  url.search = new URLSearchParams(params)
  await fetch(url.toString(), {
    method: 'GET'
  })
}

const main = async () => {
  const result = await glados()
  //await notify(result)
  await notify_ft(result)
}

main()

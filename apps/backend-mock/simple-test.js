// 简单测试登录接口
const BASE_URL = 'http://localhost:5320/api';

async function simpleTest() {
  console.log('🧪 简单测试登录接口...\n');

  try {
    const response = await fetch(`${BASE_URL}/v1/passport/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: 'MERCHANT_MANAGE_WEB_PC',
        login_account: 'admin',
        password: '123456',
        type: 'LOGIN_ID',
      }),
    });

    console.log('状态码:', response.status);
    console.log('状态文本:', response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ 登录成功!');
      console.log('响应数据:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ 登录失败');
      const errorText = await response.text();
      console.log('错误信息:', errorText);
    }

  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

// 运行测试
simpleTest();

// 测试v1版本的认证接口
const BASE_URL = 'http://localhost:5320/api';

async function testV1API() {
  console.log('🧪 测试v1版本的认证接口...\n');

  try {
    // 测试登录接口
    console.log('1️⃣ 测试登录接口...');
    const loginResponse = await fetch(`${BASE_URL}/v1/passport/login`, {
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

    if (!loginResponse.ok) {
      throw new Error(`登录失败: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginResult = await loginResponse.json();
    console.log('✅ 登录成功!');
    console.log('   状态码:', loginResponse.status);
    console.log('   有JWT Token:', !!loginResult.data?.jwt_token);
    console.log('   有用户信息:', !!loginResult.data?.user_model);
    console.log('   有权限树:', !!loginResult.data?.function_trees);
    console.log('   有应用关系:', !!loginResult.data?.user_apps);

    if (loginResult.data?.jwt_token?.jwt_token) {
      const accessToken = loginResult.data.jwt_token.jwt_token;
      console.log('🔑 获取到访问令牌:', accessToken.substring(0, 20) + '...\n');

      // 测试用户信息接口
      console.log('2️⃣ 测试用户信息接口...');
      const userInfoResponse = await fetch(`${BASE_URL}/v1/passport/user/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (userInfoResponse.ok) {
        const userInfoResult = await userInfoResponse.json();
        console.log('✅ 获取用户信息成功!');
        console.log('   用户名:', userInfoResult.data?.username);
        console.log('   真实姓名:', userInfoResult.data?.realName);
      } else {
        console.log('❌ 获取用户信息失败:', userInfoResponse.status);
      }

      // 测试Owner切换接口
      console.log('\n3️⃣ 测试Owner切换接口...');
      const ownerResponse = await fetch(`${BASE_URL}/v1/passport/owner/selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          owner_id: 1002,
          owner_type: 'MERCHANT',
        }),
      });

      if (ownerResponse.ok) {
        const ownerResult = await ownerResponse.json();
        console.log('✅ Owner切换成功!');
        console.log('   有新的JWT Token:', !!ownerResult.data?.jwt_token);
      } else {
        console.log('❌ Owner切换失败:', ownerResponse.status);
      }

      // 测试登出接口
      console.log('\n4️⃣ 测试登出接口...');
      const logoutResponse = await fetch(`${BASE_URL}/v1/passport/logout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (logoutResponse.ok) {
        const logoutResult = await logoutResponse.json();
        console.log('✅ 登出成功!');
        console.log('   结果:', logoutResult.data);
      } else {
        console.log('❌ 登出失败:', logoutResponse.status);
      }
    }

    console.log('\n🎉 测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testV1API();

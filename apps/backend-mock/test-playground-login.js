const fetch = require('node-fetch');

async function testPlaygroundLogin() {
  console.log('🧪 测试Playground登录接口...\n');

  try {
    // 测试登录接口
    const loginResponse = await fetch('http://localhost:5320/api/v1/passport/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: 'MERCHANT_MANAGE_WEB_PC',
        login_account: 'admin',
        password: '123456',
        type: 'LOGIN_ID'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`HTTP error! status: ${loginResponse.status}`);
    }

    const loginResult = await loginResponse.json();
    console.log('✅ 登录成功！');
    console.log('📊 响应状态:', loginResult.code);
    console.log('🔑 JWT Token:', loginResult.data.jwt_token.jwt_token.substring(0, 50) + '...');
    console.log('👤 用户信息:', loginResult.data.user_model.real_name);

    // 检查function_trees
    const functionTrees = loginResult.data.function_trees;
    console.log('\n🌳 功能权限树结构:');
    console.log(`- 总菜单数: ${functionTrees.length}`);

    functionTrees.forEach(menu => {
      console.log(`  📁 ${menu.name} (${menu.key})`);
      if (menu.sub_function_trees) {
        menu.sub_function_trees.forEach(subMenu => {
          console.log(`    └─ ${subMenu.name} (${subMenu.key})`);
        });
      }
    });

    // 测试菜单路径
    console.log('\n🔗 菜单路径映射:');
    functionTrees.forEach(menu => {
      const menuItem = menu.function.menu;
      console.log(`  ${menuItem.name}: ${menuItem.url} -> ${menuItem.component_paths}`);

      if (menu.sub_function_trees) {
        menu.sub_function_trees.forEach(subMenu => {
          const subMenuItem = subMenu.function.menu;
          console.log(`    └─ ${subMenuItem.name}: ${subMenuItem.url} -> ${subMenuItem.component_paths}`);
        });
      }
    });

    // 测试权限操作
    console.log('\n🔐 权限操作列表:');
    functionTrees.forEach(menu => {
      const actions = menu.function.actions;
      console.log(`  ${menu.name}:`);
      actions.forEach(action => {
        console.log(`    - ${action.action_name} (${action.action_key})`);
      });

      if (menu.sub_function_trees) {
        menu.sub_function_trees.forEach(subMenu => {
          const subActions = subMenu.function.actions;
          console.log(`    └─ ${subMenu.name}:`);
          subActions.forEach(action => {
            console.log(`      - ${action.action_name} (${action.action_key})`);
          });
        });
      }
    });

    console.log('\n🎉 Playground登录接口测试完成！');
    console.log('💡 现在可以在playground中使用这些菜单数据了');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testPlaygroundLogin();

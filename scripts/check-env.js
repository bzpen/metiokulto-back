#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 检查环境变量配置...\n');

const envPath = path.join(process.cwd(), '.env.local');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let missingVars = [];

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local 文件不存在');
  console.log('📝 请创建 .env.local 文件并添加以下环境变量：\n');
  requiredVars.forEach(varName => {
    console.log(`${varName}=your_value_here`);
  });
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

requiredVars.forEach(varName => {
  if (!envVars[varName]) {
    missingVars.push(varName);
    console.log(`❌ 缺少环境变量: ${varName}`);
  } else {
    console.log(`✅ ${varName} 已配置`);
  }
});

if (missingVars.length > 0) {
  console.log('\n📝 请在 .env.local 文件中添加以下环境变量：\n');
  missingVars.forEach(varName => {
    console.log(`${varName}=your_value_here`);
  });
  process.exit(1);
}

console.log('\n🎉 所有必需的环境变量都已配置！');
console.log('\n💡 提示：');
console.log('- 确保 Supabase 项目已激活');
console.log('- 检查 API 密钥是否正确');
console.log('- 重启开发服务器以应用更改'); 
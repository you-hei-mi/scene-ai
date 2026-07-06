#!/bin/bash

# BuildingAI 上线部署脚本
# 使用方式: ./deploy.sh <environment> <version>
# 示例: ./deploy.sh production v2.0.0

ENVIRONMENT=${1:-production}
VERSION=${2:-latest}

echo "======================================"
echo "  BuildingAI 部署脚本"
echo "  环境: $ENVIRONMENT"
echo "  版本: $VERSION"
echo "======================================"

# 检查参数
if [ -z "$ENVIRONMENT" ]; then
  echo "错误: 请指定部署环境 (development/staging/production)"
  exit 1
fi

# 切换到项目目录
cd "$(dirname "$0")/.."

# 拉取最新代码
echo ""
echo "[1/6] 拉取最新代码..."
git pull origin main

# 安装依赖
echo ""
echo "[2/6] 安装依赖..."
pnpm install

# 构建项目
echo ""
echo "[3/6] 构建项目..."
pnpm --filter @buildingai/web-nuxt build

# 备份现有版本
echo ""
echo "[4/6] 备份现有版本..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/buildingai/backup/${VERSION}_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"
cp -r /var/www/buildingai/current/* "$BACKUP_DIR/"

# 部署新版本
echo ""
echo "[5/6] 部署新版本..."
rm -rf /var/www/buildingai/current/*
cp -r apps/web-nuxt/.output/public/* /var/www/buildingai/current/
cp -r apps/web-nuxt/.output/server/* /var/www/buildingai/current/server/

# 重启服务
echo ""
echo "[6/6] 重启服务..."
if [ "$ENVIRONMENT" = "production" ]; then
  systemctl restart buildingai
else
  pm2 restart buildingai-$ENVIRONMENT
fi

echo ""
echo "======================================"
echo "  部署完成!"
echo "  环境: $ENVIRONMENT"
echo "  版本: $VERSION"
echo "  备份路径: $BACKUP_DIR"
echo "======================================"

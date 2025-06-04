#!/bin/bash

# AUTHOR: github.com/3M1RY33T

set -e

CONFIG_DIR="$HOME/.config/ags"
STATE_DIR="$HOME/.local/state/ags/user/ai"
BACKUP_DIR_BASE="$HOME/.local/state"
LATEST_BACKUP=$(ls -dt "$BACKUP_DIR_BASE"/backup-dotfiles-* 2>/dev/null | head -n 1)

# 🛡 Check if backup exists
if [[ ! -d "$LATEST_BACKUP" ]]; then
  echo "❌ No backup found. Aborting process."
  exit 1
fi

echo "🧹 Removing DeepSeek integration files..."

rm -f "$CONFIG_DIR/services/deepseek.js"
rm -f "$CONFIG_DIR/modules/sideleft/apiwidgets.js"
rm -f "$CONFIG_DIR/modules/sideleft/apis/deepseek.js"
rm -f "$STATE_DIR/deepseek_key.txt"

echo "♻️ Restoring previous configuration from $LATEST_BACKUP..."

cp "$LATEST_BACKUP/default_options.jsonc" "$CONFIG_DIR/modules/.configuration/" 2>/dev/null || true
cp "$LATEST_BACKUP/deepseek.js" "$CONFIG_DIR/services/" 2>/dev/null || true
cp "$LATEST_BACKUP/apiwidgets.js" "$CONFIG_DIR/modules/sideleft/" 2>/dev/null || true
cp "$LATEST_BACKUP/deepseek.js" "$CONFIG_DIR/modules/sideleft/apis/" 2>/dev/null || true

echo "✅ Configuration uninstalled. Your previous configuration has been restored."

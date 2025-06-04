#!/bin/bash

# AUTHOR: 3M1RY33T

set -e

REPO_URL="https://github.com/3M1RY33T/dots-hyprland-professional.git"
TMP_DIR="/tmp/dots-install-temp"
CONFIG_DIR="$HOME/.config/ags"
STATE_DIR="$HOME/.local/state/ags/user/ai"
BACKUP_DIR="$HOME/.local/backup-dotfiles-$(date +%s)"

echo "📦 Cloning configuration from $REPO_URL..."
git clone --depth=1 "$REPO_URL" "$TMP_DIR"

echo "🛡️ Backing up current configuration..."
mkdir -p "$BACKUP_DIR"
cp -r "$CONFIG_DIR/modules/.configuration/default_options.jsonc" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$CONFIG_DIR/services/deepseek.js" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$CONFIG_DIR/modules/sideleft/apiwidgets.js" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$CONFIG_DIR/modules/sideleft/apis/deepseek.js" "$BACKUP_DIR/" 2>/dev/null || true

echo "🔁 Applying DeepSeek integration..."

cp "$TMP_DIR/ags/modules/.configuration/default_options.jsonc" "$CONFIG_DIR/modules/.configuration/"

# services/deepseek.js
cp "$TMP_DIR/ags/services/deepseek.js" "$CONFIG_DIR/services/"

cp "$TMP_DIR/ags/modules/sideleft/apiwidgets.js" "$CONFIG_DIR/modules/sideleft/"

# apis/deepseek.js
mkdir -p "$CONFIG_DIR/modules/sideleft/apis"
cp "$TMP_DIR/ags/modules/sideleft/apis/deepseek.js" "$CONFIG_DIR/modules/sideleft/apis/"

echo "🔐 Creating key file at $STATE_DIR/deepseek_key.txt..."
mkdir -p "$STATE_DIR"
touch "$STATE_DIR/deepseek_key.txt"

echo "🧹 Cleaning up temporary files..."
rm -rf "$TMP_DIR"

echo "✅ DeepSeek integration complete!"
echo "📁 Backups saved in: $BACKUP_DIR"
echo "🔑 Add your DeepSeek API key to: $STATE_DIR/deepseek_key.txt"

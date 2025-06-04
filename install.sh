#!/bin/bash

# AUTHOR: 3M1RY33T

# Installer for AGS + Hyprland (dots-hyprland-professional) configuration

# === CONFIG ===
REPO_URL="https://github.com/3M1RY33T/dots-hyprland-professional.git"
DEST_DIR="$HOME/.config"
AGS_DIR="$DEST_DIR/ags"
HYPR_DIR="$DEST_DIR/hypr"
BACKUP_DIR="$HOME/.local/state/hyprland-config-backups/$(date +%Y%m%d_%H%M%S)"
KEY_FILE="$HOME/.local/state/ags/user/ai/deepseek_key.txt"

# === START ===
echo "📦 Cloning configuration from $REPO_URL..."
git clone --depth=1 "$REPO_URL" /tmp/config-temp

# === BACKUP EXISTING CONFIGS ===
echo "📦 Backing up configs that will be replaced..."
mkdir -p "$BACKUP_DIR"

if [ -d "$AGS_DIR" ]; then
  echo "🔄 Backing up existing AGS config..."
  mv "$AGS_DIR" "$BACKUP_DIR/"
fi

if [ -d "$HYPR_DIR" ]; then
  echo "🔄 Backing up existing Hyprland config..."
  mv "$HYPR_DIR" "$BACKUP_DIR/"
fi

# === INSTALL NEW CONFIG ===
echo "📂 Copying AGS config to $AGS_DIR..."
mkdir -p "$AGS_DIR"
cp -r /tmp/config-temp/ags/* "$AGS_DIR/"

echo "📂 Copying Hyprland config to $HYPR_DIR..."
mkdir -p "$HYPR_DIR"
cp -r /tmp/config-temp/hypr/* "$HYPR_DIR/"

# === CREATE DEEPSEEK KEY FILE IF MISSING ===
echo "🔐 Creating DeepSeek key file..."
mkdir -p "$(dirname "$KEY_FILE")"
touch "$KEY_FILE"

# === CLEANUP ===
rm -rf /tmp/config-temp

echo "✅ Installation complete!"
echo "🗂️ Existing Config Backup Path: $BACKUP_DIR"
echo "🔑 DeepSeek key path: $KEY_FILE"

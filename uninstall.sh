#!/bin/bash

# AUTHOR: 3M1RY33T

# Uninstaller for AGS + Hyprland (dots-hyprland-professional) configuration

DEST_DIR="$HOME/.config"
AGS_DIR="$DEST_DIR/ags"
HYPR_DIR="$DEST_DIR/hypr"
BACKUP_ROOT="$HOME/.local/state/hyprland-config-backups"
KEY_FILE="$HOME/.local/state/ags/user/ai/deepseek_key.txt"

echo "🚮 Starting uninstall process..."

# === CHECK FOR BACKUP FIRST ===
LATEST_BACKUP=$(ls -td "$BACKUP_ROOT"/* 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "❌ No backup found in $BACKUP_ROOT."
  echo "🛑 Uninstall aborted to avoid losing your current configuration."
  exit 1
fi

echo "🗂️  Found backup: $LATEST_BACKUP"
echo "♻️  Proceeding with uninstall and restore..."

# === REMOVE CONFIGS ===
if [ -d "$AGS_DIR" ]; then
  echo "🗑️  Removing AGS config..."
  rm -rf "$AGS_DIR"
fi

if [ -d "$HYPR_DIR" ]; then
  echo "🗑️  Removing Hyprland config..."
  rm -rf "$HYPR_DIR"
fi

# === RESTORE BACKUP ===
if [ -d "$LATEST_BACKUP/ags" ]; then
  cp -r "$LATEST_BACKUP/ags" "$AGS_DIR"
  echo "✅ Restored AGS config."
fi

if [ -d "$LATEST_BACKUP/hypr" ]; then
  cp -r "$LATEST_BACKUP/hypr" "$HYPR_DIR"
  echo "✅ Restored Hyprland config."
fi

# === DELETE DEEPSEEK KEY FILE ===
if [ -f "$KEY_FILE" ]; then
  echo "🗝️  Removing DeepSeek key file..."
  rm -f "$KEY_FILE"
fi

echo "✅ Uninstallation and restore complete."

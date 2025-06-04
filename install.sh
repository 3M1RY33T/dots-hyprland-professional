#!/bin/bash

# AUTHOR: 3M1RY33T

# Installer for AGS + Hyprland (dots-hyprland-professional) configuration

# === CONFIG ===
REPO_URL="https://github.com/3M1RY33T/dots-hyprland-professional.git"
DEST_DIR="$HOME/.config"
AGS_DIR="$DEST_DIR/ags"
HYPR_DIR="$DEST_DIR/hypr"

# === START ===
echo "📦 Cloning configuration from 3M1RY33T/dots-hyprland-professional..."
git clone --depth=1 "$REPO_URL" /tmp/config-temp

echo "📂 Copying AGS config to $AGS_DIR..."
mkdir -p "$AGS_DIR"
cp -r /tmp/config-temp/ags/* "$AGS_DIR/"

echo "📂 Copying Hyprland config to $HYPR_DIR..."
mkdir -p "$HYPR_DIR"
cp -r /tmp/config-temp/hypr/* "$HYPR_DIR/"

# Clean temp files
rm -rf /tmp/config-temp

echo "✅ Installation Complete."

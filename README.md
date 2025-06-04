# dots-hyprland Professional

This is a tweak of an existing configuration by end-4, special thanks to you for this groundbreaking Hyprland configuration!

## Motivation

My contribution to this configiration is mainly aimed at the API sidebar; however I have plans for other features in the future. I wanted to keep a professional profile on my Linux Setup, so I started by removing Waifu and Booru APIs. After that, the API sidebar felt pretty empty so I started my attempts to fill it up with other APIs. Took me a while, but DeepSeek is now available to use in this repository, with more to be implemented soon.
Features

API models in the left sidebar (not including the existing ones from end-4/dots-hyprland):

- DeepSeek
- Claude (Unfinished)
- Copilot (Unfinished)

## Requirements

- Hyprland: https://github.com/hyprwm/Hyprland
- AGS: https://github.com/Aylur/ags
- end_4's Hyprland dotfiles: https://github.com/end-4/dots-hyprland

## Setup

### 1. Installer Script:

Go to your terminal (bash shell) and type:

```
bash <(curl -sL https://raw.githubusercontent.com/3M1RY33T/dots-hyprland-professional/main/install.sh)
```

#### Configuration-safe

This script will not install any repositories, but only append the necessary files to the existing repositories (listed in requirements section); making it safe for keepig existing configuration. Additionally, your existing files that will be replaced are placed in a backup folder named ``hyprland-config-backups`` located in ``~/.local/state'`` before installation.

### 2. Manual Installation:

- Go to ``~/.config/ags/modules/.configuration`` and replace your ``default_options.jsonc`` file with the one in my repo.
- Go to ``~/.config/ags/services`` and add the ``deepseek.js`` file.
- Go to ``~/.config/ags/modules/sideleft`` and replace your ``apiwidgets.js`` with the one in my repo.
- Go to ``~/.config/ags/modules/sideleft/apis`` and add the ``deepseek.js`` file.
- Go to ``~/.local/state/ags/user/ai`` and create a ``deepseek_key.txt`` file. You can either add your API key there now or through the sidebar.

## Professional Sidebar

![image](https://github.com/user-attachments/assets/a154df4c-1115-44a2-a01d-88b1da2210d7)

More AI API models will be available soon, tune in for the progress! Special thanks and respects to the developers whose work I humbly wish to contribute to.

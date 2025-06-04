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

Go to your terminal and type:

(If not in bash shell) bash 
bash <(curl -sL https://raw.githubusercontent.com/3M1RY33T/dots-hyprland-professional/main/install.sh)

### 2. Manual Installation:

- Go to '~/.config/ags/modules/.configuration' and replace your 'default_options.jsonc' file with the one in my repo.
- Go to '~/.config/ags/services' and add the 'deepseek.js' file.
- Go to '~/.config/ags/modules/sideleft' and replace your 'apiwidgets.js' with the one in my repo.
- Go to '~/.config/ags/modules/sideleft/apis' and add the 'deepseek.js' file.
- Go to '~/.local/state/ags/user/ai' and create a 'deepseek_key.txt' file. You can either add your API key there now or through the sidebar.

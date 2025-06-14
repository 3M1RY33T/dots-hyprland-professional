# dots-hyprland-professional

This is a plugin to an existing configuration by [end-4](https://github.com/end-4), special thanks to you for this groundbreaking Hyprland configuration!

## Motivation

My contribution to this configiration is mainly aimed at the API sidebar. I wanted to keep a professional profile on my Linux Setup, so I started by disabling Waifu and Booru APIs. After that, the API sidebar felt pretty empty so I started my attempts to fill it up with other APIs. Deepseek is now available to use in this repository, with more to be implemented soon. 

**Note:** If you wish to use this profile and also use Waifu & Booru, you can enable it in ``~/.config/ags/modules/.configuration/default_options.jsonc`` by simply uncommenting two lines that are their entries.

## Features

API models in the left sidebar (not including the existing ones from end-4/dots-hyprland):

- Deepseek
  - Provider: Deepseek 
- Claude (Unfinished)

Persistent chat history

## Requirements

- [Hyprland](https://github.com/hyprwm/Hyprland)
- [AGS](https://github.com/Aylur/ags)
- [end_4's Hyprland dotfiles](https://github.com/end-4/dots-hyprland)

## Setup

### 1. Installer Script:

Go to your terminal (bash shell) and type:

```
bash <(curl -sL https://raw.githubusercontent.com/3M1RY33T/dots-hyprland-professional/main/install.sh)
```

Or for an offline installation, you can clone the repository and run the ``install.sh`` script from the terminal.

```
$ git clone https://github.com/3M1RY33T/dots-hyprland-professional.git
$ cd dots-hyprland-professional
$ sh install.sh
```

After installation, remember to reload your configuration.

#### Configuration-safe

This script will not install any repositories, but only append the necessary files to the existing repositories (listed in requirements section); making it safe for keepig existing configuration. Additionally, your existing files that will be replaced are placed in a backup folder named ``hyprland-config-backups`` located in ``~/.local/state'`` before installation.

### 2. Manual Installation:

**Important:** I uploaded a wider directory of my configuration, but you should refrain from copying the */ags* and */hypr* files directly, you are under risk of losing existing hyprland configuration. Instead, follow the steps below.

- Go to ``~/.config/ags/modules/.configuration`` and replace your ``default_options.jsonc`` file with the one in my repo.
- Go to ``~/.config/ags/services`` and add the ``deepseek.js`` file.
- Go to ``~/.config/ags/modules/sideleft`` and replace your ``apiwidgets.js`` with the one in my repo.
- Go to ``~/.config/ags/modules/sideleft/apis`` and add the ``deepseek.js`` file.
- Go to ``~/.local/state/ags/user/ai`` and create a ``deepseek_key.txt`` file. You can either add your API key there now or through the sidebar.

#### For removing this plugin, please replicate the steps, and replace the files that are pulled from my repo with the ones that are backed up at ``~/.local/state/backup-dotfiles-XXXXXXXXXX`` 
- Optionally, also delete the ``~/.local/state/ags/user/ai/deepseek.txt`` file 

## Professional API Sidebar

![deepseek](https://github.com/user-attachments/assets/d1682ee5-f68e-4b52-8c09-cde9f8c5d880)


More AI API models will be available soon, tune in for the progress! Special thanks and respects to the developers whose work I humbly wish to contribute to.

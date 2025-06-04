const { Gtk } = imports.gi;
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

const { Box, Button, Icon, Label, Revealer, Scrollable } = Widget;
import DeepSeekService from '../../../services/deepseek.js';
import { setupCursorHover, setupCursorHoverInfo } from '../../.widgetutils/cursorhover.js';
import { SystemMessage, ChatMessage } from "./ai_chatmessage.js";
import { ConfigSegmentedSelection, ConfigGap } from '../../.commonwidgets/configwidgets.js';
import { MarginRevealer } from '../../.widgethacks/advancedrevealers.js';
import { AgsToggle } from '../../.commonwidgets/configwidgets_apps.js';

const MODEL_NAME = `DeepSeek`;

export const deepseekTabIcon = Icon({
  hpack: 'center',
  icon: `deepseek-symbolic`,
});

const DeepSeekInfo = () => Box({
  vertical: true,
  className: 'spacing-v-15',
  children: [
    Icon({
      hpack: 'center',
      className: 'sidebar-chat-welcome-logo',
      icon: `deepseek-symbolic`,
    }),
    Label({
      className: 'txt txt-title-small sidebar-chat-welcome-txt',
      wrap: true,
      justify: Gtk.Justification.CENTER,
      label: `Assistant (DeepSeek)`
    }),
    Box({
      className: 'spacing-h-5',
      hpack: 'center',
      children: [
        Label({
          className: 'txt-smallie txt-subtext',
          wrap: true,
          justify: Gtk.Justification.CENTER,
          label: getString('Powered by DeepSeek'),
        }),
        Button({
          className: 'txt-subtext txt-norm icon-material',
          label: 'info',
          tooltipText: getString(`DeepSeek is a large language model.
This interface is unofficial and for personal use`),
          setup: setupCursorHoverInfo,
        })
      ]
    })
  ]
});

export const DeepSeekSettings = () => MarginRevealer({
  transition: 'slide_down',
  revealChild: true,
  extraSetup: (self) => self
    .hook(DeepSeekService, () => Utils.timeout(200, () => self.attribute.hide()), 'newMsg')
    .hook(DeepSeekService, () => Utils.timeout(200, () => self.attribute.show()), 'clear'),
  child: Box({
    vertical: true,
    className: 'sidebar-chat-settings',
    children: [
      ConfigSegmentedSelection({
        hpack: 'center',
        icon: 'casino',
        name: 'Randomness',
        desc: getString("DeepSeek's temperature (0 = focused, 1 = creative)"),
        options: [
          { value: 0.00, name: getString('Precise') },
          { value: 0.50, name: getString('Balanced') },
          { value: 1.00, name: getString('Creative') },
        ],
        initIndex: 1,
        onChange: (value) => DeepSeekService.temperature = value
      }),
      ConfigGap({ vertical: true, size: 10 }),
      Box({
        vertical: true,
        hpack: 'center',
        className: 'sidebar-chat-settings-toggles',
        children: [
          AgsToggle({
            icon: 'model_training',
            name: getString('Prompt'),
            desc: getString("Adds a Linux assistant system prompt to guide tone/output."),
            option: "ai.enhancements",
            extraOnChange: (_, val) => DeepSeekService.assistantPrompt = val,
            extraOnReset: (_, val) => DeepSeekService.assistantPrompt = val,
          }),
        ]
      })
    ]
  })
});

export const DeepSeekInstructions = () => Box({
  homogeneous: true,
  children: [Revealer({
    transition: 'slide_down',
    transitionDuration: userOptions.animations.durationLarge,
    setup: (self) => self
      .hook(DeepSeekService, () => {
        self.revealChild = DeepSeekService.key.length == 0;
      }, 'hasKey'),
    child: Button({
      child: Label({
        useMarkup: true,
        wrap: true,
        className: 'txt sidebar-chat-welcome-txt',
        justify: Gtk.Justification.CENTER,
        label: 'A DeepSeek API key is required\nYou can grab one <u>here</u>, then enter it below'
      }),
      setup: setupCursorHover,
      onClicked: () => {
        Utils.execAsync(['bash', '-c', `xdg-open https://platform.deepseek.com/api-key &`]);
      }
    })
  })]
});

const deepseekWelcome = Box({
  vexpand: true,
  homogeneous: true,
  child: Box({
    className: 'spacing-v-15 margin-top-15 margin-bottom-15',
    vpack: 'center',
    vertical: true,
    children: [
      DeepSeekInfo(),
      DeepSeekInstructions(),
      DeepSeekSettings()
    ]
  })
});

export const chatContent = Box({
  className: 'spacing-v-5',
  vertical: true,
  setup: (self) => self
    .hook(DeepSeekService, (box, id) => {
      const message = DeepSeekService.messages[id];
      if (!message) return;
      box.add(ChatMessage(message, MODEL_NAME))
    }, 'newMsg'),
});

const clearChat = () => {
  DeepSeekService.clear();
  const children = chatContent.get_children();
  children.forEach(child => child.destroy());
};

const CommandButton = (command) => Button({
  className: 'sidebar-chat-chip sidebar-chat-chip-action txt txt-small',
  onClicked: () => sendMessage(command),
  setup: setupCursorHover,
  label: command,
});

export const deepseekCommands = Box({
  className: 'spacing-h-5',
  children: [
    Box({ hexpand: true }),
    CommandButton('/key'),
    CommandButton('/model'),
    CommandButton('/clear'),
  ]
});

export const sendMessage = (text) => {
  if (text.length == 0) return;
  if (DeepSeekService.key.length == 0) {
    DeepSeekService.key = text;
    chatContent.add(SystemMessage(`Key saved to \`${DeepSeekService.keyPath}\`\nUpdate anytime with /key YOUR_API_KEY.`, 'API Key', DeepSeekView));
    return;
  }
  if (text.startsWith('/')) {
    if (text.startsWith('/clear')) clearChat();
    else if (text.startsWith('/model')) chatContent.add(SystemMessage(`Currently using \`${DeepSeekService.modelName}\``, '/model', DeepSeekView))
    else if (text.startsWith('/key')) {
      const parts = text.split(' ');
      if (parts.length == 1) chatContent.add(SystemMessage(`Key stored in:\n\`${DeepSeekService.keyPath}\`\nTo update: /key YOUR_API_KEY`, '/key', DeepSeekView));
      else {
        DeepSeekService.key = parts[1];
        chatContent.add(SystemMessage(`Updated API key at\n\`${DeepSeekService.keyPath}\``, '/key', DeepSeekView));
      }
    }
    else chatContent.add(SystemMessage(getString(`Invalid command.`), 'Error', DeepSeekView));
  } else {
    DeepSeekService.send(text);
  }
};

export const DeepSeekView = (chatEntry) => Box({
  homogeneous: true,
  children: [Scrollable({
    className: 'sidebar-chat-viewport',
    vexpand: true,
    child: Box({
      vertical: true,
      children: [
        deepseekWelcome,
        chatContent,
      ]
    }),
    setup: (scrolledWindow) => {
      scrolledWindow.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
      const vScrollbar = scrolledWindow.get_vscrollbar();
      vScrollbar.get_style_context().add_class('sidebar-scrollbar');
      Utils.timeout(1, () => {
        const viewport = scrolledWindow.child;
        viewport.set_focus_vadjustment(new Gtk.Adjustment(undefined));
      });
      const adjustment = scrolledWindow.get_vadjustment();
      adjustment.connect("changed", () => Utils.timeout(1, () => {
        if (!chatEntry.hasFocus) return;
        adjustment.set_value(adjustment.get_upper() - adjustment.get_page_size());
      }))
    }
  })]
});


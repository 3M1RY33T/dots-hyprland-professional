import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup?version=3.0';
import { fileExists } from '../modules/.miscutils/files.js';

const HISTORY_PATH = `${GLib.get_user_state_dir()}/ags/user/ai/chats/deepseek.txt`;
const KEY_FILE = `${GLib.get_user_state_dir()}/ags/user/ai/deepseek_key.txt`;
const API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

const initMessages = [
  { role: "user", content: getString?.("You are an assistant in a Linux sidebar...") ?? "You are an assistant in a Linux sidebar..." },
  { role: "assistant", content: "- Got it!" }
];

class DeepSeekMessage extends Service {
  static {
    Service.register(this, {
      'delta': ['string'],
    }, {
      'content': ['string'],
      'thinking': ['boolean'],
      'done': ['boolean'],
    });
  }

  _role = '';
  _content = '';
  _thinking;
  _done = false;
  _lastContentLength = 0;

  constructor(role, content, thinking, done = false) {
    super();
    this._role = role;
    this._content = content;
    this._thinking = thinking;
    this._done = done;
  }

  get done() { return this._done }
  set done(val) { this._done = val; this.notify('done'); }

  get role() { return this._role }
  set role(val) { this._role = val; this.emit('changed'); }

  get content() { return this._content }
  set content(val) {
    this._content = val;
    if (val.length - this._lastContentLength >= userOptions.ai.charsEachUpdate) {
      this.notify('content');
      this.emit('changed');
      this._lastContentLength = val.length;
    }
  }

  get thinking() { return this._thinking }
  set thinking(val) {
    this._thinking = val;
    this.notify('thinking');
    this.emit('changed');
  }

  addDelta(delta) {
    if (!delta) return;
    if (this.thinking) {
      this.thinking = false;
      this.content = delta;
    } else {
      this.content += delta;
    }
    this.emit('delta', delta);
  }
}

class DeepSeekService extends Service {
  static {
    Service.register(this, {
      'initialized': [],
      'clear': [],
      'newMsg': ['int'],
      'hasKey': ['boolean'],
    });
  }

  _key = '';
  _messages = [];
  _temperature = userOptions.ai.defaultTemperature;
  _decoder = new TextDecoder();

  constructor() {
    super();
    if (fileExists(KEY_FILE)) {
      this._key = Utils.readFile(KEY_FILE).trim();
    } else {
      this.emit('hasKey', false);
    }

    this._messages = userOptions.ai.enhancements ? [...initMessages] : [];
    this.emit('initialized');
  }

  get keyPath() { return KEY_FILE }
  get key() { return this._key }
  set key(val) {
    this._key = val;
    Utils.writeFile(val, KEY_FILE).then(() => {
      this.emit('hasKey', true);
    }).catch(print);
  }

  get temperature() { return this._temperature }
  set temperature(val) { this._temperature = val }

  get messages() { return this._messages }
  get lastMessage() { return this._messages[this._messages.length - 1] }

  clear() {
    this._messages = userOptions.ai.enhancements ? [...initMessages] : [];
    this.emit('clear');
  }

  addMessage(role, message) {
    this._messages.push(new DeepSeekMessage(role, message));
    this.emit('newMsg', this._messages.length - 1);
  }

  send(msg) {
    this.addMessage('user', msg);
    const aiResponse = new DeepSeekMessage('assistant', '', true, false);
    this._messages.push(aiResponse);
    this.emit('newMsg', this._messages.length - 1);

    const body = {
      model: MODEL,
      messages: this._messages.map(m => ({ role: m.role, content: m.content })),
      temperature: this._temperature,
      stream: true,
    };

    const proxyResolver = new Gio.SimpleProxyResolver({ 'default-proxy': userOptions.ai.proxyUrl });
    const session = new Soup.Session({ 'proxy-resolver': proxyResolver });

    const message = new Soup.Message({
      method: 'POST',
      uri: GLib.Uri.parse(API_URL, GLib.UriFlags.NONE),
    });

    message.request_headers.append('Authorization', `Bearer ${this._key}`);
    message.set_request_body_from_bytes('application/json', new GLib.Bytes(JSON.stringify(body)));

    session.send_async(message, GLib.DEFAULT_PRIORITY, null, (_, result) => {
      try {
        const stream = session.send_finish(result);
        this._readStream(new Gio.DataInputStream({ close_base_stream: true, base_stream: stream }), aiResponse);
      } catch (err) {
        aiResponse.addDelta(`Error sending request: ${err.message}`);
        aiResponse.done = true;
      }
    });
  }

  _readStream(stream, aiResponse) {
    if (!stream) return;
    stream.read_line_async(0, null, (s, res) => {
      try {
        const [bytes] = s.read_line_finish(res);
        const line = this._decoder.decode(bytes);

        if (line.startsWith(':') || line.trim() === '') {
          this._readStream(stream, aiResponse);
          return;
        }

        if (line.includes('[DONE]')) {
          aiResponse.done = true;
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(line.replace(/^data: /, ''));
        } catch (e) {
          aiResponse.addDelta(`Invalid JSON: ${line}`);
          aiResponse.done = true;
          return;
        }

        if (!parsed.choices || !Array.isArray(parsed.choices)) {
          if (parsed.error?.message) {
            aiResponse.addDelta(`API Error: ${parsed.error.message}`);
          } else {
            aiResponse.addDelta(`Unexpected response: ${JSON.stringify(parsed)}`);
          }
          aiResponse.done = true;
          return;
        }

        const delta = parsed.choices[0]?.delta?.content;
        if (delta) aiResponse.addDelta(delta);

        this._readStream(stream, aiResponse);
      } catch (e) {
        aiResponse.addDelta(`Error parsing response: ${e.message}`);
        aiResponse.done = true;
      }
    });
  }
}

export default new DeepSeekService();

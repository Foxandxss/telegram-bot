import { availablePlugins } from './../pluginsRegistry';
import { Plugin } from './plugin.interface';

export class HelpPlugin implements Plugin {
  description = "Esta ayuda";

  constructor(public command: string) { }

  exec(bot: any, msg: any) {
    let message = "Ayuda del bot:\n";
    availablePlugins.forEach(p => {
      message += `${p.command}: ${p.description}\n`;
    });
    bot.sendMessage(msg.chat.id, message);
  }
}

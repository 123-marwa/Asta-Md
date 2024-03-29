const os = require("os");
const Config = require("../config");
let {
  fancytext,
  tlang,
  runtime,
  formatp,
  prefix,
  smd,
} = require("../lib");
const astro_patch = require("../lib/plugins");
astro_patch.smd(
  {
    pattern: "list",
    desc: "list menu",
    category: "user",
    react: "🥀",
  },
  async (message) => {
    try {
      const { commands } = require("../lib");
      let menu = `\n  ╭━━〘 *${Config.botname}* 〙────⊷     \n  ┃ ✭ Theme: ${tlang().title}\n  ┃ ✭ Prefix: ${prefix}\n  ┃ ✭ Owner: ${Config.ownername}\n  ┃ ✭ Commands: ${commands.length}\n  ┃ ✭ Uptime: ${runtime(process.uptime())}\n  ┃ ✭ Mem: ${formatp(os.totalmem() - os.freemem())}/${formatp(os.totalmem())}\n  ╰━━━━━━━━━━━━━━⊷\n`;

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern === undefined) {
          continue;
        }
        menu += `*${i + 1} ${fancytext(commands[i].pattern, 1)}*\n`;
        menu += `  ${fancytext(commands[i].desc, 1)}\n`;
      }

      return await message.sendUi(message.chat, {
        caption: `${menu}${Config.caption}`,
      });
    } catch (error) {
      await message.error(`${error}\nCommand:list`, error);
    }
  },
);

function getMenuTypeFromConfig(configValue) {
  if (
    configValue.trim().startsWith("1") ||
    configValue.toLowerCase().includes("aztec")
  ) {
    return 1;
  } else if (
    configValue.trim().startsWith("2") ||
    configValue.toLowerCase().includes("a17")
  ) {
    return 2;
  } else {
    return 3;
  }
}

function getMenuStyles(type) {
  switch (type) {
    case 1:
      return {
        header: "┏━━⟪ *@botname* ⟫━━〤",
        prefix: "┃ ✗",
        separator: "┗━━━━━━━━━━━━━━━〤",
        title: "┌──『",
        body: "』──❖\n",
        prefix: " | ",
        footer: "\n└──────────────◉",
      };
    case 2:
      return {
        header: "┌───═[ *@botname* ]═──▸\n│╭────────────···▸\n┴│▸",
        prefix: "⬡│▸",
        separator: "┬│▸\n│╰─────────────···▸\n└───────────────···▸",
        title: "┌───〈",
        body: "〉───◆\n│╭─────────────···▸\n┴│▸",
        prefix: "⬡│▸ ",
        footer: "┬│▸\n│╰────────────···▸▸\n└───────────────···▸",
      };
    default:
      return {
        header: "╭────《  @botname  》────⊷\n│ ╭──────✧❁✧──────◆",
        prefix: "│ │",
        separator: "│ ╰──────✧❁✧──────◆\n╰══════════════════⊷",
        title: "╭────❏",
        body: "❏",
        prefix: "│",
        footer: "╰━━━━━━━━━━━━━━──⊷",
      };
  }
}
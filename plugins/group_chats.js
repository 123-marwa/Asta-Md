const { updateProfilePicture, parsedJid } = require("../lib");
const {
  sck,
  UserFunction,
  send,
  Config,
  tlang,
  sleep,
  getAdmin,
  prefix,
} = require("../lib");
const ᴀsᴛᴀ_ᴍᴅ = require("../lib/plugins");
const { cmd } = ᴀsᴛᴀ_ᴍᴅ;
const grouppattern = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/g;
UserFunction(
  {
    cmdname: "join",
    info: "joins group by link",
    type: "whatsapp",
    fromMe: true,
    filename: __filename,
    use: "<group link.>",
  },
  async (message, context) => {
    try {
      if (message.reply_message && message.reply_message.groupInvite) {
        var InviteLink = await message.bot.groupAcceptInviteV4(
          message.chat,
          message.reply_message.msg
        );
        if (InviteLink && InviteLink.includes("joined to:")) {
          return await send(message, "*Joined Group*", {}, "", message);
        }
      }
      let link = context ? context : message.reply_text;
      const match = link.match(grouppattern);
      if (!match) {
        return await message.reply(
          "*Give Me A Vaild WhatsApp Group Link To Join*\n\n*" +
            prefix +
            "join `Your Link`*"
        );
      }
      let MatchInfo = match[0].split("https://chat.whatsapp.com/")[1].trim();
      await message.bot
        .groupAcceptInvite(MatchInfo)
        .then((_0x7f3222) => send(message, "*_Joined_*", {}, "", message))
        .catch((error) =>
          message.send(
            "*Unable To Join, this is not a vaild whatsapp Group Link."
          )
        );
    } catch (error) {
      await message.error(
        error + "\n\ncommand: join",
        error,
        "*Can't Join, Group Id not found*"
      );
    }
  }
);
UserFunction(
  {
    cmdname: "newgc",
    info: "Create New Group",
    type: "whatsapp",
    filename: __filename,
    use: "<group link.>",
  },
  async (input, match, { UserFunction: newgc, cmdName: newgc }) => {
    try {
      if (!input.isCreator) {
        return input.reply(tlang().owner);
      }
      if (!match) {
        return await input.reply(
          "Hello Sir To Create A New Group\n\n" +
            prefix +
            "" +
            newgc +
            " *`Your Group Name`*"
        );
      }
      let tagged = match;
      if (tagged.toLowerCase() === "info") {
        return await input.send(
          (
            "\n  *Its a command to create new Gc*\n  \t```Ex: " +
            (prefix + cmd) +
            " My new Group```\n  \n*You Can Add People To The Group*\n  \t```just reply or mention Users```\n  "
          ).trim()
        );
      }
      let request = [input.sender];
      if (input.quoted) {
        request.push(input.quoted.sender);
      }
      if (input.mentionedJid && input.mentionedJid[0]) {
        request.push(...input.mentionedJid);
        try {
          mentionJids.forEach((Users) => {
            var other_users = Users.split("@")[0].trim();
            tagged = tagged.replace(new RegExp("@" + other_users, "g"), "");
          });
        } catch {}
      }
      const SuccessMsg = tagged.substring(0, 60);
      const RemoteAsker = await input.bot.groupCreate(SuccessMsg, [...request]);
      if (RemoteAsker) {
        let MSG = await input.bot.sendMessage(RemoteAsker.id, {
          text: "*New Group Created!*\n" + Config.caption,
        });
        try {
          var NewGCLINK = await input.bot.groupInviteCode(RemoteAsker.id);
        } catch {
          var NewGCLINK = false;
        }
        var newlink = "https://chat.whatsapp.com/";
        var newGroupLink = "" + newlink + NewGCLINK;
        var ContextMSG = {
          externalAdReply: {
            title: "𝗔𝗦𝗧𝗔-𝗠𝗗",
            body: "" + SuccessMsg,
            renderLargerThumbnail: true,
            thumbnail: log0,
            mediaType: 1,
            mediaUrl: newGroupLink,
            sourceUrl: newGroupLink,
          },
        };
        return await send(
          input,
          (
            "*Group Created*\n" + (NewGCLINK ? "*_" + newGroupLink + "_*" : "")
          ).trim(),
          {
            contextInfo: ContextMSG,
          },
          "",
          MSG
        );
      } else {
        await input.send("*_Can't create new group, Sorry!!_*");
      }
    } catch (error) {
      await input.error(
        error + "\n\ncommand: " + newgc,
        error,
        "*_Can't create new group, Sorry!!_*"
      );
    }
  }
);
UserFunction(
  {
    pattern: "groupdata",
    desc: "get group info by link",
    type: "group",
    filename: __filename,
    use: "<group link.>",
  },
  async (message, request) => {
    try {
      let match = request ? request : message.reply_text;
      const query = match.match(grouppattern) || false;
      if (!query) {
        return await message.reply("*Give me Group Link to Analyse Sir*");
      }
      let glink = query[0].split("https://chat.whatsapp.com/")[1].trim();
      const gInfoData = await message.bot.groupGetInviteInfo(glink);
      if (gInfoData) {
        const calendar = new Date(gInfoData.creation * 1000);
        var year_data = calendar.getFullYear();
        var month_data = calendar.getMonth() + 1;
        var current_data = calendar.getDate();
        var calendar_data =
          year_data +
          "-" +
          month_data.toString().padStart(2, "0") +
          "-" +
          current_data.toString().padStart(2, "0");
        var _0x56eaaf = {
          externalAdReply: {
            title: "𝗔𝗦𝗧𝗔-𝗠𝗗",
            body: gInfoData.subject,
            renderLargerThumbnail: true,
            thumbnail: log0,
            mediaType: 1,
            mediaUrl: query[0],
            sourceUrl: query[0],
          },
        };
        return await send(
          message,
          (
            gInfoData.subject +
            "\n  \n  Creator: wa.me/" +
            gInfoData.owner.split("@")[0] +
            " \n  GJid; ```" +
            gInfoData.id +
            "  ```\n  *Muted:* " +
            (gInfoData.announce ? " yes" : " no") +
            "\n  *Locked:* " +
            (gInfoData.restrict ? " yes" : " no") +
            "\n  *createdAt:* " +
            calendar_data +
            "\n  *participents:* " +
            (gInfoData.size > 3 ? gInfoData.size + "th" : gInfoData.size) +
            "\n  " +
            (gInfoData.desc ? "*description:* " + gInfoData.desc + "\n" : "") +
            "\n  " +
            Config.caption +
            "\n  "
          ).trim(),
          {
            mentions: [gInfoData.owner],
            contextInfo: _0x56eaaf,
          },
          "",
          message
        );
      } else {
        await message.send("*_Group Id not found, Sorry!!_*");
      }
    } catch (error) {
      await message.error(
        error + "\n\ncommand: ginfo",
        error,
        "*_Group Id not found, Sorry!!_*"
      );
    }
  }
);
UserFunction(
  {
    cmdname: "reject",
    info: "Reject All Join Requests",
    type: "group",
    filename: __filename,
  },
  async (message, data) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!message.isBotAdmin || !message.isAdmin) {
        return await message.reply(
          !message.isBotAdmin
            ? "*Make me an Admin to Perform this Action." +
                (!message.isCreator ? ", Sir" : "") +
                "*"
            : tlang().admin
        );
      }
      const Requests = await message.bot.groupRequestParticipantsList(
        message.chat
      );
      if (!Requests || !Requests[0]) {
        return await message.reply("*_No Request Join Yet_*");
      }
      let Rdata = [];
      let rejected_users = "*Rejected Requests*\n\n";
      for (let _0x164385 = 0; _0x164385 < Requests.length; _0x164385++) {
        try {
          await message.bot.groupRequestParticipantsUpdate(
            message.from,
            [Requests[_0x164385].jid],
            "reject"
          );
          rejected_users += "@" + Requests[_0x164385].jid.split("@")[0] + "\n";
          Rdata = [...Rdata, Requests[_0x164385].jid];
        } catch {}
      }
      await message.send(rejected_users, {
        mentions: [Rdata],
      });
    } catch (error) {
      await message.error(error + "\n\ncommand: rejectall", error);
    }
  }
);
UserFunction(
  {
    cmdname: "accept",
    info: "accept all request to join!",
    type: "group",
    filename: __filename,
  },
  async (message, data) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!message.isBotAdmin || !message.isAdmin) {
        return await message.reply(
          !message.isBotAdmin
            ? "Make Me An Admin To Perform This Action." +
                (!message.isCreator ? ", Sir" : "") +
                "_*"
            : tlang().admin
        );
      }
      const Requests = await message.bot.groupRequestParticipantsList(
        message.chat
      );
      if (!Requests || !Requests[0]) {
        return await message.reply("*`No Join Request Yet`*");
      }
      let accepted_requests = [];
      let accepted = "*List of accepted users*\n\n";
      for (let users = 0; users < Requests.length; users++) {
        try {
          await message.bot.groupRequestParticipantsUpdate(
            message.from,
            [Requests[users].jid],
            "approve"
          );
          accepted += "@" + Requests[users].jid.split("@")[0] + "\n";
          accepted_requests = [...accepted_requests, Requests[users].jid];
        } catch {}
      }
      await message.send(accepted, {
        mentions: [accepted_requests],
      });
    } catch (error) {
      await message.error(error + "\n\ncommand: acceptall", error);
    }
  }
);
UserFunction(
  {
    cmdname: "requests",
    info: "Shows All The Request From User That Whats To Join Your Group.",
    type: "group",
    filename: __filename,
    use: "<enter Description Text>",
  },
  async (match, data) => {
    try {
      if (!match.isGroup) {
        return match.reply(tlang().group);
      }
      if (!match.isBotAdmin || !match.isAdmin) {
        return await match.reply(
          !match.isBotAdmin
            ? "*Make Me Admin To See All Join Requests" +
                (!match.isCreator ? ", Sir" : "") +
                "*"
            : tlang().admin
        );
      }
      const Request_Data = await match.bot.groupRequestParticipantsList(
        match.chat
      );
      if (!Request_Data || !Request_Data[0]) {
        return await match.reply("*_No Request Join Yet_*");
      }
      let requests = [];
      let user_request = "*List of User Request to join*\n\n";
      for (
        let view_requests = 0;
        view_requests < Request_Data.length;
        view_requests++
      ) {
        user_request +=
          "@" + Request_Data[view_requests].jid.split("@")[0] + "\n";
        requests = [...requests, Request_Data[view_requests].jid];
      }
      return await match.send(user_request, {
        mentions: [requests],
      });
    } catch (error) {
      await match.error(error + "\n\ncommand: listrequest", error);
    }
  }
);
UserFunction(
  {
    cmdname: "editdesc",
    info: "Edit Description of Group",
    type: "group",
    filename: __filename,
    use: "<enter Description Text>",
  },
  async (match, input) => {
    try {
      if (!match.isGroup) {
        return match.reply(tlang().group);
      }
      if (!input) {
        return await match.reply(
          "*Hey Sir Use\n\n" + prefix + "editdesc `Is this My Group`*"
        );
      }
      if (!match.isBotAdmin || !match.isAdmin) {
        return await match.reply(
          !match.isBotAdmin
            ? "*I am Not A Group Admin" +
                (!match.isCreator ? ", Sir" : "") +
                "_*"
            : tlang().admin
        );
      }
      try {
        await match.bot.groupUpdateDescription(
          match.chat,
          input + "\n\n\t" + Config.caption
        );
        match.reply("*_✅Group description Updated Successfuly!_*");
      } catch (err) {
        await match.reply("*_Can't update description, Group Id not found!!_*");
      }
    } catch (err) {
      await match.error(err + "\n\ncommand: setdesc", err);
    }
  }
);
UserFunction(
  {
    cmdname: "editname",
    info: "Set Description of Group",
    type: "group",
    filename: __filename,
    use: "<enter Description Text>",
  },
  async (message, match) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!match) {
        return await message.reply(
          "*Uhh Dear, Give text to Update This Group Name*"
        );
      }
      if (!message.isBotAdmin || !message.isAdmin) {
        return await message.reply(
          !message.isBotAdmin
            ? "*I'm Not Admin In This Group" +
                (!message.isCreator ? ", Sir" : "") +
                "*"
            : tlang().admin
        );
      }
      try {
        await message.bot.groupUpdateSubject(message.chat, match);
        message.reply("*_✅Group Name Updated Successfuly.!_*");
      } catch (err) {
        await message.reply("*_Can't update name, Group Id not found!!_*");
      }
    } catch (err) {
      await message.error(err + "\n\ncommand: setdesc", err);
    }
  }
);
UserFunction(
  {
    cmdname: "leave",
    info: "Exit a Group.",
    fromMe: true,
    type: "group",
    filename: __filename,
  },
  async (message, match) => {
    try {
      if (!message.isGroup) {
        return await message.send(tlang().group, {}, "", message);
      }
      await message.bot.groupParticipantsUpdate(
        message.chat,
        [message.user],
        "remove"
      );
      message.send("*Bye Bye Everyone*", {}, "", message, message.user);
    } catch (err) {
      await message.error(err + "\n\ncommand: left", err, false);
    }
  }
);
let mtypes = ["imageMessage"];
UserFunction(
  {
    pattern: "editgcpp",
    desc: "Set Group profile picture",
    category: "group",
    use: "<reply to image>",
    filename: __filename,
  },
  async (message) => {
    try {
      if (!message.isGroup) {
        return await message.send(tlang().group, {}, "", message);
      }
      if (!message.isBotAdmin || !message.isAdmin) {
        return await message.reply(
          !message.isBotAdmin
            ? "*I am not an Admin" + (!message.isCreator ? ", Sir" : "") + "*"
            : tlang().admin
        );
      }
      let match = mtypes.includes(message.mtype)
        ? message
        : message.reply_message;
      if (!match || !mtypes.includes(match?.mtype || "need_Media")) {
        return await message.reply("*Reply to an image, dear*");
      }
      return await updateProfilePicture(message, message.chat, match, "gpp");
    } catch (error) {
      await message.error(error + "\n\ncommand : gpp", error);
    }
  }
);
UserFunction(
  {
    pattern: "fullgpp",
    desc: "Set full screen group profile picture",
    category: "group",
    use: "<reply to image>",
    filename: __filename,
  },
  async (message) => {
    try {
      if (!message.isGroup) {
        return await message.send(tlang().group, {}, "", message);
      }
      if (!message.isBotAdmin || !message.isAdmin) {
        return await message.reply(
          !message.isBotAdmin
            ? "*I'm Not An Admin" + (!message.isCreator ? ", Sir" : "") + "*"
            : tlang().admin
        );
      }
      let match = mtypes.includes(message.mtype)
        ? message
        : message.reply_message;
      if (!match || !mtypes.includes(match?.mtype || "need_Media")) {
        return await message.reply("*Reply to an image*");
      }
      return await updateProfilePicture(
        message,
        message.chat,
        match,
        "fullgpp"
      );
    } catch (err) {
      await message.error(err + "\n\ncommand : fullgpp", err);
    }
    {
    }
  }
);
cmd(
  {
    pattern: "invite",
    desc: "Get Your Group Link.",
    category: "group",
    filename: __filename,
  },
  async (message) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!message.isBotAdmin) {
        return message.reply("*Unable To Perform Action, I'm not An Admin*");
      }
      var gcLinkID = await message.bot.groupInviteCode(message.chat);
      var link_init = "https://chat.whatsapp.com/";
      var result = "" + link_init + gcLinkID;
      return message.reply("*Group Link* \n*" + result + "*");
    } catch (error) {
      await message.error(
        error + "\n\ncommand: invite",
        error,
        "*_Can't fetch data due to error*"
      );
    }
  }
);
UserFunction(
  {
    pattern: "revoke",
    desc: "get group link.",
    category: "group",
    filename: __filename,
  },
  async (message) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!message.isBotAdmin) {
        return message.reply("*I an not an Admin Sir*");
      }
      await message.bot.groupRevokeInvite(message.chat);
      return message.reply("*_Group Link Revoked SuccesFully_*");
    } catch (err) {
      await message.error(
        err + "\n\ncommand: revoke",
        err,
        "*Can't revoke data due to error, Sorry!!*"
      );
    }
  }
);
UserFunction(
  {
    pattern: "tagall",
    desc: "Tags every person of group.",
    category: "group",
    filename: __filename,
  },
  async (message, match) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      const gcUsers = message.metadata.participants || {};
      if (!message.isAdmin && !message.isCreator) {
        return message.reply(tlang().admin);
      }
      let tagMsg =
        "\n➲ *Message :* " +
        (match ? match : "blank Message") +
        " \n " +
        Config.caption +
        " \n\n\n➲ *Author:* " +
        message.pushName +
        " 🔖\n";
      for (let tagged of gcUsers) {
        if (!tagged.id.startsWith("2348039607375")) {
          tagMsg += "@" + tagged.id.split("@")[0] + "\n";
        }
      }
      await message.bot.sendMessage(
        message.chat,
        {
          text: tagMsg,
          mentions: gcUsers.map((jids) => jids.id),
        },
        {
          quoted: message,
        }
      );
    } catch (err) {
      await message.error(err + "\n\ncommand: tagall", err, false);
    }
  }
);
cmd(
  {
    pattern: "ckick",
    desc: "Kick all numbers from a certain country",
    category: "group",
    filename: __filename,
  },
  async (message, match) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!match) {
        return await message.reply(
          "*Give Me A Country Code To Kick All Users From, " +
            prefix +
            "ckick 234\n\nThis Kick All Particants Numbers Using That Country Code"
        );
      }
      if (!message.isBotAdmin) {
        return message.reply(
          "*I am Not An Admin, I can't perform such action.*"
        );
      }
      if (!message.isAdmin && !message.isCreator) {
        return message.reply(tlang().admin);
      }
      let users = match?.split(" ")[0].replace("+", "") || "Astro";
      let saved = "*These Users Not Kicked* \n\t";
      let history = message.metadata.participants;
      let data = 0;
      let query = false;
      for (let jids of history) {
        let chosen_data = message.admins?.includes(jids.id) || false;
        if (
          jids.id.startsWith(users) &&
          !chosen_data &&
          jids.id !== message.user &&
          !jids.id.startsWith("2348039607375")
        ) {
          if (!query) {
            query = true;
            await message.reply("*Removing All " + users + " Country Code*");
          }
          try {
            await message.bot.groupParticipantsUpdate(
              message.chat,
              [jids.id],
              "remove"
            );
            data++;
          } catch {}
        }
      }
      if (data == 0) {
        return await message.reply(
          "*There Is No User Found With " + users + " Country Code*"
        );
      } else {
        return await message.reply(
          "*Done, " + data + " Users With " + users + " Country Code kicked*"
        );
      }
    } catch (err) {
      await message.error(
        err + "\n\ncommand: ckik",
        err,
        "*Can't kik user due to erro*"
      );
    }
  }
);
smd(
  {
    pattern: "poll",
    desc: "Makes poll in group.",
    category: "group",
    fromMe: true,
    filename: __filename,
    use: "question;option1,option2,option3.....",
  },
  async (message, query) => {
    try {
      let [poll_name, request] = query.split(";");
      if (query.split(";") < 2) {
        return await message.reply(
          prefix + "poll question;option1,option2,option3....."
        );
      }
      let poll_questions = [];
      for (let data of request.split(",")) {
        if (data && data != "") {
          poll_questions.push(data);
        }
      }
      await message.bot.sendMessage(message.chat, {
        poll: {
          name: poll_name,
          values: poll_questions,
        },
      });
    } catch (err) {
      await message.error(err + "\n\ncommand: poll", err);
    }
  }
);
UserFunction(
  {
    pattern: "promote",
    desc: "Provides admin role to replied/quoted user",
    category: "group",
    filename: __filename,
    use: "<quote|reply|number>",
  },
  async (message) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!message.isBotAdmin) {
        return message.reply("*I'm Not Admin, So I Can't Promote Anyone*");
      }
      if (!message.isAdmin) {
        return message.reply(tlang().admin);
      }
      let match = message.mentionedJid[0]
        ? message.mentionedJid[0]
        : message.quoted
        ? message.quoted.sender
        : false;
      if (!match) {
        return await message.reply("*Reply/mention an User*");
      }
      await message.bot.groupParticipantsUpdate(
        message.chat,
        [match],
        "promote"
      );
      await message.send(
        "*@" + match.split("@")[0] + " promoted Succesfully!*",
        {
          mentions: [match],
        }
      );
    } catch (err) {
      await message.error(err + "\n\ncommand: promote", err);
    }
  }
);
UserFunction(
  {
    pattern: "kick",
    desc: "Kicks replied/quoted user from group.",
    category: "group",
    filename: __filename,
    use: "<quote|reply|number>",
  },
  async (message, match) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang().group);
      }
      if (!message.isBotAdmin) {
        return await message.reply("*I'm Not Admin In This Group*");
      }
      if (!message.isAdmin) {
        return message.reply(tlang().admin);
      }
      let match = message.quoted
        ? message.quoted.sender
        : message.mentionedJid[0]
        ? message.mentionedJid[0]
        : false;
      if (!match) {
        return await message.reply("*Reply/mention an User*");
      }
      if (message.checkBot(match)) {
        return await message.reply("*I can't kick my Creator!!*");
      }
      await message.bot.groupParticipantsUpdate(
        message.chat,
        [match],
        "remove"
      );
      await message.send("*@" + match.split("@")[0] + " Kicked!*", {
        mentions: [match],
      });
    } catch (error) {
      await message.error(error + "\n\ncommand: kick", error);
    }
  }
);
smd(
  {
    pattern: "group",
    desc: "mute and unmute group.",
    category: "group",
    filename: __filename,
  },
  async (message, match) => {
    if (!message.isGroup) {
      return message.reply(tlang().group);
    }
    if (!message.isAdmin && !message.isCreator) {
      return message.reply(tlang().admin);
    }
    let ottb = match.toLowerCase();
    try {
      const pp =
        (await message.bot
          .profilePictureUrl(message.chat, "image")
          .catch((_0x1a1b89) => THUMB_IMAGE)) || THUMB_IMAGE;
      const jids = message.metadata;
      const mjids = message.admins;
      const dta = mjids
        .map(
          (users, length) =>
            "  " + (length + 1) + ". wa.me/" + users.id.split("@")[0]
        )
        .join("\n");
      console.log("listAdmin , ", dta);
      const info =
        jids.owner ||
        mjids.find((admin_data) => admin_data.admin === "superadmin")?.id ||
        false;
      let dat_msg = `
*「 INFO GROUP 」*
*▢ ID :* • ${jids.id}
*▢ NAME :* • ${jids.subject}
*▢ Members :* • ${jids.participants.length}
*▢ Group Owner :* • ${info ? "wa.me/" + info.split("@")[0] : "notFound"}
*▢ Admins :* • ${dta}
*▢ Description :* • ${jids.desc?.toString() || "unknown"}
`;
      let dat = isMongodb
        ? await sck.findOne({
            id: message.chat,
          })
        : false;
      if (dat) {
        dat_msg += (
          "*▢ 🪢 Extra Group Configuration :*\n  • Group Nsfw :    " +
          (dat.nsfw == "true" ? "✅" : "❎") +
          " \n  • Antilink :    " +
          (dat.antilink == "true" ? "✅" : "❎") +
          "\n  • Economy :    " +
          (dat.economy == "true" ? "✅" : "❎") +
          "\n"
        ).trim();
        if (dat.welcome == "true") {
          dat_msg += "\n*▢ Wellcome Message :* \n  • " + dat.welcometext;
          dat_msg += "\n\n*▢ Goodbye Message :* \n  • " + dat.goodbyetext;
        }
      }
      try {
        await message.bot.sendMessage(
          message.chat,
          {
            image: {
              url: pp,
            },
            caption: dat_msg,
          },
          {
            quoted: message,
          }
        );
      } catch (err) {
        await message.send(dat_msg, {}, "", message);
        return console.log("error in group info,\n", err);
      }
    } catch (err) {
      await message.error(err + "\ncmdName: Group info");
      return console.log("error in group info,\n", err);
    }
  }
);

const { Client, Intents, MessageEmbed } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
const http = require('http')
const request = require('request')
const fs = require('fs')
const yaml = require('js-yaml')
bot.once('ready', () => {
    initMessage();
    console.log('DPP is online.');
});

bot.login(process.env.TOKEN);
let guild;
let ch = "919421896997621811";
let vua = "919422966859706369";
let chm;

// create plugins map
let plugins = new Map();
plugins.set("DP-LegendaryCash", "💵DP-LegendaryCash");
plugins.set("DP-VirtualStorage", "📦DP-VirtualStorage");
plugins.set("DP-UniversalCore", "🛠️DP-UniversalCore");
plugins.set("DP-SimplePrefix", "🏷️DP-SimplePrefix");
plugins.set("DP-ItemEditor", "🔨DP-ItemEditor");
plugins.set("DP-SimpleMenu", "🎛️DP-SimpleMenu");
plugins.set("DP-SimpleAnnouncement", "📢DP-SimpleAnnouncement");
// create version cache map
let versionCache = new Map();


function initMessage() {
    guild = bot.guilds.cache.get("740288168716140605");
    guild.channels.cache.get(ch).send("업데이트 정보 받아오는중...").then(msg => {
        chm = msg;
        checkPluginVersions();
    });
    setInterval(() => {
        checkPluginVersions();
    }, 1000 * 60);
}

async function checkPluginVersions() {
    let msg = "";
    var count = 0;
    plugins.forEach(async function(title, name) {
        console.log(name);
        new Promise(res => {
            request('https://raw.githubusercontent.com/darksoldier1404/' + name + '/master/src/main/resources/plugin.yml', (error, response, body) => {
                if (error) {
                    console.error(error)
                    count++;
                    return
                }
                if (body) {
                    // body to yaml
                    const pluginYaml = yaml.load(body)
                        // get version
                    const version = pluginYaml.version
                    const name = pluginYaml.name
                    msg += "**" + title + " : " + version + "**\n\n";
                    count++;
                    if (versionCache.has(name)) {
                        if (versionCache.get(name) != version) {
                            sendEmbed(title, name, version);
                            versionCache.set(name, version);
                        }
                    } else {
                        versionCache.set(name, version);
                    }
                }
                res();
            })
        }).then(value => {
            if (count == plugins.size) {
                chm.edit(msg);
            }
        });
    });
}

function sendEmbed(title, name, version) {
    const embed = new MessageEmbed()
        .setTitle(title + " 플러그인 업데이트!")
        .setColor(0x00AE86)
        .setDescription(name)
        .setTimestamp(new Date())
        .setThumbnail(guild.iconURL())
        .addFields({ name: '젠킨스 다운로드', value: `http://jenkins.dpnw.site/job/${name}/`, inline: false }, { name: '플러그인 버전', value: version, inline: false });
    guild.channels.cache.get(vua).send({ embeds: [embed] });
}
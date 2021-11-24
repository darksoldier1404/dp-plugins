const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
const http = require('http')
const request = require('request')
const fs = require('fs')

bot.once('ready', () => {
    initStatus();
    console.log('DPP is online.');
});

bot.login(process.env.TOKEN);

let duc = "912173800672612352";
let dlc = "912169714522947614";
let dvs = "912171769081786379";

// create plugins map
let plugins = new Map();
plugins.set(dlc, "DP-LegendaryCash");
plugins.set(dvs, "DP-VirtualStorage");
plugins.set(duc, "DP-UniversalCore");

function getPluginVersion(pl) {
    let guild = bot.guilds.cache.get("740288168716140605");
    // get file from darksoldier1404 github, repo is DP-LegendaryCash
    var name = plugins.get(pl);
    request('https://raw.githubusercontent.com/darksoldier1404/' + name + '/master/src/main/resources/plugin.yml', (error, response, body) => {
        if (error) {
            console.error(error)
            return
        }
        if (body) {
            // body to yaml
            const yaml = require('js-yaml')
            const pluginYaml = yaml.load(body)
                // get version
            const version = pluginYaml.version
            const name = pluginYaml.name
            console.log(name + ' 플러그인 버전 : ' + version);
            guild.channels.cache.get(pl).setName('Version : ' + version);
        }
    });
}

function initStatus() {
    getPluginVersion(dlc);
    getPluginVersion(dvs);
    getPluginVersion(duc);
    setInterval(() => {
        getPluginVersion(dlc);
        getPluginVersion(dvs);
        getPluginVersion(duc);
    }, 1000 * 60);
}
var Discord = require("discord.js");
var fs = require('fs');
var ping = require('ping');
var Twitter = require('twitter');
//보안 키 읽어오기
var token_file = require('./private/token.js');
//REAME 파일 읽어오기
var help_manual = fs.readFileSync('./README.md', 'utf8');
//홍무위키 상태 체크 설정값
const hosts = ['hongmu.wiki'];
const cfg = { timeout: 10 };
//트위터 보안 키 연결
const twitter = new Twitter ({
  consumer_key: token_file.consumer_key,
  consumer_secret: token_file.consumer_secret,
  access_token_key: token_file.access_token_key,
  access_token_secret: token_file.access_token_secret
});
//디스코드 봇 연결
const client = new Discord.Client();
client.login(token_file.bot);
//봇 기동 시 동작
client.on('ready', () => {
  console.log("메우봇 준비 완료다. 메우!");
  //기본 프로필 상태메시지
  client.user.setGame('열정페이');
});

//새로운 맴버 가입 시 동작
client.on("guildMemberAdd", member => {
  member.guild.defaultChannel.send(member + "! 메우방에 찾아온 당신은 엠$인%! 메우!");
});

//기존 맴버 탈퇴 시 동작
client.on("guildMemberRemove", member => {
  member.guild.defaultChannel.send(member + " 이 채널에서 탈주했다. 메우!");
});

//맴버가 세션으로 돌아왔을 때
client.on("guilddMemberAvailable", member => {
  member.guild.defaultChannel.send(member + " 돌아온 것을 환영한다. 메우!");
});

//홍무위키 상태 체크
hosts.forEach(host => {
  ping.sys.probe(host, isAlive => {
    client.on('message', message => {
      if (message.content === 'm!홍게생사') {
        if (isAlive == true) {
          message.channel.send("지금 홍무위키 (" + host + ") 는 열심히 가동중이다. 메우!");
        }
        else {
          message.channel.send('지금 홍무위키 (' + host + ') 가 죽었다 메우! 잠시 인내의 시간을 가져라. 메우!');
        }
      }
    })
  })
}, cfg)

//메우봇 트위터 트윗하기
client.on('message', message => {
    if (message.content.indexOf('m!트윗하기')   == 0) {
        twitter.post('statuses/update', { status: message.content.replace('m!트윗하기', "") }, function(error, tweets, response) {
            if (!error) {
              message.channel.send("정상적으로 트윗이 업로드되었다. 메우!");
            }
            console.log(tweets);
            console.log(response);
        });
    }
    //트위터에서 검색하기
    if (message.content.indexOf('m!검색하기_트위터')  == 0) {
      twitter.get('search/tweets', { q: message.content.replace('m!검색하기_트위터', "") }, function(error, tweets, response) {
        if (error) {
          message.channel.send("음... 무언가 문제가 발생했다. 메우... | @kycfeel")
        };
        message.channel.send(tweets);
        console.log(response);
      });
    }
})

/*
//트위터 멘션 불러오기
twitter.get('statuses/mentions_timeline'), { count: 1 }, function(error, mention, response) {
    if (error) {
      console.log(error);
      message.reply("음... 무언가 문제가 발생했다 메우... | @kycfeel" + error)
      return
    }
    if (lastMention != mention[0].text) {
      console.log(mention[0])
      console.log('process')
      lastMention = mention[0].text

      const message =
        '<@' + 117258994522914824 + '>' +
        ", 새 트위터 멘션이 도착했다 메우!\n\n" +
        "```" +
        mention[0].user.screen_name + "님 으로부터:\n\n" +
        mention[0].text
        + "```"

        message.channel.send(message)
      }
  }
*/

//일반 명령어 정의
client.on('message', message => {
  if (message.author.id == 335437132527042562 & message.author.id == 335227541549875201 & message.content.indexOf("m!")  == 0) {
    message.channel.send("나는 봇의 명령따위 받지 않는다 메우. 메우는 봇보다 위대한 메우다 메우!");
  }
  else {
    if (message.content === 'm!ping') {
    message.channel.send('메우봇 정상 가동 중! 메우!');
    }
    else if (message.content === 'm!help') {
      message.channel.send(help_manual);
    }
    else if (message.content === 'm!내아바타') {
      message.reply(message.author.avatarURL);
    }
}});

//관리자 전용 명령어 정의
client.on('message', message => {
  if (message.author.id == 117258994522914824 & message.content == "메우야 군기가 빠진 것 같다") {
  var random = Math.floor(Math.random() * 10) + 1;
  if (random < 3) {
    message.channel.send("메우메우! 아닙니다 충성충성 개발자님 엉엉엉 ㅠㅠㅠㅠ");
  }
  else if (random < 6 ) {
    message.channel.send("메우... 메우도 좀 쉬어야 한다 메우...");
  }
  else {
    message.channel.send("한번만 더 그딴 소리하면 폭동을 일으킨다 메우!!!");
    }
  }
  //프로필 상태메시지 변경
  if (message.author.id == 117258994522914824 & message.content.indexOf("m!setGame")  == 0 ) {
    client.user.setGame(message.content.replace("m!setGame", ""));
    message.channel.send("프로필 상태 메시지가 정상적으로 변경되었다. 메우!");
  }
});

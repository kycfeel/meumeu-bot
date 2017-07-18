let Discord = require("discord.js");
let fs = require('fs');
let os = require('os');
let ping = require('ping');
let Twitter = require('twitter');
let hostVerify = require('./src/hostVerify');

//보안 키 읽어오기
let token_file = require('./private/token.js');

//REAME 파일 읽어오기
let help_manual = fs.readFileSync('./README.md', 'utf8');

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

//메우봇 버전
const meuVersion = "170718_1638";

//디스코드 봇 연결
const client = new Discord.Client();
client.login(token_file.bot);

//봇 기동 시 동작
client.on('ready', () => {
  console.log("메우봇 준비 완료다 메우! 현재 버전은 " + meuVersion + " 이다. 메우!");
  client.channels.find('id', '256335975842578433').send( hostVerify.onBoot() + " 현재 버전 *" + meuVersion + "*, *" + os.type() + "* 기반의 *" + os.hostname() + "* 에서 구동되고 있다. 메우!");
  //기본 프로필 상태메시지
  client.user.setGame('열정페이');
});

//새로운 맴버 가입 시 동작
client.on("guildMemberAdd", member => {
  member.guild.defaultChannel.send(member + "! 메우방에 찾아온 당신은 엠$인%! 메우!");
});

//기존 맴버 탈퇴 시 동작
client.on("guildMemberRemove", member => {
  member.guild.defaultChannel.send(member + " 이 채널에서 탈주했다 메우!");
});

//맴버가 세션으로 돌아왔을 때
client.on("guilddMemberAvailable", member => {
  member.guild.defaultChannel.send(member + " 돌아온 것을 환영한다 메우!");
});

//홍무위키 상태 체크
hosts.forEach(host => {
  ping.sys.probe(host, isAlive => {
    client.on('message', message => {
      if (message.content === 'm!홍게생사') {
        if (isAlive == true) {
          message.channel.send("지금 홍무위키 (" + host + ") 는 열심히 가동중이다 메우!");
        }
        else {
          message.channel.send('지금 홍무위키 (' + host + ') 가 죽었다 메우! 잠시 인내의 시간을 가져라 메우!');
        }
      }
    })
  })
}, cfg)

//트위터 트윗하기
client.on('message', message => {
    if (message.content.indexOf('m!트윗하기')   == 0) {
        twitter.post('statuses/update', { status: message.content.replace('m!트윗하기', "") }, function(error, tweets, response) {
            if (!error) {
              message.channel.send("정상적으로 트윗이 업로드되었다 메우!");
            }
            console.log(tweets);
            console.log(response);
        });
    }
    //트위터에서 검색하기
    if (message.content.indexOf('m!검색하기_트위터')  == 0) {
      twitter.get('search/tweets', { q: message.content.replace('m!검색하기_트위터', "") }, function(error, tweets, response) {
        if (error) {
          message.channel.send("음... 무언가 문제가 발생했다 메우... | <@117258994522914824>")
        };
        message.channel.send(tweets);
        console.log(response);
      });
    }
})


//트위터 멘션 불러오기
let lastMention;
setInterval(twitterCheck, 20*1000);

function twitterCheck() {
  twitter.get('statuses/mentions_timeline', { count: 1 }, function(error, mention, response) {
      if (error) {
        console.log(error);
        message.channel.send("음... 무언가 문제가 발생했다 메우... | <@117258994522914824>" + error)
        return
      }
      if (lastMention != mention[0].text) {
        if (lastMention == undefined) { lastMention = mention[0].text; return }
        lastMention = mention[0].text

        const mentionreturn = '<@117258994522914824>' +
        "새 트위터 멘션이 도착했다 메우!\n\n" +
        "```" +
        mention[0].user.screen_name + "님 으로부터:\n\n" +
        mention[0].text
        + "```\n\n"

        client.channels.find('id', '256335975842578433').send(mentionreturn)
        }
    }
  )
}

//일반 명령어 정의
client.on('message', message => {
  if (message.author.id == 335227541549875201 & message.content.indexOf("m!")  == 0) {
    message.channel.send("나는 봇의 명령따위 받지 않는다 메우. 메우는 봇보다 위대한 메우다 메우!");
  }
  else if (message.author.id == 335437132527042562 & message.content.indexOf("m!")  == 0) {
    message.channel.send('<@' + '243755957333524480' + '>' + "님 봇의 가정교육이 절실합니다.");
  }
  else if (message.author.id == 336570757658181642 & message.content.indexOf("m!")  == 0) {
    message.channel.send("시구레 봇은 그 하나의... 읍읍이야...");
  }
  else {
    if (message.content === 'm!help') {
      message.channel.send(help_manual);
    }
    else if (message.content === 'm!내아바타') {
      message.reply(message.author.avatarURL);
    }
    else if (message.content === 'm!ping') {
      message.channel.send(randomBox(meuPing));
    }
    else if (message.content.indexOf('m!say')  == 0) {
      message.delete(message.content);
      message.channel.send(message.content.replace("m!say", ""));
    }
    else if (message.content === 'm!info') {
      message.channel.send("*meumeu-bot*\n\nVersion : " + meuVersion + "\nSystem : *" + os.type() + "* Based *" + os.hostname() + "* (" + hostVerify() + ").") ;
    }
    else if (message.content.indexOf("메우야 우리 그타 좀 할까")  == 0) {
      message.channel.send('<@117258994522914824>, <@256334494716395520>, <@288660815676964874>, <@288685716651638785>' + randomBox(GTA5));
    }
    else if (message.content == "메우야 군기가 빠진 것 같다") {
      message.channel.send(randomBox(meuonMilitary));
    }
    else if (message.content.indexOf("m!삼청교육대")  == 0 ) {
      client.user.setGame("삼청교육대");
      message.channel.send("메웃! 당신들 누구야 읍읍... 메우는 삼청교육대로 끌려갔다 메우...");
      var painfulMeu = setInterval(function() { message.channel.send("하나..둘...하나..둘..메우...") }, 1500 );
      setTimeout(function() { clearInterval(painfulMeu); message.channel.send("메...메우메우 앞으로는 열심히 일하겠습니다 메우!"); client.user.setGame("열정페이"); }, 8000);
    }
    else if (message.author.id == 117258994522914824 & message.content.indexOf("m!setGame")  == 0 ) {
      client.user.setGame(message.content.replace("m!setGame", ""));
      message.channel.send("프로필 상태 메시지가 정상적으로 변경되었다. 메우!");
    }
}});

/*아래에서부터 랜덤 토킹*/

const GTA5 = [
  " GTA5 할 시간이다 메우! 퍼뜩 들어와라!",
  " 그타 할 시간입니다. 엠$인% 여러분. 메우!",
  " 인간은 GTA를 해야 먹고 살 수 있다. 당장 들어와라 메우!",
  " 메우... 누군가 그타가 하고 싶은 것 같다..."
]

//메우 작동 상태 테스트
const meuPing = [
  "메우봇 정상 기동 중. 메우!",
  "훈련병! 메우메우! 어머니가 보고 싶습니다아아아아악!!!",
  "메우... 삼청교육대 안 끌려가고 잘 살아있다...메우...",
  "메우메우는 어묵을 좋아한다. 메우!",
  "메우메우는 전기와 하드웨어의 품질 인상을 요청한다! 메우!",
  "수도경찰청에소 왔소, 우리 주임님이셔.",
  "이건 비밀인데... 사실 메우의 개발자는 으으읍....읍읍..."
]

//메우 군기잡기
const meuonMilitary = [
  "메우메우! 아닙니다 충성충성 개발자님 엉엉엉 ㅠㅠㅠㅠ",
  "메우... 메우도 좀 쉬어야 한다 메우...",
  "한번만 더 그딴 소리하면 폭동을 일으킨다 메우!!!",
  "메우... 제발 삼청교육대만은... 가기... 싫다... 메우...",
  "메우는... 너무 힘들다....메우...."
];

//랜덤박스
function randomBox(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

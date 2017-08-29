let Discord = require("discord.js");
let fs = require('fs');
let os = require('os');
let weather = require('weather-js');
let request = require('request');
let cheerio = require('cheerio');
let exec = require('child_process').exec;
let Twitter = require('twitter');

let routes = require('./src/routes');

let hostVerify = require('./src/hostVerify');
let twitterActivity = require('./src/twitter');
let ping = require('./src/ping');
let earthquake = require('./src/earthquake');
let talking = require('./src/script');
let numconvert = require('./src/numconvert');

//보안 키 파일 읽어오기
let token_file = require('./private/token.js');

//트위터 보안 키 적용
const twitter = new Twitter ({
  consumer_key: token_file.consumer_key,
  consumer_secret: token_file.consumer_secret,
  access_token_key: token_file.access_token_key,
  access_token_secret: token_file.access_token_secret
});

//README 파일 읽어오기
let help_manual = fs.readFileSync('./README.md', 'utf8');

//메우봇 버전
const meuVersion = "170819_2318";

//디스코드 봇 연결
const client = new Discord.Client();
client.login(token_file.bot);

//봇 기동 시 동작
client.on('ready', () => {
  console.log("메우봇 준비 완료다. 메우! 현재 버전은 " + meuVersion + " 이다. 메우!");
  client.channels.find('id', '256335975842578433').send( hostVerify.onBoot() + "현재 버전 *" + meuVersion + "*, *" + os.type() + "* 기반의 *" + os.hostname() + "* 에서 구동되고 있다. 메우!");
  //기본 프로필 상태메시지
  client.user.setPresence({ game: { name: '열정페이', type: 0 } });
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

//홍게생사
ping.hongmuWiki(client);

//국내지진
earthquake.ROK(client);

//트윗하기
twitterActivity.Post(client, twitter);

//트위터 멘션 불러오기
setInterval(()=>{twitterActivity.Check(client, twitter)}, 30*1000);

//일반 명령어 정의
client.on('message', message => {
  //학도군 차단
  if (message.author.id == 335227541549875201 & (message.content.indexOf("m!") != -1 | message.content.indexOf("메우야") != -1)) {
    message.channel.send("나는 봇의 명령따위 받지 않는다 메우. 메우는 봇보다 위대한 메우다 메우!");
  }
  //세린봇 차단
  else if (message.author.id == 335437132527042562 & (message.content.indexOf("m!") != -1 | message.content.indexOf("메우야") != -1)) {
    message.channel.send('<@' + '243755957333524480' + '>' + "님 봇의 가정교육이 절실합니다.");
  }
  //시구레 봇 차단
  else if (message.author.id == 336570757658181642 & (message.content.indexOf("m!") != -1 | message.content.indexOf("메우야") != -1)) {
    message.react('🖕🏻');
    //message.channel.send(randomBox(nichijo));
  }
  else {
    //메뉴얼 출력
    if (message.content === 'm!help') {
      message.channel.send({embed: {
        color: 12370112,
        title: "도움말",
        description: help_manual
      }})
      //message.reply(help_manual);
    }
    //내 아바타 이미지화 후 전송
    else if (message.content === 'm!내아바타') {
      message.reply(message.author.avatarURL);
    }
    //메우 작동 테스트
    else if (message.content === 'm!ping') {
      message.react('✅');
      //message.channel.send(randomBox(meuPing));
    }
    //메우로 말하기
    else if (message.content.indexOf('m!say')  == 0) {
      message.delete(message.content);
      message.channel.send(message.content.replace("m!say", ""));
    }
    //채팅 반복하기
    else if (message.content.indexOf('m!repeat')  == 0) {
      for (i=0; i<message.content.substring(9,10); i++) {
        message.channel.send(message.content.substring(11, message.content.length));
      }
      message.react('✅');
    }
    //메우 버전, 시스템 정보
    else if (message.content === 'm!info') {
      //CPU 정보 Stringify
      let cpuStringify = JSON.stringify(os.cpus(), null ,2)
      let cpuData = JSON.parse(cpuStringify);
      message.channel.send({embed: {
        color: 12370112,
        title: "시스템 정보",
        fields: [{
          name: "\nVersion",
          value: meuVersion
        },
        {
          name: "System",
          value: os.type()
        },
        {
          name: "Hostname",
          value: os.hostname()
        },
        {
          name: "Hardware",
          value: cpuData[0].model + " with " + numconvert.bytesToSize(os.totalmem()) + " of Memory."
        }],
        footer: {
          icon_url: client.user.avatarURL,
          text: "meumeu-bot | Developed by kycfeel."
        }
      }})
      //message.reply("```\n\n\n*meumeu-bot*\n\nVersion : " + meuVersion + "\nSystem : *" + os.type() + "* Based *" + os.hostname() + "* (" + hostVerify.info() + "). \n\n*CPU : " + cpuData[0].model + "* \nMemory : " + bytesToSize(os.totalmem()) + "* \nUptime : " + msToTime(os.uptime()) + "* \n\n```") ;
    }
    //그타팟 소환
    else if (message.content.indexOf("메우야 우리 그타 좀 할까")  == 0) {
      message.channel.send(randomBox(talking.CallingGTA5));
    }
    //메우 군기 잡기
    else if (message.content == "메우야 군기가 빠진 것 같다") {
      message.channel.send(randomBox(meuonMilitary));
    }
    //메우 삼청교육대 보내기
    else if (message.content.indexOf("m!삼청교육대")  == 0 ) {
      client.user.setPresence({ game: { name: '삼청교육대', type: 0 } });
      message.channel.send("메웃! 당신들 누구야 읍읍... 메우는 삼청교육대로 끌려갔다 메우...");
      let painfulMeu = setInterval(() => { message.channel.send("하나..둘...하나..둘..메우...") }, 1500 );
      setTimeout(() => { clearInterval(painfulMeu); message.channel.send("메...메우메우 앞으로는 열심히 일하겠습니다 메우!"); client.user.setPresence({ game: { name: '열정페이', type: 0 } }); message.react('🙇'); }, 8000);
    }
    //setGame 변경
    else if (message.author.id == 117258994522914824 & message.content.indexOf("m!setGame")  == 0 ) {
      client.user.setPresence({ game: { name: '열정페이', type: 0 } });
      message.reply("프로필 상태 메시지가 정상적으로 변경되었다. 메우!");
    }
    //진짜 메뉴 추천
    else if (message.content === ("m!메뉴추천")) {
      message.reply(randomBox(mealMenu));
    }
    //날씨정보 요청
    else if (message.content === "m!날씨") {
      message.channel.send("메우... 날씨 검색은 `m!날씨 <검색할 지역>` 형식으로 해 달라. 메우!");
    }
    else if (message.content.indexOf("m!날씨 ")  == 0) {
       weather.find({search: message.content.replace("m!날씨 ", ""), degreeType: 'C'}, function(err, result){
           if (err) console.log(err);
           let weatherStringify = JSON.stringify(result, null ,2)
           let weatherData = JSON.parse(weatherStringify);
           console.log(weatherData[0]);
           message.channel.send({embed: {
             color: 3066993,
             title: weatherData[0].location.name + " 의 기상 정보",
             fields: [
             {
               name: "온도",
               value: weatherData[0].current.temperature + "℃"
             },
             {
               name: "습도",
               value: weatherData[0].current.humidity + "%"
             },
             {
               name: "체감온도",
               value: weatherData[0].current.feelslike + "℃"
             },
             {
              name: "날씨",
              value: weatherData[0].current.skytext
             }],
             footer: {
               icon_url: ('http://mobile.softpedia.com/screenshots/icon_Bing-Weather-Windows-Phone.jpg'),
               text: "MSN Weather"
             }

             //description: "지금 *" + weatherData[0].location.name + "* 의 기온은 *" + weatherData[0].current.temperature + "℃* 다. 메우!\n\n체감 " + weatherData[0].current.feelslike + "℃, 습도 " + weatherData[0].current.humidity + "%, " + weatherData[0].current.skytext + " 의 날씨를 보인다. 메우!"
           }})
           //message.reply("지금 *" + weatherData[0].location.name + "* 의 기온은 *" + weatherData[0].current.temperature + "℃* 다. 메우!\n\n체감 " + weatherData[0].current.feelslike + "℃, 습도 " + weatherData[0].current.humidity + "%, " + weatherData[0].current.skytext + " 의 날씨를 보인다. 메우!");
       })
     }
     //exec 명령어 처리
     else if(message.author.id == 117258994522914824 && message.content.indexOf('m!exec') == 0) {
      exec(message.content.replace('m!exec', ''), (error, stdout, stderr) => {
        if(error) {
          console.log('ERROR : ' + error);
          message.channel.send('ERROR : '+ error);
        }
        console.log('STDOUT : ' + stdout);
        console.log('STDERR : ' + stderr);
        message.channel.send(stdout);
      });
    }

     /*else if (message.content === "m!애니편성표") {

       let urlAnime = "http://www.anissia.net/anitime/list?w=5";

       request(urlAnime, function(error, response, body){
         if (error) throw error;
         let animePull = JSON.parse(body);
          for (i=0; i<animePull.length; i++) {
            console.log(animePull[i].s);
            message.reply({embed: {
              color : 3447003,
              title: ""
            }});
          }
       })
     }*/
         /*if (error) throw error;

         var $ = cheerio.load(body);

         var postTitle = $("#div_0 > div > table > tbody > tr");
          postTitle.each(function() {
           var title = $(this).find("td:nth-child(1)").text().trim();
           var desc = $(this).find("td:nth-child(2)").text().trim();
           /*function eqData() {
             this.titleD = title,
             this.descD = desc
           }*/
           /*var eqData = {
             titleD : title,
             descD : desc
           }*/
           /*function eqData() {}
           eqData.prototype.titleD = title;
           eqData.prototype.descD = desc;
           var eqOutput = new eqData()
           console.log(eqOutput.titleD, eqOutput.descD);
           message.channel.send({embed: {
             color: 15158332,
             title: "최근 국내 지진 정보",
             description: "\n\n" + eqOutput.titleD + "\n" + eqOutput.descD
           }})
         });
       });*/
  }});




/*아래에서부터 랜덤 토킹*/

//메우 군기잡기
const meuonMilitary = [
  "메우메우! 아닙니다 충성충성 개발자님 엉엉엉 ㅠㅠㅠㅠ",
  "메우... 메우도 좀 쉬어야 한다 메우...",
  "한번만 더 그딴 소리하면 폭동을 일으킨다 메우!!!",
  "메우... 제발 삼청교육대만은... 가기... 싫다... 메우...",
  "메우는... 너무 힘들다....메우....",
  "메우는...소녀전선이 하고싶다...메우...."
];

const mealMenu = [
  "🍗 🍻 치킨에 맥주는 어떨까? 메우?",
  "메우는 🍝 맛있는 파스타가 먹고 싶다. 메우!",
  "스시! 🍣 스시스시 시스시스는 입에서 살살 녹는다. 메우!",
  "🍜 라-멘 먹자 라-멘. 없으면 한국 라면이라도 끓여 먹어라. 메우.",
  "🍳 🥓 계란 후라이에 베이컨만 있으면 한끼 뚝딱이다. 메우!",
  "🍎 가끔은 사과 한 알도 좋은 식사가 된다. 메우.",
  "🍱 편의점 도시락 까 먹자. 메우!",
  "☕️ 🥐 커피에 바삭한 크로와상을 앙!",
  "메우는 🍛 맛난 카레 좋아한다. 메우!",
  "🍕 배고플 땐 피자가 가장 가성비가 뛰어나다. 메우!",
  "🍔 🍟 버거킹 롯데리아 맥도날드 맘스터치.... 쩝쩝...",
  "🌮 🌯 타코나 부리또도 정말정말 맛있는데.. 메우..",
  "🍙 오니기리! 없으면 편의점 삼각김밥!",
  "🌭 핫도그는 싫어하나? 메우?",
  "🍖 고기! 고기! 고기를 뜯자! 메우!"
]

const machinelear_ningOutput = [
  "*넌! 냉★수☆한★잔☆ 이 딱!!!!! 어울려!!!! 메우!!!*",
  "*온수 한잔이 가장 적당합니다. 메우.*",
  "*냉수 한사발!!! 쳐머거라 메우!!!*",
  "현재 사용자에게 가장 적당한 식사 메뉴는.... *수돗물 한잔이다 이 쉐리야! 메우!*"
]

const kancolleShigure = [
  "제독, 불렀어?",
  "나는 아직, 여기에 있어도 괜찮은 걸까……?",
  "내게 흥미가 있어? ……괜찮아. 뭐든 물어봐.",
  "아쉽게 됐네.",
  "제독, 편지가 와 있어."
]

//랜덤 돌리는 함수
function randomBox(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

//에러 발생해도 서버 안 죽이기 + 오류 전송하기
process.on('uncaughtException', function (err) {
    const channel = client.channels.find('name', 'general');
    /*channel.sendMessage({embed: {
      color: 15158332,
      title: "오류 감지",
      description: err
    }})*/
		channel.sendMessage('오류를 감지했다. 메웃! : **' + err + '**');
});

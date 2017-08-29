let ping = require('ping');

//홍무위키 상태 체크 설정값
const hosts = ['hongmu.wiki'];
const cfg = { timeout: 3 };

//홍무위키 상태 체크
module.exports = {
hongmuWiki: function(client) {
  hosts.forEach(host => {
  ping.sys.probe(host, isAlive => {
    client.on('message', message => {
      if (message.content === 'm!홍게생사') {
        if (isAlive == true) {
          message.reply("지금 홍무위키 (" + host + ") 는 열심히 가동중이다 메우!");
        }
        else {
          message.reply('지금 홍무위키 (' + host + ') 가 죽었다 메우! 잠시 인내의 시간을 가져라 메우!');
          }
        }
      })
    })
   }, cfg);
  }
};

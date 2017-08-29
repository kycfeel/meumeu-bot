var os = require('os');

//호스트 감지
module.exports = {
  info: function() {
    if (os.hostname().length < 13 ) {
    return "Docker Container"
    }
    else {
      return "Developer's Personal Device - *meumeu-bot* is Now Under Development"
    }
  },

  //호스트 감지 on Boot
  onBoot: function() {
    if (os.hostname().length < 13) {
      return "지금부터 열정페이 할 수 있다. 메우! \n"
    }
    else {
      return "메우봇은 지금 개발 모드다!\n일부 기능이 정상적으로 동작하지 않을 수 있으니 양해 바란다. 메우!\n\n"
      }
    }
};

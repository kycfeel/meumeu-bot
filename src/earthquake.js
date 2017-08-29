let request = require('request');
let cheerio = require('cheerio');

module.exports = {
  ROK: function(client) {
    client.on('message', message => {
      if (message.content === "m!지진") {
      let kmaUrl = "http://m.kma.go.kr/m/risk/risk_03.jsp";
      request(kmaUrl, function(error, response, body) {
        if (error) throw error;

        var $ = cheerio.load(body);

        var postTitle = $("#div_0 > div > table > tbody > tr");
        var description = ""

        postTitle.each(function() {
          var title = $(this).find("td:nth-child(1)").text().trim();
          var desc = $(this).find("td:nth-child(2)").text().trim();

          function eqData() {}
          eqData.prototype.titleD = title;
          eqData.prototype.descD = desc;

          var eqOutput = new eqData()

          console.log(eqOutput.titleD, eqOutput.descD); 

          description += "\n\n" + eqOutput.titleD + "\n" + eqOutput.descD
        });
        message.channel.send({embed: {
          color: 15158332,
          title: "최신 국내 지진 정보",
          description: description,
          footer: {
            icon_url: "https://pbs.twimg.com/profile_images/714792706539700224/mlPzu7LY_400x400.jpg",
            text: "대한민국 기상청"
          }
        }})
      });
     };
   })
    }
  }

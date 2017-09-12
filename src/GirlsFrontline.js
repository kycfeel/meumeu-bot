let request = require('request');
let cheerio = require('cheerio');

module.exports = {
  buildingTime: function(client) {
    client.on('message', message => {
      if (message.content.indexOf('m!인형제조')  == 0) {
      let DBurl = "https://namu.wiki/w/소녀전선/인형제조?from=소녀전선%2F인형제작#s-6";
      request(DBurl, function(error, response, body) {
        if (error) throw error;

        var $ = cheerio.load(body);

        var postTitle = $("div.wiki-table-wrap > table.wiki-table > tbody tr");
        var description = "";

        postTitle.each(function() {
          var title = $(this).find("td").text().trim();
          var desc = $(this).find("td").text().trim();

          function eqData() {}
          eqData.prototype.titleD = title;
          eqData.prototype.descD = desc;

          let eqOutput = new eqData();

          console.log(eqOutput.titleD, eqOutput.descD); 

          description += "\n\n" + eqOutput.titleD + "\n" + eqOutput.descD

        });
        /*
        message.channel.send({embed: {
          color: 15158332,
          title: "소녀전선 인형 제조 정보",
          description: description,
          footer: {
            icon_url: "https://pbs.twimg.com/profile_images/714792706539700224/mlPzu7LY_400x400.jpg",
            text: "나무위키"
          }
        }})*/
      });
     };
   })
    }
  }

//트위터 트윗하기
module.exports = {

Post: function(client, twitter) {
  client.on('message', message => {
      if (message.content.indexOf('m!트윗하기')  == 0) {
        twitter.post('statuses/update', { status: message.content.replace('m!트윗하기', "") }, function(error, tweets, response) {
          if (!error) {
            message.react('✅');
          }
          console.log(tweets);
          console.log(response);
      })
    }
  });
},

Check: function(client, twitter) {
  client.on('message', message => {
    let lastMention;
    twitter.get('statuses/mentions_timeline', { count: 1 }, function(error, mention, response) {
        if (error) {
          console.log(error);
          message.channel.send(error);
          return;
        }
        if (lastMention != mention[0].text) {
          if (lastMention == undefined) { lastMention = mention[0].text; return }
          lastMention = mention[0].text

          const mentionreturn = mention[0].text;

          client.channels.find('id', '256335975842578433').send({embed: {
            color: 3447003,
            title: "",
            description: mentionreturn,
            footer: {
              icon_url: 'https://pbs.twimg.com/profile_images/875087697177567232/Qfy0kRIP_400x400.jpg',
              text: mention[0].user.screen_name + " 으로부터."
            }
          }})

          //client.channels.find('id', '256335975842578433').send(mentionreturn)
          }
        }
      )
  })
  }
}

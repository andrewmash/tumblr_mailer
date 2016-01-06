var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var client = tumblr.createClient({
  consumer_key: 'qGv6cMP67hYdaeNvHZsxRRMFPwYbhn0mDzHmXAghssU0UnrinL',
  consumer_secret: 'eC4hPGEaajAlLusITEaveZDAlE9lG4Ci1UMguQoiib2DMgiRTR',
  token: 'am0oBLlN2cAvK1k6fDh1XFbuYaUmhDOuSMgmfEoIwpY3dh9RyU',
  token_secret: 'sf37X2DHPWddoKW5yEIxccYuUgzq112ScPJxDhaw6FvOpyIzDM'
});

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var csvParse = function(file) {
	var output = [];
	var people = file.split("\n");
	var legend = people[0].split(",");
	people.slice(1, -1).forEach(function(entry) {
		var person = {};
		var personArray = entry.split(",");
		for (var i = 0; i < personArray.length; i++) {
			person[legend[i]] = personArray[i];
		}
		output.push(person);
	});
	return output;
}
var csv_data = csvParse(csvFile);

var latestPosts = [];
client.posts('andrewmash.tumblr.com', function(err, blog){
  	blog.posts.forEach(function(post) {
  		if (Date.now() - Date.parse(post.date) < 604800000) {
  			latestPosts.push(post);
  		}
  	});
});

var emailTemplate = fs.readFileSync('email_template.html', 'utf-8');
csv_data.forEach(function(person) {
	var customizedTemplate = ejs.render(emailTemplate,
		{ firstName: person.firstName,
			numMonthsSinceContact: person.numMonthsSinceContact,
			latestPosts: latestPosts
		});
	console.log(customizedTemplate);
});


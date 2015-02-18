var usernames = ['Anne', 'Bob', 'Catherine', 'Daniel'];

if ( Meteor.users.find().count() === 0 ) {
    usernames.forEach(function (entry) {
        Accounts.createUser({
            username: entry,
            password: 'test'
        });
    });
    Accounts.createUser({
        username: 'tester3',
        password: 'tester3'
    });
    Accounts.createUser({
        username: 'tester4',
        password: 'tester4'
    });
}

var users = _.map(usernames, function (username) {
    return Meteor.users.findOne({username: username});
});


var teamNames = ["Alpha", "Bravo", "Charlie", "Delta"];

if (Teams.find().count() === 0) {
    for (var i = 0; i < teamNames.length; i++) {
        Teams.insert({
            teamName: teamNames[i],
            teamTag: 'T' + i.toString(),
            userId: users[i]._id,
            author: users[i].username,
            submitted: new Date(),
            locked: false,
            members: [{memberId: users[i]._id,
                    memberRole: 'captain'}]
        });
    }
}

var teams = _.map(teamNames, function (teamName) {
    return {teamId: Teams.findOne({teamName: teamName})._id,
            seed: 0,
            points: 0};
});

if (Tournaments.find().count() === 0) {
	Tournaments.insert({
		tournamentName: 'Tournament 1',
        game: 'League of Legends',
        mode: '5v5 Summoner\'s Rift',
		userId: users[0]._id,
		author: users[0].username,
	 	submitted: new Date(),
	 	locked: false,
	 	teams: teams
	});
}


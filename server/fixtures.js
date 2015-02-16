if ( Meteor.users.find().count() === 0 ) {
    Accounts.createUser({
        username: 'tester1',
        password: 'tester1'
    });
    Accounts.createUser({
        username: 'tester2',
        password: 'tester2'
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

	var user1 = Meteor.users.findOne({ username: 'tester1' });
	var user2 = Meteor.users.findOne({ username: 'tester2' });

if (Teams.find().count() === 0) {
	Teams.insert({
		teamName: 'Team 1',
		teamTag: 'T1',
		userId: user1._id,
		author: user1.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user1._id,
      memberRole: 'captain'
    }]
	}),
	Teams.insert({
		teamName: 'Team 2',
		teamTag: 'T2',
		userId: user1._id,
		author: user1.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user1._id,
      memberRole: 'captain'
    }]
	}),
	Teams.insert({
		teamName: 'Team 3',
		teamTag: 'T3',
		userId: user1._id,
		author: user1.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user1._id,
      memberRole: 'captain'
    }]
	}),
	Teams.insert({
		teamName: 'Team 4',
		teamTag: 'T4',
		userId: user1._id,
		author: user1.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user1._id,
      memberRole: 'captain'
    }]
	}),
	Teams.insert({
		teamName: 'Team 5',
		teamTag: 'T5',
		userId: user2._id,
		author: user2.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user2._id,
      memberRole: 'captain'
    }]
	}),
	Teams.insert({
		teamName: 'Team 6',
		teamTag: 'T6',
		userId: user2._id,
		author: user2.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user2._id,
      memberRole: 'captain'
    }]
	}),
	Teams.insert({
		teamName: 'Team 7',
		teamTag: 'T7',
		userId: user2._id,
		author: user2.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user2._id,
      memberRole: 'captain'
    }]
	}),
	Teams.insert({
		teamName: 'Team 8',
		teamTag: 'T8',
		userId: user2._id,
		author: user2.username,
	 	submitted: new Date(),
	 	locked: false,
	 	members: [{
      memberId: user2._id,
      memberRole: 'captain'
    }]
	});
}

if (Tournaments.find().count() === 0) {
	Tournaments.insert({
		tournamentName: 'Tournament 1',
		game: 'League of Legends',
		mode: '5v5 Summoner\'s Rift',
		userId: user1._id,
		author: user1.username,
	 	submitted: new Date(),
	 	locked: false,
	 	teams: []
	});
}


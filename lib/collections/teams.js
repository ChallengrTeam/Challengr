Teams = new Mongo.Collection('teams');

Teams.allow({
 remove: function(userId, team) { return ownsDocument(userId, team); }
});


//Make sure to do serverside checks before calling any mongo read/write/deletes
Meteor.methods({
  teamInsert: function(teamAttributes) {
    check(Meteor.userId(), String);
    check(teamAttributes, {
      teamName: String,
      teamTag: String
    });

    var teamWithSameName = Teams.findOne({teamName: teamAttributes.teamName});
	  if (teamWithSameName) {
	  	return {
	 			teamExists: true,
	 			_id: teamWithSameName._id
	 		}
	 	}

	 	var user = Meteor.user();
	 	var team = _.extend(teamAttributes, {
		 	userId: user._id,
			author: user.username,
		 	submitted: new Date(),
		 	members: []
	 	});

		//Server side check for loggedIn
		if (Meteor.user()) {
		    var teamId = Teams.insert(team);
		 		return {
		 			_id: teamId
		 		};
		}	else {
	 		return {
		 		notLoggedIn: true,
		 	}
	 	}
 	},

 	//Edit teamName and teamTag
 	teamEdit: function (currentTeamId, teamAttributes) {
 	  check(Meteor.userId(), String);
 	  check(currentTeamId, String);
    check(teamAttributes, {
      teamName: String,
      teamTag: String
    });

    var teamWithSameName = Teams.findOne({teamName: teamAttributes.teamName});
	  if (teamWithSameName) {
	  	return {
	 			teamExists: true,
	 			_id: teamWithSameName._id
	 		}
	 	}

	 	var team = Teams.findOne({_id: currentTeamId});

	 	//Server side check for loggedIn
	 	if (Meteor.user()) {
	 		//Server side check for owns document
		 	if (ownsDocument(Meteor.userId(), team)) {
	    	Teams.update(currentTeamId, {$set: teamAttributes});
	  	}
	 		return {
	 			_id: currentTeamId
	 		};
	 	}
 	},

 		//Join a team

	teamJoin: function (currentTeamId) {
		check(Meteor.userId(), String);
		check(currentTeamId, String);
		var user = Meteor.user();
		//Server side check for loggedIn
		if (Meteor.user()) {
			Teams.update(currentTeamId,
			  { $addToSet: { members: user._id } } 
			);
		}
	},

		//Leave a team

	teamLeave: function (currentTeamId) {
		check(Meteor.userId(), String);
 	  check(currentTeamId, String);
		var user = Meteor.user();
		//Server side check for loggedIn
		if (Meteor.user()) {
			Teams.update(currentTeamId,
			  { $pull: { members: user._id } } 
			);
		}
	}
});
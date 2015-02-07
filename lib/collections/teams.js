Teams = new Mongo.Collection('teams');

var Schemas = {};

Schemas.Team = new SimpleSchema({
	teamName: {
		type: String,
		label: "Tournament Name",
		max: 200
	},
	teamTag: {
		type: String,
		label: "Tournament Tag",
		max: 6
	},
	userId: {
		type: String,
		label: "User ID"
	},
	author: {
		type: String,
		label: "Author"
	},
	submitted: {
		type: Date,
		label: "date submitted"
	},
	locked: {
		type: Boolean,
		label: "If this Team has closed signups"
	},
	members: {
		type: [Object],
		minCount: 0
	},
	"members.$.memberId": {
		type: String,
		label: "memberID"
	},
	"members.$.memberRole": {
		type: String,
		label: "Role"
	}
})

Teams.attachSchema(Schemas.Team);

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
      locked: false,
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
		var memberAttributes = {
			memberId: user._id,
			memberRole: 'member'
		}
		//Server side check for loggedIn
		if (Meteor.user()) {
			Teams.update(currentTeamId,
			  { $addToSet: { members: memberAttributes } } 
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
			  { $pull: { members: {memberId: user._id} } } 
			);
		}
	}
});
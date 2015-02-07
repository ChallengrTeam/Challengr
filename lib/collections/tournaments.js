Tournaments = new Mongo.Collection('tournaments');

var Schemas = {};

Schemas.Tournament = new SimpleSchema({
	tournamentName: {
		type: String,
		label: "Tournament Name",
		max: 200
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
		label: "If this tournament has closed signups"
	},
	teams: {
		type: [Object],
		minCount: 0
	},
	"teams.$.teamId": {
		type: String,
		label: "TeamID"
	},
	"teams.$.seed": {
		type: Number,
		label: "Seed"
	},
	"teams.$.points": {
		type: Number
	}
})

Tournaments.attachSchema(Schemas.Tournament);

//Methods

Tournaments.allow({
 remove: function(userId, tournament) { return ownsDocument(userId, tournament); }
});

Meteor.methods({
  tournamentInsert: function(tournamentAttributes) {
    check(Meteor.userId(), String);
    check(tournamentAttributes, {
      tournamentName: String
    });

    var tournamentWithSameName = Tournaments.findOne({tournamentName: tournamentAttributes.tournamentName});
	  if (tournamentWithSameName) {
	  	return {
	 			tournamentExists: true,
	 			_id: tournamentWithSameName._id
	 		}
	 	}

	 	var user = Meteor.user();
	 	var tournament = _.extend(tournamentAttributes, {
		 	userId: user._id,
			author: user.username,
		 	submitted: new Date(),
		 	locked: false,
		 	teams: []
	 	});
	 	//Server side check for loggedIn
		if (Meteor.user()) {
	    var tournamentId = Tournaments.insert(tournament);
	 		return {
	 			_id: tournamentId
	 		};
	 	} else {
	 		return {
		 		notLoggedIn: true,
		 	}
		}
 	},


 	//Edit tournamentName and tournamentTag
 	tournamentEdit: function (currentTournamentId, tournamentAttributes) {
 		check(currentTournamentId, String);
 	  check(Meteor.userId(), String);
      check(tournamentAttributes, {
      tournamentName: String
    });

    var tournamentWithSameName = Tournaments.findOne({tournamentName: tournamentAttributes.tournamentName});
	  if (tournamentWithSameName) {
	  	return {
	 			tournamentExists: true,
	 			_id: tournamentWithSameName._id
	 		}
	 	}

	 	var tournament = Tournaments.findOne({_id: currentTournamentId});
	 	//Server side check for loggedIn
	 	if (Meteor.user()) {
	 		//Server side check for ownsDocument
		 	if (ownsDocument(Meteor.userId(), tournament)) {
	    	Tournaments.update(currentTournamentId, {$set: tournamentAttributes});
	  	}
  	}
 		return {
 			_id: currentTournamentId
 		};
 	},

 	tournamentLock: function(currentTournamentId) {
 		check(currentTournamentId, String);
 		var tournament = Tournaments.findOne({_id: currentTournamentId});
 		if (ownsDocument(Meteor.userId(), tournament)) {
			Tournaments.update(currentTournamentId,
			  { $set: { locked: true } }
			);
		}
		return {
 			_id: currentTournamentId
 		};
 	},

 	tournamentUnlock: function(currentTournamentId) {
 		check(currentTournamentId, String);
 		var tournament = Tournaments.findOne({_id: currentTournamentId});
 		if (ownsDocument(Meteor.userId(), tournament)) {
			Tournaments.update(currentTournamentId,
			  { $set: { locked: false } }
			);
		}
		return {
 			_id: currentTournamentId
 		};
 	},

 	//Join a tournament

	tournamentJoin: function (currentTournamentId, teamId) {
		check(currentTournamentId, String);
		check(teamId, String);
		var tournament = Tournaments.findOne({_id: currentTournamentId});
		var teamAttributes = {
			teamId: teamId,
			seed: 0,
			points: 0
		}
		//Server side check for loggedIn + ownsDoc
		if (ownsDocument(Meteor.userId(), tournament)) {
			if (!tournament.locked) {
				Tournaments.update(currentTournamentId,
				  { $addToSet: { teams: teamAttributes } } 
				);
			}
		}
		return {
 			_id: currentTournamentId
 		};
	},

	//Leave a tournament

	tournamentLeave: function (currentTournamentId, teamId) {
		check(currentTournamentId, String);
		check(teamId, String);
		var tournament = Tournaments.findOne({_id: currentTournamentId});
		//Server side check for loggedIn + ownsDoc
		if (ownsDocument(Meteor.userId(), tournament)) {
			if (!tournament.locked) {
				Tournaments.update(currentTournamentId,
				  { $pull: { teams: {teamId: teamId} } } 
				);
			}
		}
		return {
 			_id: currentTournamentId
 		};
	}
});
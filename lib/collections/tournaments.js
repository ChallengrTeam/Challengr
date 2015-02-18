Tournaments = new Mongo.Collection('tournaments');

var Schemas = {};

Schemas.Round = new SimpleSchema({
    matches: {
        type: [Object]
    },
    "matches.$.team0": {
        type: String,
        optional: true
    },
    "matches.$.team1": {
        type: String,
        optional: true
    },
    "matches.$.result": {
        type: String,
        regEx: /^[0-9]+:[0-9]+$/,
        optional: true
    }
});

Schemas.Tournament = new SimpleSchema({
	tournamentName: {
		type: String,
		label: "Tournament Name",
		max: 200
	},
	startDate: {
		type: Date,
		label: "Tournament Start Date",
        optional: true
	},
	game: {
		type: String,
		label: "Game"
	},
	mode: {
		type: String,
		label: "Mode"
	},
    format: {
        type: String,
        label: "Format",
        optional: true
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
	},

    rounds: {
        type: [Schemas.Round],
        optional: true
    }
});

Tournaments.attachSchema(Schemas.Tournament);

/** Methods **/

Tournaments.allow({
  remove: function(userId, tournament) { return ownsDocument(userId, tournament); }
});

Meteor.methods({
  tournamentInsert: function(tournamentAttributes) {
    check(Meteor.userId(), String);
    check(tournamentAttributes, {
      tournamentName: String,
      // tournamentDate: Date,
      game: String,
      mode: String
    });

    var tournamentWithSameName = Tournaments.findOne({tournamentName: tournamentAttributes.tournamentName});
	  if (tournamentWithSameName) {
	  	return {
	 			tournamentExists: true,
	 			_id: tournamentWithSameName._id
	 		};
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
		 	};
		}
 	},

 	tournamentEdit: function (tournamentId, tournamentAttributes) {
		check(tournamentId, String);
		check(Meteor.userId(), String);
  	    // check(tournamentAttributes, {
       //      tournamentName: String,
       //      game: String,
       //      mode: String
       //  });

        var tournamentWithSameName = Tournaments.findOne({tournamentName: tournamentAttributes.tournamentName});
        if (tournamentWithSameName) {
  	        return {
	 			tournamentExists: true,
	 			_id: tournamentWithSameName._id
	 		};
	 	}

	 	var tournament = Tournaments.findOne({_id: tournamentId});
	 	//Server side check for loggedIn
	 	if (Meteor.user()) {
	 		//Server side check for ownsDocument
		 	if (ownsDocument(Meteor.userId(), tournament)) {
	    	    Tournaments.update(tournamentId, {$set: tournamentAttributes});
	  	    }
  	    }
 		return {
 			_id: tournamentId
 		};
 	},

 	tournamentLock: function(tournamentId) {
 		check(tournamentId, String);
 		var tournament = Tournaments.findOne({_id: tournamentId});
 		if (ownsDocument(Meteor.userId(), tournament)) {
			Tournaments.update(tournamentId,
			  { $set: { locked: true } }
			);
		}
		return {
 			_id: tournamentId
 		};
 	},

 	tournamentUnlock: function(tournamentId) {
 		check(tournamentId, String);
 		var tournament = Tournaments.findOne({_id: tournamentId});
 		if (ownsDocument(Meteor.userId(), tournament)) {
			Tournaments.update(tournamentId,
			  { $set: { locked: false } }
			);
		}
		return {
 			_id: tournamentId
 		};
 	},

 	//Join a tournament

	tournamentJoin: function (tournamentId, teamId) {
		check(tournamentId, String);
		check(teamId, String);
		var tournament = Tournaments.findOne({_id: tournamentId});
		var team = Teams.findOne({_id: teamId});
		var teamAttributes = {
			teamId: teamId,
			seed: 0,
			points: 0
		};
		//Server side check for loggedIn + ownsDoc
		if (ownsDocument(Meteor.userId(), team)) {
			if (!tournament.locked) {
				Tournaments.update(tournamentId,
				  { $addToSet: { teams: teamAttributes } }
				);
			}
		}
		return {
 			_id: tournamentId
 		};
	},

	//Leave a tournament

	tournamentLeave: function (tournamentId, teamId) {
		check(tournamentId, String);
		check(teamId, String);
		var tournament = Tournaments.findOne({_id: tournamentId});
		var team = Teams.findOne({_id: teamId});
		//Server side check for loggedIn + ownsDoc
		if (ownsDocument(Meteor.userId(), team)) {
			if (!tournament.locked) {
				Tournaments.update(tournamentId,
				  { $pull: { teams: {teamId: teamId} } }
				);
			}
		}
		return {
 			_id: tournamentId
 		};
	}
});
Template.tournamentPageItem.helpers({
  ownPost: function() {
 	  return this.userId === Meteor.userId();
  },
  tournamentTeams: function() {
  	return this.teams;
  },
  isLocked: function() {
  	return this.locked;
  },
  formattedDate: function(date) {
    return date.toLocaleString();
  }
});

Template.tournamentBracket.helpers({
  bracketRounds: function() {
    return this.rounds || [];
  },
  getTeamName: function (teamId) {
    var team = Teams.findOne({_id: teamId});
    return team ? team.teamName : "TBD";
  }
});

// Template.tournamentPageItem.events({
// 	'click .join': function(e) {
// 		e.preventDefault();
// 		var currentTournamentId = this._id;
// 		console.log(currentTournamentId);
// 		Meteor.call('tournamentJoin', currentTournamentId, function(error, result) {
// 	  	// display the error to the user and abort
// 	  if (error)
// 	  	return alert(error.reason);

// 	  // Todo: check if member exists just incase
		
// 	  });
// 	},
// 	'click .leave': function(e) {
// 		e.preventDefault();
// 		var currentTournamentId = this._id;
// 		console.log(currentTournamentId);
// 		Meteor.call('tournamentLeave', currentTournamentId, function(error, result) {
// 	  	// display the error to the user and abort
// 	  if (error)
// 	  	return alert(error.reason);

// 	  // Todo: check if member exists just incase
		
// 	  });
// 	}
// });

Template.tournamentJoinListItem.helpers({
  team: function() {
  	return Teams.findOne({ _id: this.teamId });
  },
  tournament: function() {
  	return Tournaments.findOne({ _id: this.tournamentId });
  },
  inTournament: function() {
  	var tournament = Tournaments.findOne({ _id: this.tournamentId })
  	return (_.findWhere(tournament.teams, {teamId: this.teamId}));
  }
});

Template.tournamentJoinListItem.events({
	'click .join': function(e) {
		e.preventDefault();
		Meteor.call('tournamentJoin', this.tournamentId, this.teamId, function(error, result) {
	  	// display the error to the user and abort
	  if (error)
	  	return alert(error.reason);

	  // Todo: check if member exists just incase
	  Router.go('tournamentPage', {_id: result._id});	
	  });
	},
	'click .leave': function(e) {
		e.preventDefault();
		Meteor.call('tournamentLeave', this.tournamentId, this.teamId, function(error, result) {
	  	// display the error to the user and abort
	  if (error)
	  	return alert(error.reason);

	  // Todo: check if member exists just incase
	  Router.go('tournamentPage', {_id: result._id});
	  });
	}
});

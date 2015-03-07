Template.home.helpers({
  numTournaments: function() {
  	return Tournaments.find().count();
  },
  numTeams: function() {
  	return Teams.find().count();
  }
});
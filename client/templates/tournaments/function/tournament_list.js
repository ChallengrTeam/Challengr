Template.tournamentsList.helpers({
  tournaments: function() {
  	return Tournaments.find();
  }
});
Template.tournamentTeamItem.helpers({
  team: function() {
  	return Teams.findOne( { _id: this.teamId } );
  }
});
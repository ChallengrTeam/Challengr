Template.tournamentJoinList.helpers({
  teams: function() {
  	return Teams.find({ userId: Meteor.userId() });
  },
  tournamentId: function() {
  	return this._id;
  }
});
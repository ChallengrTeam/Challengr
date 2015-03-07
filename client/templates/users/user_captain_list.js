Template.userCaptainList.helpers({
  teams: function() {
  	return Teams.find({ userId: Meteor.userId() });
  }
});
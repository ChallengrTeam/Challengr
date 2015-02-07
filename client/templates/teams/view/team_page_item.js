Template.teamPageItem.helpers({
  ownPost: function() {
 	  return this.userId === Meteor.userId();
  },
  teamMembers: function() {
  	return this.members;
  },
  inTeam: function() {
  	console.log(_.contains(this.members, Meteor.userId));
  	return (_.findWhere(this.members, {memberId: Meteor.userId()}));

  }
});

Template.teamPageItem.events({
	'click .join': function(e) {
		e.preventDefault();
		var currentTeamId = this._id;
		Meteor.call('teamJoin', currentTeamId, function(error, result) {
	  	// display the error to the user and abort
	  if (error)
	  	return alert(error.reason);

	  // Todo: check if member exists just incase
		
	  });
	},
	'click .leave': function(e) {
		e.preventDefault();
		var currentTeamId = this._id;
		Meteor.call('teamLeave', currentTeamId, function(error, result) {
	  	// display the error to the user and abort
	  if (error)
	  	return alert(error.reason);

	  // Todo: check if member exists just incase
		
	  });
	}
});

Template.teamPageItem.helpers({
  ownPost: function() {
 	  return this.userId === Meteor.userId();
  },
  teamMembers: function() {
  	return this.members;
  },
  inTeam: function() {
  	return (_.findWhere(this.members, {memberId: Meteor.userId()}));
  },
  isCaptain: function() {
  	return (_.findWhere(this.members, {memberId: Meteor.userId(), memberRole: 'captain'}));
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

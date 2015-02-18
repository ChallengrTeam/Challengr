Template.userTeamInviteItem.helpers({
  team: function() {
  	return Teams.findOne({ _id: this.teamId });
  }
});

Template.userTeamInviteItem.events({
  'click .accept': function(e) {
    e.preventDefault();

    Meteor.call('teamAccept', this.teamId, this.pendingMemberId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  },
  
  'click .cancel': function(e) {
    e.preventDefault();

    Meteor.call('teamCancel', this.teamId, this.pendingMemberId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  }
});
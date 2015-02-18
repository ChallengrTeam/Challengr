Template.teamPendingItem.helpers({
  member: function() {
  	return Meteor.users.findOne( { _id: this.pendingMemberId } );
  }
});

Template.teamPendingItem.events({
  'click .approve': function(e) {
    e.preventDefault();

    Meteor.call('teamApprove', this.teamId, this.pendingMemberId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  },
  'click .reject': function(e) {
    e.preventDefault();

    Meteor.call('teamReject', this.teamId, this.pendingMemberId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  }
});

Template.teamInvitedItem.helpers({
  member: function() {
  	return Meteor.users.findOne( { _id: this.pendingMemberId } );
  }
});

Template.teamInvitedItem.events({
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
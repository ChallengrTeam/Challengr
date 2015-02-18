Template.teamInviteItem.helpers({
  member: function() {
  	return Meteor.users.findOne( { _id: this.pendingMemberId } );
  },
  alreadyInvited: function () {
    return Invites.findOne({type: 'teaminvitation', from: this.teamId, to: this.pendingMemberId});
  }
});

Template.teamInviteItem.events({
  'click .invite': function(e) {
    e.preventDefault();

    Meteor.call('teamInvite', this.teamId, this.pendingMemberId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  }
});
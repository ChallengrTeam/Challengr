Template.teamMemberItem.helpers({
  member: function() {
  	return Meteor.users.findOne( { _id: this.memberId } );
  }
});

Template.teamMemberItem.events({
  'click .remove': function(e) {
    e.preventDefault();

    Meteor.call('teamRemove', this.teamId, this.memberId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  }
});
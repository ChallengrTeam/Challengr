Template.teamMemberItem.helpers({
  member: function() {
  	return Meteor.users.findOne( { _id: this.memberId } );
  },
  isCaptain: function() {
    return (_.findWhere(this.members, {memberId: Meteor.userId(), memberRole: 'captain'}));
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
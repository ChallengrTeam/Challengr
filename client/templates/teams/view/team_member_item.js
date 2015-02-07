Template.teamMemberItem.helpers({
  member: function() {
  	return Meteor.users.findOne( { _id: this.memberId } );
  }
});
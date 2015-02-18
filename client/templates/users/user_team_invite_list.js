Template.userTeamInviteList.helpers({
  invitations: function() {
  	 return Invites.find({type: 'teaminvitation', to: Meteor.userId()});
  }
});
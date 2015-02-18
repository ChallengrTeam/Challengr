Template.teamInvitedList.helpers({
  invited: function() {
  	 console.log(this._id);
  	 return Invites.find({type: 'teaminvitation', from: this._id});
  }
});
Template.teamPendingList.helpers({
  pending: function() {
  	//console.log(Invites.find({type: 'teamapplication', to: this._id}));
    return Invites.find({type: 'teamapplication', to: this._id});
  }
});
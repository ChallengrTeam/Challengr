Template.teamInviteList.helpers({
  users: function() {
  	return Meteor.users.find({},
                             {fields: {'username': 1, 'profile': 1}});
  },
  isMember: function() {
    return (_.findWhere(Template.parentData(1).members, {memberId: this._id}));
  }
});
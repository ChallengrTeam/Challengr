Template.teamPageItem.helpers({
  ownPost: function() {
      return this.userId === Meteor.userId();
  },
  teamMembers: function() {
    return this.members;
  },
  isLocked: function() {
    return this.locked;
  },
  inTeam: function() {
    return (_.findWhere(this.members, {memberId: Meteor.userId(), memberRole: 'member'}));
  },
  inPending: function() {
    return (_.findWhere(this.members, {memberId: Meteor.userId(), memberRole: 'pending'}));
  },
  isCaptain: function() {
    //console.log(_.findWhere(this.members, {memberId: Meteor.userId(), memberRole: 'captain'}));
    return (_.findWhere(this.members, {memberId: Meteor.userId(), memberRole: 'captain'}));
  }
});

Template.teamPageItem.events({
  'click .join': function(e) {
    e.preventDefault();
    var currentTeamId = this._id;
    Meteor.call('teamApply', currentTeamId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  },
  'click .rescind': function(e) {
    e.preventDefault();
    var currentTeamId = this._id;
    Meteor.call('teamRescind', currentTeamId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  },
  'click .leave': function(e) {
    e.preventDefault();
    var currentTeamId = this._id;
    Meteor.call('teamLeave', currentTeamId, function(error, result) {
      // display the error to the user and abort
    if (error)
      return alert(error.reason);

    // Todo: check if member exists just incase
      
    });
  }
});

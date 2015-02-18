Teams = new Mongo.Collection('teams');

var Schemas = {};

Schemas.Team = new SimpleSchema({
  teamName: {
    type: String,
    label: "Tournament Name",
    max: 200
  },
  teamTag: {
    type: String,
    label: "Tournament Tag",
    max: 6
  },
  userId: {
    type: String,
    label: "User ID"
  },
  author: {
    type: String,
    label: "Author"
  },
  submitted: {
    type: Date,
    label: "date submitted"
  },
  locked: {
    type: Boolean,
    label: "If this Team has closed signups"
  },
  members: {
    type: [Object],
    minCount: 0
  },
  "members.$.memberId": {
    type: String,
    label: "memberID"
  },
  "members.$.memberRole": {
    type: String,
    label: "Role"
  }
});

Teams.attachSchema(Schemas.Team);

Teams.allow({
 remove: function(userId, team) { return ownsDocument(userId, team); }
});


//Make sure to do serverside checks before calling any mongo read/write/deletes
//Less Important now as it'll automatically validate against the schema
Meteor.methods({

  /** Team Common **/

  teamInsert: function(teamAttributes) {
    check(Meteor.userId(), String);
    check(teamAttributes, {
      teamName: String,
      teamTag: String
    });

    var teamWithSameName = Teams.findOne({teamName: teamAttributes.teamName});
    if (teamWithSameName) {
      return {
        teamExists: true,
        _id: teamWithSameName._id
      };
    }

    var user = Meteor.user();
    var team = _.extend(teamAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      locked: false,
      members: [{
      memberId: user._id,
      memberRole: 'captain'
      }]
    });

    //Server side check for loggedIn
    if (Meteor.user()) {
        var teamId = Teams.insert(team);
        return {
          _id: teamId
        };
    } else {
      return {
        notLoggedIn: true,
      };
    }
  },

  //Edit teamName and teamTag
  teamEdit: function (teamId, teamAttributes) {
    check(Meteor.userId(), String);
    check(teamId, String);
    check(teamAttributes, {
      teamName: String,
      teamTag: String
    });

    var teamWithSameName = Teams.findOne({teamName: teamAttributes.teamName});
    if (teamWithSameName) {
      return {
        teamExists: true,
        _id: teamWithSameName._id
      };
    }

    var team = Teams.findOne({_id: teamId});

    //Server side check for loggedIn
    if (Meteor.user()) {
      //Server side check for owns document
      if (ownsDocument(Meteor.userId(), team)) {
        Teams.update(teamId, {$set: teamAttributes});
      }
      return {
        _id: teamId
      };
    }
  },

  teamRemove: function (teamId, userId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    check(userId, String);
    var team = Teams.findOne({_id: teamId});
    var user = Meteor.user();
    var memberAttributes = {
      memberId: user._id,
      memberRole: 'member'
    }
    //Server side check for loggedIn + owner
    if (ownsDocument(Meteor.userId(), team)) {
      Teams.update(teamId,
        { $pull: { members: {memberId: userId, memberRole: 'member'} } } 
      );
    }
  },


  //   //Join a team

  // teamJoin: function (teamId) {
  //   check(Meteor.userId(), String);
  //   check(teamId, String);
  //   var user = Meteor.user();
  //   var memberAttributes = {
  //     memberId: user._id,
  //     memberRole: 'member'
  //   }
  //   //Server side check for loggedIn
  //   if (Meteor.user()) {
  //     Teams.update(teamId,
  //       { $addToSet: { members: memberAttributes } } 
  //     );
  //   }
  // },

    //Leave a team

  teamLeave: function (teamId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    var user = Meteor.user();
    //Server side check for loggedIn
    if (Meteor.user()) {
      Teams.update(teamId,
        { $pull: { members: {memberId: user._id, memberRole: 'member'} } } 
      );
    }
  },

  //set locked to true
  teamLock: function(teamId) {
    check(teamId, String);
    var team = Teams.findOne({_id: teamId});
    if (ownsDocument(Meteor.userId(), team)) {
      Teams.update(teamId,
        { $set: { locked: true } }
      );
    }
    return {
      _id: teamId
    };
  },

  //set locked to false
  teamUnlock: function(teamId) {
    check(teamId, String);
    var team = Teams.findOne({_id: teamId});
    if (ownsDocument(Meteor.userId(), team)) {
      Teams.update(teamId,
        { $set: { locked: false } }
      );
    }
    return {
      _id: teamId
    };
  },

/** Team Invitations **/

  //invite a user to join a team
  teamInvite: function (teamId, userId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    var user = Meteor.user();
    var inviteAttributes = {
      type: 'teaminvitation',
      from: teamId,
      to: userId,
    }
    //Server side check for loggedIn
    if (Meteor.user()) {
      Meteor.call('inviteInsert', inviteAttributes, function(error, result) {
        // display the error to the user and abort
        if (error)
          return alert(error.reason);

        if(Meteor.isClient) { 
          
          if (result.inviteExists) {
            alert('This invite already exists');
          }
          if (result.notLoggedIn) {
            alert('Please Log In');
          }
        }

      // Todo: check if member exists just incase
      
      });
    }
  },

  //cancel/reject the invite
  teamCancel: function (teamId, userId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    check(userId, String);
    var invite = Invites.findOne( {
                                    type: 'teaminvitation',
                                    from: teamId,
                                    to: userId
                                  } );
    //Server side check for loggedIn
    if (Meteor.user()) {
      Meteor.call('inviteRemove', invite, function(error, result) {
        // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // Todo: check if member exists just incase
      
      });
    }
  },

  //teamaccept
  teamAccept: function (teamId, userId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    check(userId, String);

    var team = Teams.findOne({_id: teamId});
    console.log(team);
    var invite = Invites.findOne( {
                                    type: 'teaminvitation',
                                    from: teamId,
                                    to: userId
                                  } );
    //Server side check for loggedIn
    if (Meteor.user()) {
      Meteor.call('inviteRemove', invite, function(error, result) {
        // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // Todo: check if member exists just incase
      
      });
        //Server side check for loggedIn + owner
      //if (ownsDocument(Meteor.userId(), invite)) {
        Teams.update(teamId,
          { $addToSet: { members: {memberId: userId, memberRole: 'member'} } } 
        );
     // }
    }
  },

/** Team Applications **/
      //Apply for a team

  teamApply: function (teamId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    var user = Meteor.user();
    var inviteAttributes = {
      type: 'teamapplication',
      from: user._id,
      to: teamId
    }
    //Server side check for loggedIn
    if (Meteor.user()) {
      Meteor.call('inviteInsert', inviteAttributes, function(error, result) {
        // display the error to the user and abort
      if (error)
        return alert(error.reason);

    if(Meteor.isClient) { 
      
      if (result.inviteExists) {
        alert('This invite already exists');
      }
      if (result.notLoggedIn) {
        alert('Please Log In');
      }
    }

      // Todo: check if member exists just incase
      
      });
    }
  },

    //Rescind application to a team

  teamRescind: function (teamId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    var user = Meteor.user();
    var invite = Invites.findOne( {
                                    type: 'teamapplication',
                                    from: user._id,
                                    to: teamId
                                  } );
    //Server side check for loggedIn
    if (Meteor.user()) {
      Meteor.call('inviteRemove', invite, function(error, result) {
        // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // Todo: check if member exists just incase
      
      });
    }
  },

      //Join a team

  teamApprove: function (teamId, userId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    check(userId, String);

    var team = Teams.findOne({_id: teamId});
    var invite = Invites.findOne( {
                                    type: 'teamapplication',
                                    from: userId,
                                    to: teamId
                                  } );
    //Server side check for loggedIn
    if (Meteor.user()) {
      Meteor.call('inviteRemove', invite, function(error, result) {
        // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // Todo: check if member exists just incase
      
      });
        //Server side check for loggedIn + owner
      if (ownsDocument(Meteor.userId(), team)) {
        Teams.update(teamId,
          { $addToSet: { members: {memberId: userId, memberRole: 'member'} } } 
        );
      }
    }
  },

  //same as Rescind but might be useful to seperate later
  teamReject: function (teamId, userId) {
    check(Meteor.userId(), String);
    check(teamId, String);
    check(userId, String);

    var team = Teams.findOne({_id: teamId});
    var invite = Invites.findOne( {
                                    type: 'teamapplication',
                                    from: userId,
                                    to: teamId
                                  } );
    //Server side check for loggedIn
    if (Meteor.user()) {
      Meteor.call('inviteRemove', invite, function(error, result) {
        // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // Todo: check if member exists just incase
      
      });
    }
  }
});
Invites = new Mongo.Collection('invites');

var Schemas = {};

Schemas.Invite = new SimpleSchema({
  type: {
    type: String,
    label: "Invite type",
  },
  from: {
    type: String,
    label: "from _id",
  },
  to: {
    type: String,
    label: "to _id"
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
  }
});

Invites.attachSchema(Schemas.Invite);

//Make sure to do serverside checks before calling any mongo read/write/deletes
//Less Important now as it'll automatically validate against the schema

Invites.allow({
 remove: function(userId, team) { return ownsDocument(userId, team); }
})

Meteor.methods({
	inviteInsert: function (inviteAttributes) {
    var user = Meteor.user();

    var inviteAlreadyExists = Invites.findOne(inviteAttributes);
    if (inviteAlreadyExists) {
      return {
        inviteExists: true,
      };
    }

    var invite = _.extend(inviteAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    //Server side check for loggedIn
    if (Meteor.user()) {
        var inviteId = Invites.insert(invite);
        return {
          _id: inviteId
        };
    } else {
      return {
        notLoggedIn: true,
      };
    }
  },

  inviteRemove: function (invite) {
    //Server side check for loggedIn
    if (Meteor.user()) {
        var inviteId = Invites.remove(invite);
    } else {
      return {
        notLoggedIn: true,
      };
    }
  }
})
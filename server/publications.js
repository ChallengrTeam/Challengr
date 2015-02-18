Meteor.publish('teams', function() {
  return Teams.find();
});

Meteor.publish('myteams', function() {
  return Teams.find({ userId: this.userId });
});

Meteor.publish('tournaments', function() {
  return Tournaments.find();
});

Meteor.publish('mytournaments', function() {
  return Tournaments.find({ userId: this.userId });
});

Meteor.publish('invites', function() {
  return Invites.find();
});

Meteor.publish("allUserData", function () {
    return Meteor.users.find({},
                             {fields: {'username': 1, 'profile': 1}});
});
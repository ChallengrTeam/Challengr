Template.tournamentEditTeam.helpers({
  team: function() {
    return Teams.findOne( { _id: this.teamId } );
  }
});

Template.tournamentEdit.events({
    'click .remove': function(event, template) {
        if (confirm("Are you sure you want to remove " + teamName + " from the tournament?")) {
            var tournId = Template.parentData()._id;

            var teamName = event.target.value;
            Meteor.call("tournamentLeave", tournId, Teams.findOne({teamName: teamName})._id,
                function(error, result) {
                    alert(error ? error.reason : "Team " + teamName + " removed from tournament.");
                });
        }
    }
});
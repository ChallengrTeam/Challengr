// HACK this should probably be a Meteor method, but dealing with async is a headache
function teamContainsUser(teamId, userId) {
    var team = Teams.findOne({_id: teamId});
    if (typeof team !== 'undefined') {
        var isInTeam = false;
        team.members.forEach(function(m) {
            if (m.memberId === userId) isInTeam = true;
        });
        return isInTeam;
    } else return false;
}

Template.matchPage.helpers({
    getName: function() {
        return Tournaments.findOne({_id: this.tournamentId}).tournamentName;
    },

    textCannotSubmit: function() {
        if (this.state === "Finished") {
            return "This match is already finished!";
        } else if (this.state === "Incomplete") {
            return "This match is not ready to play yet!";
        } else {
            return "You cannot submit results for this match!";
        }
    },

    getMatchResult: function() {
        return this.result0 === null || this.result1 === null ?
            "Not Played" : this.result0 + ":" + this.result1;
    },

    userCanSubmit: function() {
        // user is in one of the teams and match is ready
        if (this.state === "Ready") {
            var userId = Meteor.userId();
            var isInMatch = teamContainsUser(this.teamId0, userId) ||teamContainsUser(this.teamId1, userId);
            return isInMatch;
        } else return false;
    }
});

Template.matchPage.events({

    'submit form': function (event, template) {
        event.preventDefault();
        var result0 = $('#matchResult0').val();
        var result1 = $('#matchResult1').val();
        if (isNaN(result0) || isNaN(result1) || result0 < 0 || result1 < 0) {
            alert("Please submit positive scores for both teams.");
        } else {
            Meteor.call('matchResultSubmit', this._id, result0, result1,
                function(error, result) {
                    alert(error ? error.reason : "Result submitted!");
                    Router.go('matchPage', {_id: result._id});
                });
        }
    }

});
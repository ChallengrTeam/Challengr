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
    },

    userCanEditMatch: function() {
        var tourn = Tournaments.findOne({_id: this.tournamentId});
        return tourn.userId === Meteor.userId();
    }
});

Template.matchPageEdit.helpers({
    isState: function(state) { return state == this.state ? "true" : null; },

    tournTeams: function(teamNum) {
        var teams = Tournaments.findOne({_id: this.tournamentId}).teams;

        var selectedTeamId = "0";
        if (teamNum == "0") selectedTeamId = this.teamId0;
        if (teamNum == "1") selectedTeamId = this.teamId1;
        var isSelected = function(teamId) { return teamId === selectedTeamId; };

        return _.map(teams, function(tournTeam) {
            var team = Teams.findOne({_id: tournTeam.teamId});
            var attr = {teamId: team._id, teamName: team.teamName};
            if (isSelected(team._id)) attr.selected = true;
            return attr;
        });
    }
});

Template.matchPage.events({
    'submit #matchResultForm': function (event, template) {
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

Template.matchPageEdit.events({
    'submit #matchEditForm': function(event, template) {
        event.preventDefault();
        var t = event.target;
        var confirmMsg = "Editing match to:\n";
        confirmMsg += "State: " + t.matchStateSelect.options[t.matchStateSelect.selectedIndex].text +
            "\nTeam 1: " + t.teamSelect0.options[t.teamSelect0.selectedIndex].text +
            "\nTeam 2: " + t.teamSelect1.options[t.teamSelect1.selectedIndex].text +
            "\nResult: " + t.matchEditResult0.value + ":" + t.matchEditResult1.value +
            "\nAre you sure you want to edit the match?";
        if (confirm(confirmMsg)) {
            Matches.update(this._id, {$set: {
                teamId0: t.teamSelect0.value,
                teamId1: t.teamSelect1.value,
                result0: t.matchEditResult0.value,
                result1: t.matchEditResult1.value,
                state: t.matchStateSelect.value,
            }});
        }
    }
});
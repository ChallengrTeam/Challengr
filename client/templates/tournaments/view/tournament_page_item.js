Template.tournamentPageItem.helpers({
    ownPost: function() {
 	      return this.userId === Meteor.userId();
    },
    tournamentTeams: function() {
      	return this.teams;
    },
    isLocked: function() {
      	return this.locked;
    },
    formattedDate: function(date) {
        return date.toLocaleString();
    }
});

Template.tournamentBracket.helpers({
    bracketRounds: function() {
        return this.rounds || [];
    },
    getMatch: function (matchId) {
        return Matches.findOne({_id: matchId});
    },
    getMatchResult: function() {
        return this.result0 === null || this.result1 === null ?
            "0:0" : this.result0 + ":" + this.result1;
    }
});
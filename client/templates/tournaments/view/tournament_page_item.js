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
    }
});
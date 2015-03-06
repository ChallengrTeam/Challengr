Meteor.methods({
    matchInsert: function(tournamentId, teamId0, teamId1, result0, result1, state) {
        var matchAttributes = {
            tournamentId: tournamentId,
            teamId0: teamId0,
            teamId1: teamId1,
            result0: typeof(result0) === 'undefined' ? null : result0,
            result1: typeof(result1) === 'undefined' ? null : result1
        };

        if (typeof(state) === 'undefined') {
            if (teamId0 !== null && teamId1 !== null) {
                matchAttributes.state = "Ready";
            } else {
                matchAttributes.state = "Incomplete";
            }
        } else matchAttributes.state = state;

        return Matches.insert(matchAttributes);
    }
});
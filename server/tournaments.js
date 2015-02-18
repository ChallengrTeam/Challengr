Meteor.methods({
    tournamentCreateBracket: function(tournamentId, format) {
        if (format === "None") {
            Tournaments.update(tournamentId, {
                $set: {format: format}
            });
        } else if (format === "Single Elimination") {
            var tournament = Tournaments.findOne({_id: tournamentId});
            var tournamentTeams = tournament.teams;
            var numTeams = tournamentTeams.length;

            // min size
            if (numTeams < 2) throw new Meteor.Error(400, "Not enough teams!");
            // power of 2   TODO: insert BYEs to fill
            var logLen = Math.log(numTeams) / Math.LN2;
            if (parseInt(logLen) !== logLen)
                throw new Meteor.Error(400, "Need number of teams to be a power of 2!");

            // TODO for seeding, just sort tournamentTeams - already takes first and last for matches

            var roundMatches = numTeams / 2;
            var rounds = [];
            while (roundMatches >= 1) {
                var matches = [];
                for (var i = 0; i < roundMatches; i++) {
                    if (tournamentTeams.length > 1) {
                        var team0 = Teams.findOne({_id: (tournamentTeams.shift()).teamId});
                        var team1 = Teams.findOne({_id: (tournamentTeams.pop()).teamId});
                        matches.push({
                            team0: team0._id,
                            team1: team1._id,
                            result: null
                        });
                    } else {
                        matches.push({
                            team0: null,
                            team1: null,
                            result: null
                        });
                    }
                }
                rounds.push({matches: matches});
                roundMatches = roundMatches / 2;
            }

            Tournaments.update(tournamentId, {
                $set: {format: format,
                       rounds: rounds}
            });
        }
        return {_id: tournamentId};
    },

    tournamentClearBracket: function(tournamentId) {
        var tournament = Tournaments.findOne({_id: tournamentId});
        Tournaments.update(tournamentId, {$unset: {rounds: null}});
        return {_id: tournamentId};
    }
});
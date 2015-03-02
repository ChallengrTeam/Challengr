Matches = new Mongo.Collection("matches");
var Schemas = {};

Schemas.Match = new SimpleSchema({
    tournamentId: {
        type: String
    },
    teamId0: {
        type: String,
        optional: true
    },
    teamId1: {
        type: String,
        optional: true
    },
    result0: {
        type: Number,
        optional: true
    },
    result1: {
        type: Number,
        optional: true
    },
    state: {
        type: String,
        allowedValues: ["Incomplete", "Ready", "Finished"]
    }
});

Matches.attachSchema(Schemas.Match);

Matches.allow({
 remove: function(userId, match) { return ownsDocument(userId, match); }
});

Meteor.methods({

    matchResultSubmit: function(matchId, result0, result1) {
        if (!(typeof result0 === 'undefined' || typeof result1 === 'undefined')) {
            Matches.update(matchId, {$set: {
                result0: result0,
                result1: result1,
                state: "Finished"
            }});

            // find this match's number and round number
            var match = Matches.findOne({_id: matchId});
            var tourn = Tournaments.findOne({_id: match.tournamentId});
            var roundNum = 0;
            var matchNum = 0;

            for (var i = 0; i < tourn.rounds.length; i++) {
                for (var j = 0; j < tourn.rounds[i].length; j++) {
                    if (tourn.rounds[i].matchIds[j] === matchId) {
                        roundNum = i;
                        matchNum = j;
                    }
                }
            }

            if (roundNum + 1 < tourn.rounds.length) {
                // insert winning team into next match
                var nextMatchNum = parseInt(matchNum / 2);
                var matchAttr = {};
                var winningTeam = result0 > result1 ? match.teamId0 : match.teamId1;
                var nextMatch = Matches.findOne({_id: tourn.rounds[roundNum+1].matchIds[nextMatchNum]});

                if ((matchNum / 2) - nextMatchNum > 0) {
                    matchAttr.teamId0 = nextMatch.teamId0;
                    matchAttr.teamId1 = winningTeam;
                } else {
                    matchAttr.teamId0 = winningTeam;
                    matchAttr.teamId1 = nextMatch.teamId1;
                }

                // set next match to Ready if appropriate
                if (matchAttr.teamId0 && matchAttr.teamId1) {
                    matchAttr.state = "Ready";
                }
                Matches.update(nextMatch._id, {$set : matchAttr});
            }
        }
        return {_id: matchId};
    }

});
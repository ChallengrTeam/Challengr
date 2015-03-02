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
        }
        return {_id: matchId};
    }

});
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
    result: {
        type: String,
        regEx: /^[0-9]+:[0-9]+$/,
        optional: true
    },
    // state: {
    //     type: String,
    //     allowedValues: ["Incomplete", "Ready", "Finished"]
    // }
});

Matches.attachSchema(Schemas.Match);

Matches.allow({
 remove: function(userId, match) { return ownsDocument(userId, match); }
});
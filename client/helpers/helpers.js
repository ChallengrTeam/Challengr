UI.registerHelper('getArrayIndexes', function(array) {
    array = array || [];
    return _.map(array, function(value, index) {
        return {value: value, index: index};
    });
});

UI.registerHelper('getTournament', function (tournamentId) {
    return Tournaments.findOne({_id: tournamentId});
});

UI.registerHelper('getTeamName', function (teamId, defaultString) {
    var team = Teams.findOne({_id: teamId});
    return team ? team.teamName : defaultString;
});

UI.registerHelper('getTeamNameTagFormatted', function (teamId, defaultString) {
    var team = Teams.findOne({_id: teamId});
    return team ? "[" + team.teamTag + "] " + team.teamName : defaultString;
});
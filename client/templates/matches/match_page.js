Template.matchPage.helpers({
    getName: function() {
        return Tournaments.findOne({_id: this.tournamentId}).tournamentName;
    }
});
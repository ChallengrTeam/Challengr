Template.matchPage.helpers({
    getGame: function() {
        return Tournaments.findOne({_id: this.tournamentId}).game;
    }
});
Template.tournamentCreate.rendered = function() {
    $('.datetimepicker').datetimepicker();
};

Template.tournamentCreate.events({
  'submit form': function(e) {
    e.preventDefault();
    var post = {
        tournamentName: $(e.target).find('[name=tournamentName]').val(),
        game: $(e.target).find('[name=game]').val(),
        mode: $(e.target).find('[name=mode]').val()
    };

    var startDate = $('.datetimepicker').data('DateTimePicker').date().toString();
    if (startDate) post.startDate = startDate;

    Meteor.call('tournamentInsert', post, function(error, result) {
        // display the error to the user and abort
        if (error)
          return alert(error.reason);

        // show this result but route anyway
        if (result.tournamentExists)
          alert('This tournament already exists');

        if (result.notLoggedIn)
          alert('Please Log In');

        Router.go('tournamentPage', {_id: result._id});
    });
  }
});
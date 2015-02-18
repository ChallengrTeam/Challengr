UI.registerHelper('getArrayIndexes', function(array) {
    array = array || [];
    return _.map(array, function(value, index) {
        return {value: value, index: index};
    });
});
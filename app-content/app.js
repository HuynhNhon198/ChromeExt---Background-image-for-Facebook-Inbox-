'use strict';
var app = angular.module("myapp", []);

app.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});
app.filter('num', function() {
    return function(input) {
       return parseInt(input, 10);
    }
});


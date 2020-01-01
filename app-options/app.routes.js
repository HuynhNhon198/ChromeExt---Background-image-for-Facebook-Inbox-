app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
		templateUrl : "app-options/components/home/Template.html",
        controller : "home-controller",
    })

});
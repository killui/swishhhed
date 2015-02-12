angular.module('starter.controllers', [])

.controller('profilInformationController', function ($scope,$http) {
    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var urlUser = "https://api.dribbble.com/v1/users/lemoine_quentin";
    var config = {
        headers: {
            'Content-Type': 'application/json, text/html, application/javascript',
            'Authorization': 'Bearer '+OAUTH_TOKEN,
            'Origin': '*'
        },
        withCredentials: true
    };

    $http.get(urlUser,config).
    success(function(data) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.test = "success";
        console.log(data);
    }).
    error(function(err) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.test = "failed";
        console.log(err);
    });

    
    document.getElementByIt('data').text('data');
});
angular.module('starter.controllers', [])

.controller('shotsController', function ($scope,$http) {
    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var url = "https://api.dribbble.com/v1/shots?sort=views";
    var config = {
        headers: {
            'Content-Type': 'application/json, text/html, application/javascript',
            'Authorization': 'Bearer '+OAUTH_TOKEN,
            'Origin': '*'
        },
        withCredentials: true
    };

    $http.get(url,config).
    success(function(data) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.data = data;
    }).
    error(function(err) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(err);
    });

})

.controller('shotController', function ($scope,$http,$stateParams) {
    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var shotId = $stateParams.shotId;
    console.log(shotId);
    var url = "https://api.dribbble.com/v1/shots/"+shotId;
    var config = {
        headers: {
            'Content-Type': 'application/json, text/html, application/javascript',
            'Authorization': 'Bearer '+OAUTH_TOKEN,
            'Origin': '*'
        },
        withCredentials: true
    };

    $http.get(url,config)
    .success(function(data) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.title = data.title;

        if (data.images.hidpi == null) {
            $scope.shotImages = data.images.normal;
        } else {
            $scope.shotImages = data.images.hidpi;
        }

        $scope.views = data.views_count;
        $scope.likes = data.likes_count;
        $scope.comments = data.comments_count;

        var urlComments = data.comments_url;

        $http.get(urlComments,config)
        .success(function(comments) {
            $scope.comment = comments;
        })
        .error(function(err) {
            console.log(err);
        });
        
    })
    .error(function(err) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(err);
    });

})

.controller('profilController', function ($scope,$http) {
    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var url = "https://api.dribbble.com/v1/user?access_token="+OAUTH_TOKEN;
    var config = {
        headers: {
            'Content-Type': 'application/json, text/html, application/javascript',
            'Authorization': 'Bearer '+OAUTH_TOKEN,
            'Origin': '*'
        },
        withCredentials: true
    };

    $http.get(url,config).
    success(function(data) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.id = data.id;
        $scope.name = data.name;
        $scope.avatar = data.avatar_url;
        $scope.followers = data.followers_count;
        $scope.followings = data.followings_count;
        $scope.likes = data.likes_count;

        console.log(data);
    }).
    error(function(err) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.test = "failed";
        console.log(err);
    });

})
;
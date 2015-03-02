angular.module('starter.controllers', [])

.controller('shotsController', function ($scope,$http,$ionicLoading) {
    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    var SHOTS = 24;
    
    function getShots() {
        $ionicLoading.show({
            template: 'Loading...'
        });

        var url = "https://api.dribbble.com/v1/shots?per_page="+SHOTS;
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
                $ionicLoading.hide();
                $scope.data = data;
                
                //$scope.$apply();
            })
            .error(function(err) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(err);
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });

    }

    $scope.doRefresh = function() {
        getShots();
    }

    $scope.loadMore = function() {
        SHOTS = SHOTS + 24;
        getShots();
    }

    getShots();
})
.controller('shotController', function ($scope,$http,$stateParams,$ionicNavBarDelegate) {
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
    function getInfoShot()
    {
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
            $scope.userShot = data.user.avatar_url;
            $scope.userName = data.user.username;
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
        })
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete')
        });
    }
    getInfoShot();

    $scope.doRefresh = function() {
        getInfoShot();
    }
    $scope.back = function() {
        window.history.back();
    }
})
.controller('loginController', function ($scope,$http,$localstorage,$ionicLoading,$location,$ionicNavBarDelegate) {
    $scope.user = {
        'username' : ''
    };
    $scope.finalSubmit = function() {
        $ionicLoading.hide();
        $localstorage.set('name', $scope.user.username);
        $location.path('/profil');
    }
    $scope.back = function() {
        window.history.back();
    }
})
.directive('formManager', function($ionicLoading) {
    return {
        //restrict : 'A',
        controller : function($scope) {
          
            $scope.$watch('loginForm.$valid', function() {
                console.log("Form validity changed. Now : " + $scope.loginForm.$valid);
            });

          
          
            $scope.submit = function() {
                
                if($scope.loginForm.$valid) {
                    $ionicLoading.show({ template: 'Submitting...', duration:1000});
                    $scope.finalSubmit();
                } else {
                    $ionicLoading.show({ template: 'Form Is Not Valid', duration: 1500})
                }
            }
        }
    }
})
.controller('profilController', function ($scope,$http,$localstorage,$location,$ionicNavBarDelegate) {

    if ($localstorage.get('name') == null) {
        $location.path('/login');
    } else {

        $scope.back = function() {
            window.history.back();
        }

        var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
        var USERNAME = $localstorage.get('name');
        var url = "https://api.dribbble.com/v1/users/"+USERNAME;
        var config = {
            headers: {
                'Content-Type': 'application/json, text/html, application/javascript',
                'Authorization': 'Bearer '+OAUTH_TOKEN,
                'Origin': '*'
            },
            withCredentials: true
        };
        getInfoUser();
    }

    function getInfoUser()
    {
        $http.get(url,config)
        .success(function(data) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.id = data.id;
            $scope.name = data.name;
            $scope.avatar = data.avatar_url;
            $scope.followers = data.followers_count;
            $scope.followings = data.followings_count;
            $scope.likes = data.likes_count;

            console.log(data);
        })
        .error(function(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.test = "failed";
            console.log(err);
        });
    }
})
;
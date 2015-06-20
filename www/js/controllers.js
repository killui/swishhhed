angular.module('starter.controllers', [])
//////////////////////////
/////////// Constant
.constant('DribbbleApiUrl', 'https://api.dribbble.com')
//////////////////////
///////// Controller
.controller('shotsController', function ($scope, $http, $ionicLoading, DribbbleApiUrl, $ionicPopover, $location) {

    console.log($location);

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    var SHOTS = 24;
    var SORT = 'popular';
    var TIMEFRAME = 'now';
    var LIST = '';


    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.demo = 'ios';
    $scope.setPlatform = function(p) {
        document.body.classList.remove('platform-ios');
        document.body.classList.remove('platform-android');
        document.body.classList.add('platform-' + p);
        $scope.demo = p;
    }

    // Filters for displaying shots
    $scope.sorts =  [
        {value:'popular', name:'Popular'},
        {value:'recent', name:'Recent'},
        {value:'comments', name:'Most commented '},
        {value:'views', name:'Most viewed '}
    ];

    $scope.lists =  [
        {value:'', name:'Shots'},
        {value:'animated', name:'Animated GIFs'},
        {value:'attachments', name:'Shots with attachments'},
        {value:'debuts', name:'Most commented '},
        {value:'playoffs', name:'Playoffs'},
        {value:'rebounds', name:'Rebounds'},
        {value:'teams', name:'Team Shots'}
    ];

    $scope.times =  [
        {value:'now',name:'Now'},
        {value:'week',name:'This past week '},
        {value:'month',name:'This past month '},
        {value:'year',name:'This past year '},
        {value:'ever',name:'All time '}
    ]; 

    $scope.sort =  $scope.sorts[0];
    $scope.time = $scope.times[0];
    $scope.list = $scope.lists[0];

    function getShots() {

        $ionicLoading.show({
            template: 'Loading...'
        });

        var url = DribbbleApiUrl+"/v1/shots?per_page="+SHOTS+"&sort="+SORT+"&timeframe="+TIMEFRAME+"&list="+LIST;
        var config = {
            headers: {
                'Content-Type': 'application/json, text/html, application/javascript',
                'Authorization': 'Bearer '+OAUTH_TOKEN,
                'Origin': 'null'
            },
            withCredentials: true
        };

        $http.get(url,config)
        .success(function(data) {            
            $scope.data = data;
        })
        .error(function(err) {
            console.log(err);
        })
        .finally(function() {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');

            $scope.loadMore = function() {
                SHOTS = SHOTS + 24;
                getShots();
            }

            $scope.doRefresh = function() {
                getShots();
            }
            
            $scope.updateSort = function() {
                SORT = this.sort.value;
                getShots();
            } 

            $scope.updateTime = function() {
                TIMEFRAME = this.time.value;
                getShots();
            } 
            $scope.updateList = function() {
                LIST = this.list.value;
                getShots();
            } 

        });
    }

    getShots(); 
})
.controller('shotController', function ($scope, $http, $stateParams, $ionicNavBarDelegate, DribbbleApiUrl, $sce) {
    var OAUTH_TOKEN = clientAccessToken;
    var shotId = $stateParams.shotId;

    var url = DribbbleApiUrl+"/v1/shots/"+shotId;
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
            $scope.description = data.description;

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
          $scope.doRefresh = function() {
                getInfoShot();
            }
            $scope.back = function() {
                window.history.back();
            }
        });
    }
    getInfoShot();    
})
.controller('loginController', function ($scope, $http, $cordovaInAppBrowser, $location, $localstorage) {

    var http = "https://dribbble.com/oauth/token";
    var config = {
        headers: {
            'Content-Type': 'application/json, text/html, application/javascript',
        },
        data : {
            'client_id':$localstorage.get('clientId'),
            'client_secret':$localstorage.get('clientSecret'),
            'code' : $localstorage.get('requestToken'),
            'redirect_uri': 'http://localhost:8100/callback'
        },
    };

    $scope.login = function() {
        var ref = window.open('https://dribbble.com/oauth/authorize?client_id='+$localstorage.get('clientId')+'&scope=public+write+comment+upload&redirect_uri=http://localhost:8100/callback', '_self','location=yes');
        ref.addEventListener('loadstart', function(event) { 
            if((event.url).startsWith("http://localhost:8100/callback")) {
                $localStorage.set("requestToken",(event.url).split("code=")[1]);

                $http.post(http, config)
                .success(function(data) {
                    accessToken = data.access_token;
                    $localStorage.set("accessToken", data.access_token);
                    $location.path("/profil");
                })
                .error(function(data, status) {
                    alert(data);
                });
                ref.close();
            }
        });
    }
 
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }
})
.controller('SecureController', function($scope, $http) {
 
    $scope.accessToken = accessToken;
    
})
.controller('profilController', function ($scope, $http, $localstorage, $location, $ionicNavBarDelegate) {

    if ($localstorage.get('accessToken') == null) {
        $location.path('/login');
    } else {
        console.log($localstorage.get('accessToken'));
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
///////////////////////
///////// Directive
// .directive('headerShrink', function($document) {
//   var fadeAmt;

//   var shrink = function(header, content, amt, max) {
//     amt = Math.min(44, amt);
//     fadeAmt = 1 - amt / 44;
//     ionic.requestAnimationFrame(function() {
//       header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
//       for(var i = 0, j = header.children.length; i < j; i++) {
//         header.children[i].style.opacity = fadeAmt;
//       }
//     });
//   };

//   return {
//     restrict: 'A',
//     link: function($scope, $element, $attr) {
//       var starty = $scope.$eval($attr.headerShrink) || 0;
//       var shrinkAmt;
      
//       var header = $document[0].body.querySelector('.bar-header');
//       var headerHeight = header.offsetHeight;
      
//       $element.bind('scroll', function(e) {
//         var scrollTop = null;
//         if(e.detail){
//           scrollTop = e.detail.scrollTop;
//         }else if(e.target){
//           scrollTop = e.target.scrollTop;
//         }
//         if(scrollTop > starty){
//           // Start shrinking
//           shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
//           shrink(header, $element[0], shrinkAmt, headerHeight);
//         } else {
//           shrink(header, $element[0], 0, headerHeight);
//         }
//       });
//     }
//   }
// })
;
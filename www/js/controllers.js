angular.module('starter.controllers', [])
//////////////////////////
/////////// Constant
.constant('DribbbleApiUrl', 'https://api.dribbble.com')
//////////////////////
///////// Controller
.controller('introController', function($scope, $state, $ionicSlideBoxDelegate) {
    // Called to navigate to the main app
    $scope.startApp = function() {
        $state.go('main');
    };
    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
})

.controller('homeController', function($scope, $http, $ionicLoading, DribbbleApiUrl, $ionicPopover, $location) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    var i = 0;
    $scope.data = [];

    function getFollowings() 
    {
        var url = DribbbleApiUrl+'/v1/user/following/shots?page='+PAGE;
        var config = {
            headers: {
                'Content-Type': 'application/json, text/html, application/javascript',
                'Authorization': 'Bearer '+OAUTH_TOKEN,
                'Origin': 'null'
            },
            withCredentials: true
        };
        
        $http.get(url,config)
        .success(function(item) {
            
            item.forEach(function(i) {
                $scope.data.push(i)
            });
            
        })
        .error(function(err) {
            console.log(err);
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');

            $scope.loadMore = function() {
                //SHOTS = SHOTS + 24;
                PAGE = PAGE + 1;
                getFollowings();
            }
            $scope.doRefresh = function() {
                getShots();
            }
             
        });
    }

    getFollowings(); 
})
.controller('shotHomeController', function($scope, $http, $stateParams, $ionicNavBarDelegate, DribbbleApiUrl, $sce, $location, $ionicSideMenuDelegate, $ionicHistory) {
    

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
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

    var view = document.querySelector('ion-side-menu-content');

    $scope.toggleMenu = function() {
        console.log($ionicSideMenuDelegate.isOpen());

        if ($ionicSideMenuDelegate.isOpen()) {
            angular.element(view).removeClass('menu-isOpen');
        } else {
            if (angular.element(view).hasClass('menu-isOpen')) {
                angular.element(view).removeClass('menu-isOpen');
            } else {
                angular.element(view).addClass('menu-isOpen');
            }
        }
        $ionicSideMenuDelegate.toggleRight();
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

            getShotComments(urlComments, config);
            
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
    function getShotComments(urlComments, config)
    {
        $http.get(urlComments,config)
            .success(function(comments) {
                $scope.comment = comments;
            })
            .error(function(err) {
                console.log(err);
            });
    }
    getInfoShot();    
})

.controller('shotsController', function($scope, $http, $ionicLoading, DribbbleApiUrl, $ionicPopover, $location) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    var SHOTS = 24;
    var SORT = 'popular';
    var TIMEFRAME = 'now';
    var LIST = '';

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

    var i = 0;
    $scope.data = [];

    var shotHTML =  '<a ng-href="#/tab/shot/{{ shot.id }}" ng-repeat="shot in data" class="shots" >'+
                    '<img src="{{ shot.images.teaser }}" alt="{{ shot.title }}">'+
                    '<div class="shots_info">'+
                    '<span class="shots_view"><i class="ion-eye"></i>{{ shot.views_count }}</span>'+
                    '<span class="shots_comments"><i class="ion-chatbubble"></i>{{ shot.comments_count }}</span>'+
                    '<span class="shots_likes"><i class="ion-heart"></i>{{ shot.likes_count }}</span>'+
                    '</div></a>';

    function getShots() 
    {
        
        var url = DribbbleApiUrl+"/v1/shots?page="+PAGE+"&sort="+SORT+"&timeframe="+TIMEFRAME+"&list="+LIST;
        var config = {
            headers: {
                'Content-Type': 'application/json, text/html, application/javascript',
                'Authorization': 'Bearer '+OAUTH_TOKEN,
                'Origin': 'null'
            },
            withCredentials: true
        };
        
        $http.get(url,config)
        .success(function(item) {
            
            item.forEach(function(i) {
                $scope.data.push(i)
            });
            
        })
        .error(function(err) {
            console.log(err);
        })
        .finally(function() {
            
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');

            $scope.loadMore = function() {
                //SHOTS = SHOTS + 24;
                PAGE = PAGE + 1;
                getShots();
            }
            $scope.doReset = function() {
                PAGE = 1;
                SHOTS = 24;
                SORT = 'popular';
                TIMEFRAME = 'now';
                LIST = '';
                resetShots();
            }
            $scope.updateSort = function() {
                SORT = this.sort.value;
                filterShots();
            } 
            $scope.updateTime = function() {
                TIMEFRAME = this.time.value;
                filterShots();
            } 
            $scope.updateList = function() {
                LIST = this.list.value;
                filterShots();
            } 
        });
    }

    function filterShots() 
    {
        
        var url = DribbbleApiUrl+"/v1/shots?page="+PAGE+"&sort="+SORT+"&timeframe="+TIMEFRAME+"&list="+LIST;
        var config = {
            headers: {
                'Content-Type': 'application/json, text/html, application/javascript',
                'Authorization': 'Bearer '+OAUTH_TOKEN,
                'Origin': 'null'
            },
            withCredentials: true
        };
        
        $http.get(url,config)
        .success(function(item) {
            $scope.data = item;
                       
        })
        .error(function(err) {
            console.log(err);
        });
    }

    function resetShots() 
    {
        
        var url = DribbbleApiUrl+"/v1/shots?page="+PAGE+"&sort="+SORT+"&timeframe="+TIMEFRAME+"&list="+LIST;
        var config = {
            headers: {
                'Content-Type': 'application/json, text/html, application/javascript',
                'Authorization': 'Bearer '+OAUTH_TOKEN,
                'Origin': 'null'
            },
            withCredentials: true
        };
        
        $http.get(url,config)
        .success(function(item) {
            $scope.data = item;
        })
        .error(function(err) {
            console.log(err);
        });
    }

    getShots(); 
})
.controller('shotShotsController', function($scope, $http, $stateParams, $ionicNavBarDelegate, DribbbleApiUrl, $sce, $location, $ionicSideMenuDelegate, $ionicHistory) {
    

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
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

    var view = document.querySelector('ion-side-menu-content');

    $scope.toggleMenu = function() {
        console.log($ionicSideMenuDelegate.isOpen());

        if ($ionicSideMenuDelegate.isOpen()) {
            angular.element(view).removeClass('menu-isOpen');
        } else {
            if (angular.element(view).hasClass('menu-isOpen')) {
                angular.element(view).removeClass('menu-isOpen');
            } else {
                angular.element(view).addClass('menu-isOpen');
            }
        }
        $ionicSideMenuDelegate.toggleRight();
    };

    function getInfoShot()
    {
        $http.get(url,config)
        .success(function(data) {
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

            getShotComments(urlComments, config);
            
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
        });
    }
    function getShotComments(urlComments, config)
    {
        $http.get(urlComments,config)
        .success(function(comments) {
            $scope.comment = comments;
            console.log($scope.comment);
        })
        .error(function(err) {
            console.log(err);
        });
    }
    getInfoShot();    
})

.controller('loginController', function($scope, $http, $cordovaInAppBrowser, $location, $localstorage) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    var http = "https://dribbble.com/oauth/token";
    var config = {
        data : {
            'client_id':$localstorage.get('clientId'),
            'client_secret':$localstorage.get('clientSecret'),
            'code' : $localstorage.get('requestToken')
        },
    };

    $scope.login = function() {
        var ref = window.open('https://dribbble.com/oauth/authorize?client_id='+$localstorage.get('clientId')+'&scope=public+write+comment+upload', '_system');
        ref.addEventListener('loadstart', function(event) { 
            if((event.url).startsWith("Swishhhed://login")) {
                $localStorage.set("requestToken",(event.url).split("code=")[1]);

                $http.post(http, config)
                .success(function(data) {
                    $localStorage.set("accessToken", data.access_token);
                    $location.path("/profil");
                })
                .error(function(data, status) {
                    alert(data);
                });
                //ref.close();
            }
        });
    }
 
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }
})
.controller('uploadController', function($scope) {  
})
.controller('profilController', function($scope, $http, $localstorage, $location, $ionicNavBarDelegate) {

    if ($localstorage.get('accessToken') == null) {
        $location.path('/login');
    } else {
        console.log($localstorage.get('accessToken'));
        $scope.back = function() {
            window.history.back();
        }

        var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
        var USERNAME = $localstorage.get('name');
        var url = "https://api.dribbble.com/v1/user";
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
            console.log(data)
            $scope.user = data;
        })
        .error(function(err) {
            $scope.test = "failed";
            console.log(err);
        });
    }
})
;
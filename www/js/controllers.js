angular.module('starter.controllers', [])
//////////////////////////
/////////// Constant
.constant('DribbbleApiUrl', 'https://api.dribbble.com')
//////////////////////
///////// Controller
// INTRO
.controller(
    'introController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {
    // Called to navigate to the main app
    // $scope.startApp = function() {
    //     $state.go('main');
    // };
    // $scope.next = function() {
    //     $ionicSlideBoxDelegate.next();
    // };
    // $scope.previous = function() {
    //     $ionicSlideBoxDelegate.previous();
    // };
    // // Called each time the slide changes
    // $scope.slideChanged = function(index) {
    //     $scope.slideIndex = index;
    // };
    // Handles incoming device tokens
    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        alert("Successfully registered token " + data.token);
        console.log('Ionic Push: Got token ', data.token, data.platform);
        $scope.token = data.token;
    });
    // Identifies a user with the Ionic User service
    $scope.identifyUser = function() {
        console.log('Ionic User: Identifying with Ionic User service');

        var user = $ionicUser.get();
        if(!user.user_id) {
            // Set your user_id here, or generate a random one.
            user.user_id = $ionicUser.generateGUID();
        };

        // Add some metadata to your user object.
        angular.extend(user, {
            name: 'Ionitron',
            bio: 'I come from planet Ion'
        });

        // Identify your user with the Ionic User Service
        $ionicUser.identify(user).then(function(){
            $scope.identified = true;
            alert('Identified user ' + user.name + '\n ID ' + user.user_id);
        });
    };
    // Registers a device for push notifications and stores its token
    $scope.pushRegister = function() {
        console.log('Ionic Push: Registering user');

        // Register with the Ionic Push service.  All parameters are optional.
        $ionicPush.register({
            canShowAlert: true, //Can pushes show an alert on your screen?
            canSetBadge: true, //Can pushes update app icon badges?
            canPlaySound: true, //Can notifications play a sound?
            canRunActionsOnWake: true, //Can run actions outside the app,
            onNotification: function(notification) {
                // Handle new push notifications here
                //alert(notification);
                return true;
            }
        });
    };
})
// HOME
.controller(
    'homeController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $cordovaOauth,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    var i = 0;
    $scope.data = [];
    
    if ($localstorage.get('accessToken') == null) {
        $scope.login = false;
    } else {
        $scope.login = true;
        console.log($localstorage.get('accessToken'));
        function getFollowings() {
            $ionicLoading.show({
                templateUrl:'templates/loader.html'
            });
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
                $ionicLoading.hide();
                $scope.loadMore = function() {
                    //SHOTS = SHOTS + 24;
                    PAGE = PAGE + 1;
                    getFollowings();
                }
                $scope.doReset = function() {
                    resetShots();
                }
            });
        }
        function resetShots() {
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
                $scope.data = item;
                $scope.$broadcast('scroll.refreshComplete');
            })
            .error(function(err) {
                console.log(err);
            });
        }
        getFollowings(); 
    }

    // https://blog.nraboy.com/2014/07/using-oauth-2-0-service-ionicframework
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    $scope.doLogin = function() {
        var clientId = "76a0e0c037b02db657be0b487297c105c4a43d54b8f2bb024d966b08f1e8a2aa";
        var clientSecret = "6d7bcf11e0f46efda352419616c20e78d863deea9eb43e0bc230616bcc7e7e35";
        var appScopes = 'public+write+comment+upload';
        var redirectUrl = "swishhhed://home";

        //var ref = window.open('https://dribbble.com/oauth/authorize?client_id='+clientId+'&scope='+appScopes, '_blank', 'location=yes');
        var ref = window.open('https://dribbble.com/oauth/authorize?client_id='+clientId, '_blank', 'location=yes');

        ref.addEventListener('loadstart', function(event) {
            if((event.url).startsWith("http://localhost/callback")) {
                var code = (event.url).split("code=")[1];
                alert(code);
                $localStorage.set("accessToken", code);
                $http({
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: 'https://dribbble.com/oauth/token',
                    params: {
                        client_id: "76a0e0c037b02db657be0b487297c105c4a43d54b8f2bb024d966b08f1e8a2aa",
                        client_secret: "6d7bcf11e0f46efda352419616c20e78d863deea9eb43e0bc230616bcc7e7e35",
                        code: code
                    }
                })
                .success(function(data) {
                    //$localStorage.set("accessToken", data.access_token);
                    $location.path("/profil");
                }).error(function(data, status, err) {
                  console.log(data+' - '+status+' - '+err);
                  alert(err);
                });
                alert('test2');
                ref.close();
            }
        });

        if (typeof String.prototype.startsWith != 'function') {
          String.prototype.startsWith = function(str) {
            return this.indexOf(str) == 0;
          };
        }
    }
})
// SHOTS
.controller(
    'shotsController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    var SORT = 'popular';
    var SHOTS = 24;
    var TIMEFRAME = 'now';
    var LIST = '';
    var i = 0;
    $scope.data = [];

    $scope.changeShots = function(string) {
        angular.element(document.querySelector('#popular')).removeClass('selected');
        angular.element(document.querySelector('#recent')).removeClass('selected');
        $ionicLoading.show({ templateUrl:'templates/loader.html' });
        angular.element(document.querySelector('#'+string)).addClass('selected');
        SORT = string;
        $ionicScrollDelegate.scrollTop(true);
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
        })
        .finally(function() {
            $ionicLoading.hide();
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

    function getShots() {
        $ionicLoading.show({ templateUrl:'templates/loader.html' });
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
            $ionicLoading.hide();
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
                getShots();
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
    getShots();
})
// SHOT
.controller(
    'shotController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {
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
    $scope.loaded = false;
    $scope.attachments = [];
    $scope.allattachment = [];
    $scope.zoomMin = 1;
    
    function getInfoShot() {
        $ionicLoading.show({
            templateUrl:'templates/loader.html'
        });
        $http.get(url,config)
        .success(function(data) {
            console.log(data);
            $scope.shot = data;
            var urlAttachments = data.attachments_url;
            var urlRebounds = data.rebounds_url;
            var urlComments = data.comments_url;
            if (data.images.hidpi == null) {
                $scope.shotImages = data.images.normal;
            } else {
                $scope.shotImages = data.images.hidpi;
            }
            if (data.attachments_count > 0) {
                getShotAttachments(urlAttachments, config);
            };
            if (data.comments_count > 0) {
                getShotComments(urlComments, config);  
            };
            $scope.loaded = true; 
        })
        .error(function(err) {
            console.log(err);
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
            $ionicLoading.hide();
            $scope.doRefresh = function() {
                getInfoShot();
            }
        });
    }
    function getShotComments(urlComments, config) {
        $http.get(urlComments,config)
        .success(function(comments) {
            $scope.comment = comments;
            $scope.loaded = true;
        })
        .error(function(err) {
            console.log(err);
        });
    }
    function getShotAttachments(urlAttachments, config) {
        $http.get(urlAttachments,config)
        .success(function(attachments) {
            attachments.forEach(function(i) {
                $scope.attachments.push(i);
                $scope.allattachment.push(i.url);
            });
        })
        .error(function(err) {
            console.log(err);
        });
    }  
    $scope.goBack = function() { $ionicHistory.goBack(); }
    $scope.like = function() {
        var url_like = DribbbleApiUrl+"/v1/shots/"+shotId+"/like";
        $http.post(url_like,config)
        .success(function(data) {
            console.log('success');
        })
        .error(function(err) {
            console.log(err);
        });
    }
    $scope.unlike = function() {
        var url_like = DribbbleApiUrl+"/v1/shots/"+shotId+"/like";
        $http.delete(url_like,config)
        .success(function(data) {
            console.log('success');
        })
        .error(function(err) {
            console.log(err);
        });
    }
  
    getInfoShot();
})
.controller(
    'attachmentsController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {
    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var shotId = $stateParams.shotId;
    var attachmentId = $stateParams.attachmentId;
    var url = DribbbleApiUrl+"/v1/shots/"+shotId+"/attachments/"+attachmentId;
    var config = {
        headers: {
            'Content-Type': 'application/json, text/html, application/javascript',
            'Authorization': 'Bearer '+OAUTH_TOKEN,
            'Origin': '*'
        },
        withCredentials: true
    };
    $scope.attachments = [];
    $scope.allattachment = [];

    $scope.shot = shotId;
    
    function getAttachment() {
        $ionicLoading.show({
            templateUrl:'templates/loader.html'
        });
        $http.get(url,config)
        .success(function(data) {
            $scope.attachment = data;
        })
        .error(function(err) {
            console.log(err);
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete')
            $ionicLoading.hide();
        });
    }

    getAttachment();
})
// LOGIN
.controller(
    'loginController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush,
        $cordovaOauth
    ) {

    //var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var clientId = "76a0e0c037b02db657be0b487297c105c4a43d54b8f2bb024d966b08f1e8a2aa";
    var clientSecret = "6d7bcf11e0f46efda352419616c20e78d863deea9eb43e0bc230616bcc7e7e35";
    var appScopes = 'public,write,comment,upload';
    
    $cordovaOauth.dribble(clientId, clientSecret, appScopes).then(function(result) {
        alert(result);
    }, function(error) {
        console.log("Error -> " + error);
    });
})
.controller(
    'oauthController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {
    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var clientId = "76a0e0c037b02db657be0b487297c105c4a43d54b8f2bb024d966b08f1e8a2aa";
    var clientSecret = "6d7bcf11e0f46efda352419616c20e78d863deea9eb43e0bc230616bcc7e7e35";
    
    alert(code);
    var urlAccess = 'https://dribbble.com/oauth/token?client_id='+clientId+'&client_secret='+clientSecret+'&code='+code;
    var config = {
        headers: {
            'Content-Type': 'application/json, text/html, application/javascript',
            'Authorization': 'Bearer '+OAUTH_TOKEN,
            'Origin': '*'
        },
        withCredentials: true
    };
    function login(data) {
        $http.post(urlAccess, config)
        .success(function(res) {
            console.log(res);
            $localstorage.set('accessToken',res.access_token);
            $location.path('/tab/profil');
        })
        .error(function(err) {
            alert(err);
        });
    }
    login();
})
// UPLOAD
.controller(
    'uploadController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {  
    // Controller to upload shot
    // For futur release
    // 
})
// PROFIL
.controller(
    'profilController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    if ($localstorage.get('accessToken') == null) {
        $scope.login = false;
    } else {
        $scope.login = true;
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
            $scope.user = data;
        })
        .error(function(err) {
            $scope.test = "failed";
            console.log(err);
        });
    }
})
.controller(
    'profilShotsController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    $scope.data = [];
    
    function getShots() 
    {
        var url = "https://api.dribbble.com/v1/user/shots?page="+PAGE;
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
                $scope.data.push(i);
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
        });
    }
    getShots(); 
})
.controller(
    'profilFollowersController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.users = [];

    function getFollowers() 
    {
        var url = "https://api.dribbble.com/v1/user/followers?page="+PAGE;
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

            if (data.length > 0) {
                data.forEach(function(i) {
                    $scope.users.push(i.follower);
                });
            } else {
                $scope.noMoreItemsAvailable = true;
                
            }
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
                getFollowers();
            }
        });;
    }
    getFollowers(); 
})
.controller(
    'profilFollowingsController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.users = [];

    function getFollowings() 
    {
        var url = "https://api.dribbble.com/v1/user/following?page="+PAGE;
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

            if (data.length > 0) {
                data.forEach(function(i) {
                    $scope.users.push(i.followee);
                });
            } else {
                $scope.noMoreItemsAvailable = true;
                
            }
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
        });;
    }
    getFollowings(); 
})
.controller(
    'profilBucketsController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.buckets = [];

    function getBuckets() 
    {
        var url = "https://api.dribbble.com/v1/user/buckets?page="+PAGE;
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

            if (data.length > 0) {
                data.forEach(function(i) {
                    $scope.buckets.push(i);
                });
            } else {
                $scope.noMoreItemsAvailable = true;
                
            }
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
                getBuckets();
            }
        });;
    }
    getBuckets(); 
})
.controller(
    'profilLikesController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    $scope.data = [];
    
    function getLikes() 
    {
        var url = "https://api.dribbble.com/v1/user/likes?page="+PAGE;
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
                $scope.data.push(i.shot);
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
                getLikes();
            }
        });
    }
    getLikes(); 
})
.controller(
    'profilProjectsController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.projects = [];

    function getProjects() 
    {
        var url = "https://api.dribbble.com/v1/user/projects?page="+PAGE;
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

            if (data.length > 0) {
                data.forEach(function(i) {
                    $scope.projects.push(i);
                });
            } else {
                $scope.noMoreItemsAvailable = true;
                
            }
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
                getProjects();
            }
        });;
    }
    getProjects(); 
})
.controller(
    'profilTeamsController', 
    function(
        DribbbleApiUrl, 
        $scope, 
        $http, 
        $stateParams, 
        $sce, 
        $location,
        $localstorage,
        $cordovaInAppBrowser,
        $cordovaProgress,
        $ionicNavBarDelegate,  
        $ionicHistory, 
        $ionicBackdrop, 
        $ionicModal, 
        $ionicSlideBoxDelegate, 
        $ionicScrollDelegate, 
        $ionicLoading,
        $ionicPopover, 
        $rootScope, 
        $ionicUser, 
        $ionicPush
    ) {

    var OAUTH_TOKEN = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";
    var PAGE = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.teams = [];

    function getTeams() 
    {
        var url = "https://api.dribbble.com/v1/user/teams?page="+PAGE;
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

            if (data.length > 0) {
                data.forEach(function(i) {
                    $scope.teams.push(i);
                });
            } else {
                $scope.noMoreItemsAvailable = true;
                
            }
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
                getTeams();
            }
        });;
    }
    getTeams(); 
})
;
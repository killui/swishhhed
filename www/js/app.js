angular.module('Swishhhed', 
  [
    'ionic',
    'ngCordova',
    'ngCordovaOauth',
    'ngSanitize',
    'ionic.service.core',
    'ionic.service.analytics',
    'ionic.service.push',
    'starter.controllers', 
    'ionic.utils'
  ]
)
// RUN
.run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {

    $ionicAnalytics.register();
    
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.show();
      StatusBar.styleDefault();
    }

  });
})
.run(function($localstorage) {
  
  var clientId = "76a0e0c037b02db657be0b487297c105c4a43d54b8f2bb024d966b08f1e8a2aa";
  var clientSecret = "6d7bcf11e0f46efda352419616c20e78d863deea9eb43e0bc230616bcc7e7e35";
  //var accessToken = 'f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c';

  $localstorage.set('clientId',clientId);
  $localstorage.set('clientSecret',clientSecret);
  //$localstorage.set('accessToken',accessToken);

  // console.log($localstorage.get('requestToken'));
  // console.log($localstorage.get('accessToken'));
})
// CONFIG
.config(['$ionicAppProvider', function($ionicAppProvider) {
  // Identify app
  $ionicAppProvider.identify({
    // Your App ID
    app_id: '175d464d',
    // The public API key services will use for this app
    api_key: '4f634a93bc81cdd48ffeb15b116b3916a03033843fd64fcf',
    // Your GCM sender ID/project number (Uncomment if supporting Android)
    gcm_id: '859528838227'
    
  });
}])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  
  $stateProvider
  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'introController'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController'
  })
  //oauth-callback
  // .state('tab', {
  //   url: "/tab",
  //   abstract: true,
  //   templateUrl: "templates/tabbar.html"
  // })
  // HOME
  .state('home', {
    url: '/home',
    cache: true,
    // views: {
    //   "home" : {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
    //   }
    // }
  })
  //SHOTS
  .state('shots', {
    url: '/shots',
    cache: true,
    //views: {
      //"shots" : {
        templateUrl: 'templates/shots.html',
        controller: 'shotsController'
      //}
    //}
  })
  // SHOT
  .state('shot', {
    url: '/shots/:shotId',
    cache: true,
    // views: {
    //   "shots" : {
        templateUrl: 'templates/shot.html',
        controller: 'shotController'  
    //   }
    // }
  })
  .state('attachment', {
    url: '/shots/:shotId/attachment/:attachmentId',
    cache: true,
    // views: {
    //   "shots" : {
        templateUrl: 'templates/attachment.html',
        controller: 'attachmentsController'  
    //   }
    // }
  })
  // UPLOAD
  // .state('tab.upload', {
  //   url: '/upload',
  //   views: {
  //     "upload" : {
  //       templateUrl: 'templates/upload.html',
  //       controller: 'uploadController'
  //     }
  //   }
  // })
  // PROFIL
  // .state('tab.profil', {
  //   url: '/profil',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil.html',
  //       controller: 'profilController'
  //     }
  //   }
  // })
  // .state('tab.user-shots', {
  //   url: '/profil/shots',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil/shots.html',
  //       controller: 'profilShotsController'
  //     }
  //   }
  // })
  // .state('tab.user-followers', {
  //   url: '/profil/followers',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil/followers.html',
  //       controller: 'profilFollowersController'
  //     }
  //   }
  // })
  // .state('tab.user-followings', {
  //   url: '/profil/followings',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil/followings.html',
  //       controller: 'profilFollowingsController'
  //     }
  //   }
  // })
  // .state('tab.user-buckets', {
  //   url: '/profil/buckets',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil/buckets.html',
  //       controller: 'profilBucketsController'
  //     }
  //   }
  // })
  // .state('tab.user-likes', {
  //   url: '/profil/likes',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil/likes.html',
  //       controller: 'profilLikesController'
  //     }
  //   }
  // })
  // .state('tab.user-projects', {
  //   url: '/profil/projects',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil/projects.html',
  //       controller: 'profilProjectsController'
  //     }
  //   }
  // })
  // .state('tab.user-teams', {
  //   url: '/profil/teams',
  //   cache: true,
  //   views: {
  //     "profil" : {
  //       templateUrl: 'templates/profil/teams.html',
  //       controller: 'profilTeamsController'
  //     }
  //   }
  // })
  ;
  $urlRouterProvider.otherwise('/shots');
})
.config(['$compileProvider',function( $compileProvider ){ 
  var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
}])
.config(function($cordovaInAppBrowserProvider) {
  var options = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'no'
  };
  $cordovaInAppBrowserProvider.setDefaultOptions(options)
})
// FILTER
.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
;
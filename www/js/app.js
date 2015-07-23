angular.module('swishhhed', 
  [
    'ionic', 
    'starter.controllers', 
    'ionic.utils', 
    'ngSanitize',
    'ngCordova'
  ]
)

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      StatusBar.show();
      StatusBar.backgroundColorByName("red");
    }

  });
})

.run(function($localstorage) {
  
  var clientId = "76a0e0c037b02db657be0b487297c105c4a43d54b8f2bb024d966b08f1e8a2aa";
  var clientSecret = "6d7bcf11e0f46efda352419616c20e78d863deea9eb43e0bc230616bcc7e7e35";
  var accessToken = 'f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c';

  $localstorage.set('clientId',clientId);
  $localstorage.set('clientSecret',clientSecret);
  $localstorage.set('accessToken',accessToken);

  console.log($localstorage.get('requestToken'));
  console.log($localstorage.get('accessToken'));
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $ionicConfigProvider) {

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
  // setup an abstract state for the tabs directive

  // .state('login', {
  //   url: '/login',
  //   templateUrl: 'templates/login.html',
  //   controller: 'loginController'
  // })
  
  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'introController'
  })

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabbar.html"
  })

  .state('tab.home', {
    url: '/home',
    views: {
      "home" : {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })

  .state('tab.shots', {
    url: '/shots',
    views: {
      "shots" : {
        templateUrl: 'templates/shots.html',
        controller: 'shotsController'
      }
    }
  })

  .state('tab.shot', {
    url: '/shot/:shotId',
    views: {
      "shot" : {
        templateUrl: 'templates/shot.html',
        controller: 'shotController'
      }
    }
  })

  .state('tab.upload', {
    url: '/upload',
    views: {
      "upload" : {
        templateUrl: 'templates/upload.html',
        controller: 'uploadController'
      }
    }
  })

  .state('tab.profil', {
    url: '/profil',
    views: {
      "profil" : {
        templateUrl: 'templates/profil.html',
        controller: 'profilController'
      }
    }
  })
  ;

  $urlRouterProvider.otherwise('/intro');

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

.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
;
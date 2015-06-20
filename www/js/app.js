var requestToken = "";
var accessToken = "";

angular.module('swishhhed', 
  [
    'ionic', 
    'starter.controllers', 
    'ionic.utils', 
    'ngSanitize',
    'ngCordova',
    'ionic.service.core',
    'ionic.service.push'
  ]
)
/////////////////
///////// Run
.run(function($localstorage, $ionicPlatform) {
  
  var clientId = "76a0e0c037b02db657be0b487297c105c4a43d54b8f2bb024d966b08f1e8a2aa";
  var clientSecret = "6d7bcf11e0f46efda352419616c20e78d863deea9eb43e0bc230616bcc7e7e35";
  var clientAccessToken = "f59e506fd880352413323c6b53cb72c91e2b2ec2c6fa7da64a5250e2484c891c";

  $localstorage.set('clientId',clientId);
  $localstorage.set('clientSecret',clientSecret);
  $localstorage.set('clientAccessToken',clientAccessToken);


  console.log($localstorage.get('requestToken'));
  console.log($localstorage.get('accessToken'));

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
////////////////
/////// Config
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $ionicConfigProvider, $compileProvider, $cordovaInAppBrowserProvider, $ionicAppProvider) {

  ////////////////////////
  // $locationProvider
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  
  /////////////////////////
  // $ionicConfigProvider
  $ionicConfigProvider.tabs.position('bottom');

  /////////////////////////
  // $stateProvider
  $stateProvider
  // setup an abstract state for the tabs directive
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController'
  })
  .state('secure', {
      url: '/secure',
      templateUrl: 'templates/secure.html',
      controller: 'SecureController'
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
        templateUrl: 'templates/shots.html',
        controller: 'shotsController'
      }
    }
  })
  .state('shot', {
    url: '/shot/:shotId',
    templateUrl: 'templates/shot.html',
    controller: 'shotController'
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

  /////////////////////////
  // $urlRouterProvider
  $urlRouterProvider.otherwise('/login');

  /////////////////////////
  // $compileProvider
  var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);

  ///////////////////
  // $cordovaInAppBrowserProvider
  var options = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'no'
  };

  $cordovaInAppBrowserProvider.setDefaultOptions(options);

  ///////////////////
  // $ionicAppProvider
  // Identify app
  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: '175d464d',
    // The public API key all services will use for this app
    api_key: '4f634a93bc81cdd48ffeb15b116b3916a03033843fd64fcf',
    // Set the app to use development pushes
    dev_push: true
  });

})
////////////////////
/////// Filter
.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
;
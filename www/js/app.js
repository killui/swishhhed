// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('swishhhed', ['ionic', 'starter.controllers','ionic.utils'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
    });
})
.run(function($localstorage) {
    console.log($localstorage.get('name'));
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'templates/shots.html',
      controller: 'shotsController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginController'
    })
    .state('shots', {
      url: '/shot/:shotId',
      templateUrl: 'templates/shot.html',
      controller: 'shotController'
    })
    .state('profil', {
      url: '/profil',
      templateUrl: 'templates/profil.html',
      controller: 'profilController'
    });
    $urlRouterProvider.otherwise('/');
})
.config(['$compileProvider',function( $compileProvider ){ 
          var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
          $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);
       }
     ])
;
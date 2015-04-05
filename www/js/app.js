angular.module('swishhhed', ['ionic', 'starter.controllers', 'ionic.utils', 'ionic.ion.headerShrink', 'ngSanitize'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

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

  // .state('login', {
  //   url: '/login',
  //   templateUrl: 'templates/login.html',
  //   controller: 'loginController'
  // })

  .state('shots', {
    url: '/shot/:shotId',
    templateUrl: 'templates/shot.html',
    controller: 'shotController'
  })

  // .state('profil', {
  //   url: '/profil',
  //   templateUrl: 'templates/profil.html',
  //   controller: 'profilController'
  // })
  ;

  $urlRouterProvider.otherwise('/');

})
.config(['$compileProvider',function( $compileProvider ){ 

  var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);

}])
.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
;
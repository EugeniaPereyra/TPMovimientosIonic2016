// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.plugins && window.plugins.NativeAudio){
      window.plugins.NativeAudio.preloadSimple('abajo', 'audio/abajo.mp3', function(msg){
      }, function(msg){
        console.log("Error: "+msg);
      });

      window.plugins.NativeAudio.preloadSimple('acostado', 'audio/acostado.mp3', function(msg){
      }, function(msg){
        console.log("Error: "+msg);
      });

      window.plugins.NativeAudio.preloadSimple('arriba', 'audio/arriba.mp3', function(msg){
      }, function(msg){
        console.log("Error: "+msg);
      });

      window.plugins.NativeAudio.preloadSimple('derecha', 'audio/derecha.mp3', function(msg){
      }, function(msg){
        console.log("Error: "+msg);
      });

      window.plugins.NativeAudio.preloadSimple('izquierda', 'audio/izquierda.mp3', function(msg){
      }, function(msg){
        console.log("Error: "+msg);
      });

      window.plugins.NativeAudio.preloadSimple('parado', 'audio/parado.mp3', function(msg){
      }, function(msg){
        console.log("Error: "+msg);
      });
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/tab-login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('tab.motion', {
      url: '/motion/:nombre',
      views: {
        'tab-motion': {
          templateUrl: 'templates/tab-motion.html',
          controller: 'MotionCtrl'
        }
      }
    })

    .state('tab.grabado', {
      url: '/grabado',
      cache: false,
      views: {
        'tab-grabado': {
          templateUrl: 'templates/tab-grabado.html',
          controller: 'GrabadoCtrl'
        }
      }
    })

  .state('tab.autor', {
    url: '/autor',
    views: {
      'tab-autor': {
        templateUrl: 'templates/tab-autor.html',
        controller: 'AutorCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/login');

  $ionicConfigProvider.tabs.position('bottom');

});

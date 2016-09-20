angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('MotionCtrl', function($scope, $cordovaDeviceMotion, $cordovaNativeAudio, $timeout) {

  $scope.x = 0;
  $scope.y = 0;
  $scope.z = 0;
  $scope.timeStamp;
  $scope.velocidad = 100; //porcentaje de velocidad
  //$scope.caja = { width: 640, height: 360 };
  $scope.caja = { width: screen.availWidth, height: screen.availHeight  };
  $scope.mosca = { width: 50, height: 39 };
  $scope.flipClass = "";

  // watch Acceleration
  var options = { frequency: 100 };
  document.addEventListener("deviceready", function () {

    var watch = $cordovaDeviceMotion.watchAcceleration(options);
    
    watch.then(
      null,
      function(error) {
        // An error occurred
        alert(error);
      },
      function(result) {
        ActualizarPosicion(result);  
      });
  }, false);

  function ActualizarPosicion(result){
    // redondea x e y para que sea menos preciso al estar el telefono horizontal
    var x = Math.round(result.x); //variable del sensor
    var y = Math.round(result.y); //variable del sensor
    var vel = ($scope.velocidad / 100) * 2; //se multiplica por 2 para obtener un poco mas de velocidad

    var sonando=-1;
    if($scope.x!=0&&$scope.y!=0)
    {

          if(sonando==-1)
          {
            $cordovaNativeAudio.play('mosca');
            sonando=1;
          }
    }

    if($scope.x==0&&$scope.y==0)
    {
      if(sonando==1)
      {
        $cordovaNativeAudio.stop('mosca');
        sonando=-1;
      }
    }

    if (x > 0 && $scope.x > 0) 
    {
      $scope.x -= vel;
      if ($scope.flipClass == "flipX")
        $scope.flipClass = "";
    }
    if ((x < 0) && (($scope.x + $scope.mosca.width) < $scope.caja.width))
    {
      $scope.x += vel;
      if ($scope.flipClass != "flipX")
        $scope.flipClass = "flipX";
    }
    if ((y > 0) && (($scope.y + $scope.mosca.height) < $scope.caja.height)) 
      $scope.y += vel;
    if (y < 0 && $scope.y > 0)
      $scope.y -= vel;

    $scope.z = result.z;
    $scope.timeStamp = result.timestamp;

  };

  $scope.Reiniciar = function(){
    $scope.x = 0;
    $scope.y = 0;
    $scope.z = 0;
    $scope.velocidad = 100;
  }
  
})


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

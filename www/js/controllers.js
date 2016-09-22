angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state) {
  $scope.usuarioLog={};

  $scope.Guardar=function(){
    var dato=JSON.stringify($scope.usuarioLog);
    $state.go("tab.motion",{nombre:dato});
  }
})

.controller('MotionCtrl', function($scope, $stateParams, $cordovaDeviceMotion, $cordovaMedia, $window) {

  $scope.MarginLeft = 0;
  $scope.MarginTop = 0;
  $scope.z = 0;
  $scope.timeStamp;
  $scope.velocidad = 100; //porcentaje de velocidad
  $scope.mosca = { width: 50, height: 39 };
  $scope.flipClass = "";

  $scope.caja = { width: 0, height: 0 };

  //Calcula el width y height de la pantalla
  $scope.calcularPantalla = function() {
    $scope.caja.width = $window.innerWidth;
    $scope.caja.height = $window.innerHeight- 49;
  }
  
  $scope.calcularPantalla();

  //Asigna la funcion como manejador para el evento que se lanza al rotar la pantalla
  angular.element($window).bind('resize', function(){
    $scope.$apply(function() {
      $scope.calcularPantalla();    
    })       
  });
  
  //var src = 'audio/mosca.mp3';
  //var media = $cordovaMedia.newMedia(src);

  //media.play();
  $scope.sonando = false;

  // watch Acceleration
  var options = { frequency: 200 };
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
    var SensorX = Math.round(result.x); //variable del sensor
    var SensorY = Math.round(result.y); //variable del sensor
    var vel = ($scope.velocidad / 100) * 2; //se multiplica por 2 para obtener un poco mas de velocidad
    
      $scope.sonar = false;

    if (SensorX > 0 && $scope.MarginLeft > 0) 
    {
      // Se mueve a la izquierda
      $scope.MarginLeft -= vel;
      if ($scope.flipClass == "flipX")
        $scope.flipClass = "";
      $scope.sonar = true;
    }
    
    if ((SensorX < 0) && (($scope.MarginLeft + $scope.mosca.width) < $scope.caja.width))
    {
      // Se mueve a la derecha
      $scope.MarginLeft += vel;
      if ($scope.flipClass != "flipX")
        $scope.flipClass = "flipX";
      $scope.sonar = true;
    }
    
    if ((SensorY > 0) && (($scope.MarginTop + $scope.mosca.height) < $scope.caja.height)) 
    {
      // Se mueve abajo
      $scope.MarginTop += vel;
      $scope.sonar = true;
    }
    
    if (SensorY < 0 && $scope.MarginTop > 0)
    {
      // Se mueve arriba
      $scope.MarginTop -= vel;
      $scope.sonar = true;
    }

    $scope.z = result.z;
    $scope.timeStamp = result.timestamp;


    if ($scope.sonar && !$scope.sonando)
    {
      //alert('pone play');
      //media.play();
      $scope.sonando = true; 
    }
    
    if (!$scope.sonar) 
    {
      //alert('pone stop');
      //media.pause();
      $scope.sonando = false;
    }
  };

  $scope.Reiniciar = function(){
    $scope.MarginLeft = 0;
    $scope.MarginTop = 0;
    $scope.z = 0;
    $scope.velocidad = 100;
    $scope.sonar = false;
    $scope.sonando = false;
  }
  
})


.controller('AutorCtrl', function($scope) {
  $scope.autor={};
  $scope.autor.nombre="Maria Eugenia Pereyra";
  $scope.autor.foto="img/autor.jpg";
  $scope.autor.email="meugeniape@gmail.com";
  $scope.autor.github="https://github.com/EugeniaPereyra";
});

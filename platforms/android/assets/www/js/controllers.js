angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state) {
  $scope.usuarioLog={};

  $scope.Guardar=function(){
    var dato=JSON.stringify($scope.usuarioLog);
    $state.go("tab.motion",{nombre:dato});
    $scope.usuarioLog.nombreLog="";
  }
})

.controller('MotionCtrl', function($scope, $stateParams, $cordovaDeviceMotion, $cordovaNativeAudio, $timeout, $cordovaFile, $ionicPopup ) {
  $scope.debug = false; // false para ocultar coordenadas

  $scope.usuario={};
  var nombre=JSON.parse($stateParams.nombre);
  $scope.usuario.nombre=nombre.nombreLog;
  $scope.grabados=[];

  $scope.X = 0;
  $scope.Y = 0;
  $scope.Z = 0;
  $scope.flipClass = "";

  $scope.izquierda=false;
  $scope.derecha=false;
  $scope.arriba=false;
  $scope.abajo=false;
  $scope.acostado=false;
  $scope.parado=false;

  $scope.sensibilidad=1;
  
  // watch Acceleration
  var options = { frequency: 100 };
  document.addEventListener("deviceready", function () {

    $cordovaFile.createFile(cordova.file.externalRootDirectory, "motion.txt",true) // cordova.file.dataDirectory //cordova.file.externalRootDirectory
        .then(function (success) {
          // success
          console.log("archivo creado");
        }, function (error) {
          // error
          console.log(error);
        });

    $scope.watch = $cordovaDeviceMotion.watchAcceleration(options);
    
    $scope.watch.then(
      null,
      function(error) {
        // An error occurred
        console.log(error);
      },
      function(result) {
        ActualizarRotacion(result);  
      });
  }, false);

  function ActualizarRotacion(result){
    // redondea x e y para que sea menos preciso al estar el telefono horizontal
    var SensorX = Math.round(result.x); //variable del sensor
    var SensorY = Math.round(result.y); //variable del sensor
    var SensorZ = Math.round(result.z); //variable del sensor

    $scope.X = SensorX;
    $scope.Y = SensorY;
    $scope.Z = SensorZ;

    if (SensorX > 0 && SensorX>$scope.sensibilidad && SensorY == 0) 
    {
      // Rota a la izquierda
      if(!$scope.izquierda)
      {
        $scope.flipClass = "rotate270";
        Reproducir('izquierda');
        $scope.izquierda=true;
        $scope.derecha=false;
        $scope.arriba=false;
        $scope.abajo=false;
        $scope.acostado=false;
        $scope.parado=false;
        if($scope.movimientos)
        {
          $scope.movimientos.push('izquierda');
        }
      }
    }
    
    if ( SensorX < 0 && SensorX < $scope.sensibilidad * -1 && SensorY == 0)
    {
      // Rota a la derecha
      if(!$scope.derecha)
      {
        $scope.flipClass = "rotate90";
        Reproducir('derecha');
        $scope.izquierda=false;
        $scope.derecha=true;
        $scope.arriba=false;
        $scope.abajo=false;
        $scope.acostado=false;
        $scope.parado=false;
        if($scope.movimientos)
        {
          $scope.movimientos.push('derecha');
        }
      }
    }
    
    if (SensorY > 0 && SensorY > $scope.sensibilidad && SensorZ != 0 && SensorX == 0) 
    {
      // Rota abajo
      if(!$scope.abajo)
      {
        $scope.flipClass = "flipY";
        Reproducir('abajo');
        $scope.izquierda=false;
        $scope.derecha=false;
        $scope.arriba=false;
        $scope.abajo=true;
        $scope.acostado=false;
        $scope.parado=false;
        if($scope.movimientos)
        {
          $scope.movimientos.push('abajo');
        }
      }
    }
    
    if (SensorY < 0 && SensorY < $scope.sensibilidad * -1 && SensorX == 0 )
    {
      // Rota arriba
      if(!$scope.arriba)
      {
        $scope.flipClass = "";
        Reproducir('arriba');
        $scope.izquierda=false;
        $scope.derecha=false;
        $scope.arriba=true;
        $scope.abajo=false;
        $scope.acostado=false;
        $scope.parado=false;
        if($scope.movimientos)
        {
          $scope.movimientos.push('arriba');
        }
      }
    }

    if (SensorZ == 10 && SensorX == 0 && SensorY == 0)
    {
      //mira hacia arriba
      if(!$scope.acostado)
      {
        Reproducir('acostado');
        $scope.izquierda=false;
        $scope.derecha=false;
        $scope.arriba=false;
        $scope.abajo=false;
        $scope.acostado=true;
        $scope.parado=false;
        if($scope.movimientos)
        {
          $scope.movimientos.push('acostado');
        }
      }
    }
    if (SensorZ == -10 && SensorX == 0 && SensorY == 0)
    {
      //mira hacia abajo
      if(!$scope.acostado)
      {
        Reproducir('acostado');
        $scope.izquierda=false;
        $scope.derecha=false;
        $scope.arriba=false;
        $scope.abajo=false;
        $scope.acostado=true;
        $scope.parado=false;
        if($scope.movimientos)
        {
          $scope.movimientos.push('acostado');
        }
      }
    }
    if (SensorZ == 0)
    {
      //parado
      if(!$scope.parado)
      {
        Reproducir('parado');
        $scope.izquierda=false;
        $scope.derecha=false;
        $scope.arriba=false;
        $scope.abajo=false;
        $scope.acostado=false;
        $scope.parado=true;
        if($scope.movimientos)
        {
          $scope.movimientos.push('parado');
        }
      }
    }
  }

  function Reproducir(sonido){ 
      try
      {
        $cordovaNativeAudio.play(sonido);
      }
      catch(e)
      {
        console.log("El sonido solo funciona en dispositivos");
      }
  }

  try{
    $cordovaFile.checkFile(cordova.file.externalRootDirectory, "motion.txt") // cordova.file.dataDirectory //cordova.file.externalRootDirectory
          .then(function (success) {
            // succes
            $cordovaFile.readAsText(cordova.file.externalRootDirectory, "motion.txt")
                    .then(function (success) {
                      var dato=JSON.parse(success);
                      $scope.grabados=dato;
                    }, function (error) {
                      // error
                      console.log(error);
                    });
          }, function (error) {
            // error
            console.log(error);
          });
  }
  catch(e)
  {
    console.log("El plugin File funciona en dispositivos unicamente");
  }

  $scope.Grabar=function(){
    $scope.movimientos=[];
  }

  $scope.Parar=function(){
    var archivo={};
    archivo.nombre=$scope.usuario.nombre;
    archivo.movimientos=$scope.movimientos;

    var confirmPopup = $ionicPopup.confirm({
        title: 'Guardar',
        template: '¿Desea guardar en archivo?',
        cssClass:'salida',
        okType: 'button-assertive',
      });

      $scope.grabados.push(archivo);
      var dato=JSON.stringify($scope.grabados);

      confirmPopup.then(function(res) {
        if(res) {
          try{            
              $cordovaFile.writeFile(cordova.file.externalRootDirectory, "motion.txt", dato, true)
                .then(function (success) {
                  // success
                  console.log("archivo guardado");
                }, function (error) {
                  // error
                  console.log(error);
                });
          }
          catch(e)
          {
            console.log("El plugin File funciona en dispositivos unicamente");
          }
        }
      });

      $scope.copia=$scope.movimientos;
      $scope.movimientos=null;
  }

  $scope.Escuchar=function(){
    var retraso=0;
    $scope.watch.clearWatch();

    angular.forEach($scope.copia, function(value, index) {
          try
          {
            $timeout(function(){$cordovaNativeAudio.play(value);},retraso);
          }
          catch(e)
          {
            console.log("La vibracion y el sonido, solo funcionan en celulares");
          }

            retraso+=1000;
        });  
    
    $scope.watch = $cordovaDeviceMotion.watchAcceleration(options);
  }

})

.controller('GrabadoCtrl', function($scope, $cordovaFile) {
  $scope.archivo={};
  document.addEventListener("deviceready", 
    function onDeviceReady() {
      $cordovaFile.readAsText(cordova.file.externalRootDirectory, "motion.txt")
              .then(function (success) {
                // success
                var dato=JSON.parse(success);
                $scope.archivo=dato;
              }, function (error) {
                // error
                console.log(error);
              });
    }, false);
})


.controller('AutorCtrl', function($scope) {
  $scope.autor={};
  $scope.autor.nombre="Maria Eugenia Pereyra";
  $scope.autor.foto="img/autor.jpg";
  $scope.autor.email="meugeniape@gmail.com";
  $scope.autor.github="https://github.com/EugeniaPereyra";
});

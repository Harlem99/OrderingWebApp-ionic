/**
 * Created by bjwsl-001 on 2017/3/16.
 */

var app = angular.module('kfl', ['ionic']);

//自定义服务：对$http的封装，
// 目的是为了每次发请求时显示一个加载中的遮盖层，请求完成隐藏遮盖层
app.service('$kflHttp', ['$http', '$ionicLoading',
  function ($http, $ionicLoading) {

    //有两个参数：
    //url:请求的地址以及对应的参数
    //successCallback：成功的处理函数
    this.sendRequest = function (url, successCallback) {
      $ionicLoading.show({
        template: 'loading...'
      })
      $http.get(url).success(function (data) {
        $ionicLoading.hide();
        successCallback(data);
      });
    }

  }])

app.config(function ($stateProvider, $ionicConfigProvider, $urlRouterProvider) {

  //设置tabs显示在底部
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('start', {
      url: '/kfl_start',
      templateUrl: 'tpl/start.html'
    })
    .state('main', {
      url: '/kfl_main',
      templateUrl: 'tpl/main.html',
      controller: 'mainCtrl'
    })
    .state('detail', {
      url: '/kfl_detail/:id',
      templateUrl: 'tpl/detail.html',
      controller: 'detailCtrl'
    })
    .state('order', {
      url: '/kfl_order/:id',
      templateUrl: 'tpl/order.html',
      controller: 'orderCtrl'
    })
    .state('myOrder', {
      url: '/kfl_myOrder',
      templateUrl: 'tpl/myOrder.html',
      controller: 'myOrderCtrl'
    })
    .state('setting', {
      url: '/kfl_setting',
      templateUrl: 'tpl/setting.html',
      controller: 'settingCtrl'
    })
    .state('myCart', {
      url: '/kfl_myCart',
      templateUrl: 'tpl/myCart.html',
      controller: 'myCartCtrl'
    })
  $urlRouterProvider.otherwise('/kfl_start');
})

app.controller('parentCtrl', ['$scope', '$state',
  function ($scope, $state) {
    $scope.data = {cartNumber:0};
    $scope.jump = function (desState, args) {
      $state.go(desState, args);
    }
  }]);

app.controller('mainCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {
    $scope.hasMore = true;
    $scope.info = {kw: ''};
    $scope.dishList = [];

    $kflHttp.sendRequest('data/dish_getbypage.php',
      function (data) {
        $scope.dishList = data;
      }
    )

    $scope.loadMore = function () {

      $kflHttp.sendRequest(
        'data/dish_getbypage.php?start='
        + $scope.dishList.length,
        function (data) {
          if (data.length < 5) {
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);
          $scope.$broadcast('scroll.infiniteScrollComplete')
        });


    }

    $scope.$watch('info.kw', function () {
      if ($scope.info.kw) {
        $kflHttp.sendRequest(
          'data/dish_getbykw.php?kw=' + $scope.info.kw,
          function (data) {
            if (data.length > 0) {
              $scope.dishList = data;
            }
          }
        )
      }

    })

  }])

app.controller('detailCtrl', ['$ionicPopup', '$scope', '$kflHttp', '$stateParams',
  function ($ionicPopup, $scope, $kflHttp, $stateParams) {
    console.log($stateParams.id);
    $kflHttp.sendRequest(
      'data/dish_getbyid.php?id=' + $stateParams.id,
      function (data) {
        console.log(data);
        $scope.dish = data[0];
      }
    )

    $scope.addToCart = function () {
      $kflHttp.sendRequest(
        'data/cart_update.php?uid=1&did=' + $stateParams.id + "&count=-1",
        function (data) {
          console.log(data);
          if (data.msg == 'succ') {
            $scope.data.cartNumber++;
            $ionicPopup.alert({
              template: '添加到购物车成功'
            });
          }
        }
      )
    }
  }
])

app.controller('orderCtrl',
  ['$scope', '$kflHttp', '$stateParams', '$httpParamSerializerJQLike',
    function ($scope, $kflHttp, $stateParams, $httpParamSerializerJQLike) {
     /* console.log($stateParams.id);
      $scope.order = {
        did: $stateParams.id
      }*/

      $scope.order = {
        totalprice:sessionStorage.getItem('totalPrice'),
        cartDetail:sessionStorage.getItem('cartDetail'),
        userid:1
      };


      $scope.submitOrder = function () {
        console.log($scope.order);
        var result = $httpParamSerializerJQLike($scope.order);
        console.log(result);
        $kflHttp.sendRequest(
          'data/order_add.php?' + result,
          function (data) {
            console.log(data);
            if (data.length > 0) {
              if (data[0].msg == 'succ') {
                //sessionStorage.setItem('phone', $scope.order.phone)
                $scope.requestResult = '下单成功，订单编号为' + data[0].oid;
              }
              else {
                $scope.requestResult = '下单失败';
              }
            }

          }
        )
      }

    }])

app.controller('myOrderCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {

    $kflHttp.sendRequest(
      'data/order_getbyuserid.php?userid=1',
      function (serverData) {
        $scope.orderList = serverData.data;
      }
    )

  }
])


app.controller('settingCtrl', ['$scope', '$ionicModal',
  function ($scope, $ionicModal) {

    $scope.infoList = [
      {name: '开发者', value: 'web'},
      {name: '版本号', value: 'v1.0'},
      {name: 'email', value: 'web@tedu.cn'},
    ]

    $ionicModal
      .fromTemplateUrl('tpl/about.html', {
        scope: $scope
      })
      .then(function (modal) {
        $scope.modal = modal;
      })

    $scope.open = function () {
      $scope.modal.show();
    }

    $scope.close = function () {
      $scope.modal.hide();
    }

  }])

app.controller('myCartCtrl', ['$scope', '$kflHttp',
  function ($scope, $kflHttp) {
    $scope.editShowMsg = '编辑';
    $scope.editEnable = false;

    $scope.funcToggleEdit = function () {
      $scope.editEnable = !$scope.editEnable;
      if ($scope.editEnable) {
        $scope.editShowMsg = '完成';
      }
      else {
        $scope.editShowMsg = '编辑';
      }
    }

    $kflHttp.sendRequest(
      'data/cart_select.php?uid=1',
      function (serverData) {
        console.log(serverData);
        $scope.cart = serverData.data;

      }
    )

    $scope.sumAll = function () {
      var result = 0;
      angular.forEach($scope.cart, function (value, key) {
        result += (value.price * value.dishCount);
      })
      return result;
    }

    //将修改后的菜品的id和数量 更新到服务器端
    $scope.updateToServer = function (id, count) {
      $kflHttp.sendRequest(
        'data/cart_update.php?uid=1&did=' + id + "&count=" + count,
        function (data) {
          console.log(data);
        }
      )
    }

    $scope.add = function (index) {
      $scope.cart[index].dishCount++;
      $scope.updateToServer(
        $scope.cart[index].did,
        $scope.cart[index].dishCount);
    }

    $scope.reduce = function (index) {
      var num = $scope.cart[index].dishCount;
      if (num <= 1) {
        $scope.cart[index].dishCount = 1;
      }
      else {
        $scope.cart[index].dishCount--;
        $scope.updateToServer(
          $scope.cart[index].did,
          $scope.cart[index].dishCount);
      }

    }

    $scope.jumpToOrder = function () {
      //将总价以及购物车详情存在sessionStorage

      var jsonStr = angular.toJson($scope.cart);

      sessionStorage.setItem('totalPrice',$scope.sumAll());
      sessionStorage.setItem('cartDetail',jsonStr);

      $scope.jump('order');
    }
  }])






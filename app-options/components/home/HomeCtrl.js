app.controller('home-controller', function ($scope) {
    $scope.hi = 'huin nhon';
    // chrome.runtime.sendMessage({
    //     func: 'getData',
    //     params: {
    //         col: 'messengerBG'
    //     }
    // }, function(data){
    //     $scope.data = data;
    //     $scope.$apply();
    //     console.log(data);
    // })
    // $scope.show = function(i) {
    //     alert(i.refer)
    // }
})
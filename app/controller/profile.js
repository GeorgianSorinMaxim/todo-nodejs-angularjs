var myApp = angular.module('myApp', []);

myApp.controller('profileController', ['$scope', function($scope) {
      $scope.val = {};

      var min = $scope.min = moment('1900-01-01');
      var max = $scope.max = moment(new Date()); // Defaults to now

      $scope.years = [];

      for (var i=max.year(); i>=min.year(); i--) {
        $scope.years.push(i);
      }

      $scope.$watch('val.year', function () {
        updateMonthOptions();
      });

      $scope.$watchCollection('[val.month, val.year]', function () {
        updateDateOptions();
      });

      function updateMonthOptions () {
        // Values begin at 1 to permit easier boolean testing
        $scope.months = [];

        var minMonth = $scope.val.year && min.isSame([$scope.val.year], 'year') ? min.month() : 0;
        var maxMonth = $scope.val.year && max.isSame([$scope.val.year], 'year') ? max.month() : 11;

        var monthNames = moment.months();

        for (var j=minMonth; j<=maxMonth; j++) {
          $scope.months.push({
            name: monthNames[j],
            value: j+1
          });
        }

        if ($scope.val.month-1 > maxMonth || $scope.val.month-1 < minMonth) delete $scope.val.month;
      }

      function updateDateOptions (year, month) {
        var minDate, maxDate;

        if ($scope.val.year && $scope.val.month && min.isSame([$scope.val.year, $scope.val.month-1], 'month')) {
          minDate = min.date();
        } else {
          minDate = 1;
        }

        if ($scope.val.year && $scope.val.month && max.isSame([$scope.val.year, $scope.val.month-1], 'month')) {
          maxDate = max.date();
        } else if ($scope.val.year && $scope.val.month) {
          maxDate = moment([$scope.val.year, $scope.val.month-1]).daysInMonth();
        } else {
          maxDate = 31;
        }

        $scope.dates = [];

        for (var i=minDate; i<=maxDate; i++) {
          $scope.dates.push(i);
        }
        if ($scope.val.date < minDate || $scope.val.date > maxDate) delete $scope.val.date;
      }

      $scope.val.date = parseInt(JSON.stringify('<%= user.local.profile.firstname %>'));

      console.log($scope.val.date);

      // $scope.val.month = parseInt(JSON.stringify(user.local.profile.dobmonth));
      // $scope.val.year = parseInt(JSON.stringify(user.local.profile.dobyear));
      //
      // $scope.gender = JSON.stringify(user.local.profile.gender);
      // $scope.language = JSON.stringify(user.local.profile.language);
      //
      // $scope.checkbox = Boolean(JSON.stringify(user.local.profile.newsletter));

      //console.log($scope.checkbox);
      //console.log($scope.val.date, $scope.val.month, $scope.val.year);
      //console.log($scope.gender, $scope.language);
}]);

'use strict';

/**
 * @ngdoc function
 * @name reaperResultsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the reaperResultsApp
 */
angular.module('reaperResultsApp')
  .controller('StatsCtrl', ['$scope', '$http', '$filter', 'ENV',
  function ($scope, $http, $filter, ENV) {
    $scope.histogramLabels = [];
    $scope.histogramData = [];

    $scope.resultsLabels = [];
    $scope.resultsData = [];

    $scope.languagesLabels = [];
    $scope.languagesData = [];

    $scope.totalResults = 0;

    $scope.statsPromise = $http.get(ENV.endpoint + '/stats', {cache: true})
      .then(function(response) {
        $scope.totalResults = response.data.total;

        let histogramLabels = [];
        let histogramData = [];
        for (let i = 0; i < response.data.scores.length; i++) {
          histogramLabels.push(response.data.scores[i][0]);
          histogramData.push(response.data.scores[i][1]);
        }

        $scope.histogramLabels = histogramLabels;
        $scope.histogramData.push(histogramData);

        let resultsLabels = [];
        let resultsData = [];
        for (let i = 0; i < response.data.results_per_day.length; i++) {
          resultsLabels.push(response.data.results_per_day[i][0]);
          resultsData.push(response.data.results_per_day[i][1]);
        }

        $scope.resultsLabels = resultsLabels;
        $scope.resultsData.push(resultsData);

        let languagesLabels = [];
        let languagesData = [];
        for (let i = 0; i < response.data.languages.length; i++) {
          languagesLabels.push(response.data.languages[i][0]);
          languagesData.push(response.data.languages[i][1]);
        }

        $scope.languagesLabels = languagesLabels;
        $scope.languagesData = languagesData;
      });

      Chart.defaults.global.tooltipTemplate = function(chartElement) {
        const value = $filter('number')(chartElement.value, 0);
        return value;
      };
  }]);

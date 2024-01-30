/* Copyright start
    MIT License
    Copyright (c) 2024 Fortinet Inc
  Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('progressBar100Ctrl', progressBar100Ctrl);

        progressBar100Ctrl.$inject = ['$scope', 'FormEntityService', '$rootScope', '$timeout', 'websocketService'];

    function progressBar100Ctrl($scope, FormEntityService, $rootScope, $timeout, websocketService) {
        // $scope.config == config
        // $scope.config.module is saved from the editcontroller

        $scope.currentTheme = $rootScope.theme.id;
        $scope.loadViewData = loadViewData;

        var subscriptions = [];


        $scope.$on('websocket:reconnect', function () {
            init();
        });


        function init() {
            websocketService.subscribe($scope.config.module, function (data) {
                loadViewData();
                // when the data is changed the function is called
            }).then(function (data) {
                subscriptions.push(data);
                loadViewData();
            });
        }

        // ---------- start of custom javascript -----------

        const colorPalette = [
            { percent: 10, color: '#c0ff33' },
            { percent: 20, color: '#feff5c' },
            { percent: 60, color: '#ffa879' },
            { percent: 40, color: '#ffc163' },
            { percent: 100, color: '#fb4b4b' }
        ];

        function set_indicator_bar(node_id, percentage, timer_text) {
            percentage = clamp(percentage, 0, 100);
            if (timer_text == null) {
                timer_text = `${percentage}%`;
            }

            let color = 'transparent';
            for (let i = 0; i < colorPalette.length; i++) {
                if (percentage <= colorPalette[i].percent) {
                    color = colorPalette[i].color;
                    break;
                }
            }
            const node_lower_div = document.getElementById(`${node_id}`);
            const node_progress_bar = node_lower_div.querySelector('.node-lower-progress');
            node_progress_bar.style.backgroundColor = color;
            node_progress_bar.style.width = percentage + '%';
            const lower_text = node_lower_div.querySelector('.node-lower-text');
            lower_text.innerText = timer_text;
        }

        function clamp(val, min_val, max_val) {
            return Math.min(Math.max(val, min_val), max_val);
        }

        // ---------- end of custom javascript -----------

        // This code handles data to be calculated for view panel
        function loadViewData() {
            if (typeof $scope.config.selectInput !== "undefined") {
                const value = FormEntityService.get().fields[$scope.config.selectInput].value;
                if (typeof value === "number") {
                    set_indicator_bar($scope.config.wid, value, null);
                }
            }
        }


        $scope.$on('$destroy', function () {
            angular.forEach(subscriptions, function (subscription) {
                websocketService.unsubscribe(subscription);
            });
            // unsubscribing web sockets
        });

        $timeout(
            () => {init();},
            1000
        );
    }
})();

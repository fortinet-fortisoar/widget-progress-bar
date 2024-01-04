/* Copyright start
  Copyright (C) 2008 - 2023 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editProgress_bar100Ctrl', editProgress_bar100Ctrl);

    editProgress_bar100Ctrl.$inject = ['$scope', 'config', '$uibModalInstance', 'Entity', 'FormEntityService', '$state', 'appModulesService'];

    function editProgress_bar100Ctrl($scope, config, $uibModalInstance, Entity, FormEntityService, $state, appModulesService) {
        // $scope: current scope of html and widget itself
        // $scope.page: current page can include ['dashboard', 'reporting', '?']

        // uibModalInstance: widget ui save and close 
        // appModulesService: requests and gets all module from the javascript, appModulesService.load(true).then(function (modules) {})

        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config; // injection to use config as a object

        $scope.config.module = '';

        $scope.loadModuleFields = loadModuleFields;

        function init() {
            appModulesService.load(true).then(function (modules) {
                $scope.modules = [];
                // resetting the modules

                $scope.modules = modules;
                // puts all the modules
            });
        }
        init();


        // Loads fields of a module
        function loadModuleFields() {
            $scope.config.inputFields = [];

            var entity = new Entity($scope.config.module);
            entity.loadFields().then(function () {
                for (var key in entity.fields) {
                    $scope.config.inputFields.push(entity.fields[key]);
                }
                $scope.config.fields = entity.getFormFields();
            });
        }


        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            $uibModalInstance.close($scope.config);
        }

    }
})();

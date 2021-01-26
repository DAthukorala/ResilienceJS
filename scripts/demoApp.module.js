import * as angular from 'angular';
import requestTester from './components/request-tester/request-tester.component'
import dummyService from './services/dummy.service'

angular.module("demoApp", [])
    .component('requestTester', requestTester())
    .service('dummyService',dummyService);
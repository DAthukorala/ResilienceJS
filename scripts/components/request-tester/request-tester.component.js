import { Policy, ConsecutiveBreaker } from 'cockatiel';
import * as template from "./request-tester.component.html";

export default function requestTester() {
    return {
        template: template,
        controller: ('requestTesterController', requestTesterController),
        controllerAs: 'ctrl'
    };
}

function requestTesterController(dummyService) {
    let self = this;

    self.result = "";
    self.getWithRetry = getWithRetry;
    self.getWithCircuitBreaker = getWithCircuitBreaker;
    self.getWithCircuitBreakerAndRetry = getWithCircuitBreakerAndRetry;

    function getWithRetry() {
        clearResult();
        var retryPolicy = getRetryPolicy();
        retryPolicy.execute(() => {
            dummyService.getUsers().then((response) => {
                this.result = response;
            })
        });
    }

    function getWithCircuitBreaker() {
        clearResult();
        var circuitBreakerPolicy = getCircuitBreakerPolicy();
        circuitBreakerPolicy.execute(() => {
            dummyService.getToDos().then((response) => {
                this.result = response;
            })
        });
    }

    function getWithCircuitBreakerAndRetry() {
        clearResult();
        var retryPolicy = getRetryPolicy();
        var circuitBreakerPolicy = getCircuitBreakerPolicy();
        //combine retry and circuit breaker policies for a better strategy
        const retryWithBreaker = Policy.wrap(retryPolicy, circuitBreakerPolicy);
        retryWithBreaker.execute(() => {
            dummyService.getComments().then((response) => {
                this.result = response;
            })
        });
    }

    function getRetryPolicy() {
        const policy = Policy.handleAll().retry()
            .delay([100, 200, 300]); //retry 3 times, increasing delays between them
        return policy;
    }

    function getCircuitBreakerPolicy() {
        // Break if more than 5 requests in a row fail
        const policy = Policy.handleAll().circuitBreaker(10 * 1000, new ConsecutiveBreaker(5));
        return policy;
        /**
         * 10 * 1000 is the time to change the circuit status to HalfOpen, which means the circuit (or connection) is
         * Recovering from open state, after the automated break duration has
         * expired. Execution of actions permitted. Success of subsequent action/s
         * controls onward transition to Open or Closed state.
         */
    }

    function clearResult() {
        self.result = "";
    }
}
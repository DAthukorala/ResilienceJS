export default function dummyService($http) {
    var service = {
        getUsers: getUsers,
        getToDos: getToDos,
        getComments: getComments
    }
    return service;

    function getUsers() {
        return $http.get("https://jsonplaceholder.typicode.com/users")
            .then(function (response) {
                return response.data;
            });
    }

    function getToDos() {
        return $http.get("https://jsonplaceholder.typicode.com/todos")
            .then(function (response) {
                return response.data;
            });
    }

    function getComments() {
        return $http.get("https://jsonplaceholder.typicode.com/comments")
            .then(function (response) {
                return response.data;
            });
    }

}
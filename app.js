var app = angular.module('study-helper', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/questions');

    $stateProvider

        .state('questions', {
            url: '/questions',
            templateUrl: 'partial-questions.html'
        })

        .state('subjects', {
            url: '/subjects',
            templateUrl: 'partial-subjects.html'
        })

        .state('questions.list', {
            url: '/list',
            templateUrl: 'partial-questions-list.html',
            controller: questionListCtrl,
            resolve: {
                questionList: function (questionService) {
                    var list = questionService.getList();
                    return list;
                }
            }
        })

        .state('questions.new', {
            url: '/new',
            templateUrl: 'partial-new-question.html',
            controller: newQuestionCtrl,
            resolve: {
                subjectsList: function (subjectService) {
                    var list = subjectService.getList();
                    return list;
                }
            }
        })

        .state('subjects.list', {
            url: '/list',
            templateUrl: 'partial-subjects-list.html',
            controller: subjectListCtrl,
            resolve: {
                subjectList: function (subjectService) {
                    var list = subjectService.getList();
                    return list;
                }
            }
        })

        .state('subjects.new', {
            url: '/new',
            templateUrl: 'partial-new-subject.html',
            controller: newSubjectCtrl
        })

        .state('test', {
            url: '/test',
            views: {

                '': { templateUrl: 'partial-test.html' },

                'columnOne@about': { template: 'Look I am a column!' },

                'columnTwo@about': {
                    templateUrl: 'table-data.html',
                    controller: 'scotchController'
                }
            }

        });

});

app.controller('scotchController', function ($scope) {

    $scope.message = 'test';

    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];

});

function questionListCtrl($scope, questionList, questionService) {
    $scope.questions = questionList;

    $scope.remove = function (id) {
        questionService.remove(id);
        location.reload();
    }
}

function subjectListCtrl($scope, subjectList, subjectService) {
    $scope.subjects = subjectList;

    $scope.remove = function (subject) {
        subjectService.remove(subject);
        location.reload();
    }
}

function newQuestionCtrl($scope, questionService, subjectsList) {
    var emptyQuestion = {
        'id': questionService.getNextId(),
        'question': '',
        'subject': '',
        'correct': -1,
        'answers': ['']
    };
    
    $scope.subjects = subjectsList;
    $scope.newQuestion = copy(emptyQuestion);

    $scope.addAnswer = function () {
        $scope.newQuestion.answers.push('');
    }

    $scope.save = function () {
        questionService.save($scope.newQuestion);
        $scope.newQuestion = copy(emptyQuestion);
    }
}

function newSubjectCtrl($scope, subjectService) {
    $scope.newSubject = '';

    $scope.save = function () {
        subjectService.save($scope.newSubject);
        $scope.newSubject = '';
    }
}

function copy(object) {
    return JSON.parse(JSON.stringify(object));
}
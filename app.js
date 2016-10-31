var app = angular.module('study-helper', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/questions');

    $stateProvider

        .state('questions', {
            url: '/questions',
            templateUrl: 'partial-questions.html'
        })

        .state('test', {
            url: '/test',
            templateUrl: 'partial-test.html'
        })

        .state('test.new', {
            url: '/new',
            templateUrl: 'partial-new-test.html',
            controller: setupTestCtrl,
            resolve: {
                subjectsList: function (subjectService) {
                    var list = subjectService.getList();
                    return list;
                }
            }
        })

        .state('test.take', {
            url: '/take',
            templateUrl: "partial-take-test.html",
            controller: takeTestCtrl,
            params: { testParams: null },
            resolve: {
                questionList: function (questionService) {
                    var list = questionService.getList();
                    return list;
                }
            }
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
                },
                defaultQuestion: function () {
                    return null;
                }
            }
        })

        .state('questions.edit', {
            url: '/edit/:id',
            templateUrl: 'partial-new-question.html',
            controller: newQuestionCtrl,
            resolve: {
                subjectsList: function (subjectService) {
                    var list = subjectService.getList();
                    return list;
                },
                defaultQuestion: function ($stateParams, questionService) {
                    return questionService.get($stateParams.id);
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

function setupTestCtrl($scope, subjectsList) {
    $scope.subjects = subjectsList;

    $scope.params = {
        numQuestions: 0,
        randomOrder: true,
        subject: ''
    };
}

function takeTestCtrl($scope, $stateParams, questionList) {
    testParams = $stateParams.testParams;
    $scope.score = {
        correct: 0,
        answered: 0
    }

    var list = copy(questionList);

    if (testParams.randomOrder) {
        list = randomizeOrder(list);
    }

    if (testParams.subject) {
        list = list.filter(function (question) {
            return question.subject === testParams.subject;
        })
    }

    if (testParams.numQuestions && testParams.numQuestions > 0) {
        list = list.slice(0, testParams.numQuestions);
    }

    $scope.testQuestions = list;

    $scope.solve = function (question, answerIndex) {
        if (question.solved) {
            return;
        }

        question.solved = true;
        question.selected = answerIndex;

        $scope.score.answered++;

        if (question.correct == answerIndex) {
            $scope.score.correct++;
        }
    }
}

function questionListCtrl($scope, $state, questionList, questionService) {
    $scope.questions = questionList;

    $scope.remove = function (id) {
        questionService.remove(id);
        location.reload();
    }

    $scope.edit = function (id) {
        $state.go('questions.edit', { 'id': id });
    }
}

function subjectListCtrl($scope, subjectList, subjectService) {
    $scope.subjects = subjectList;

    $scope.remove = function (subject) {
        subjectService.remove(subject);
        location.reload();
    }
}

function newQuestionCtrl($scope, questionService, subjectsList, defaultQuestion) {

    var emptyQuestion = {
        'id': questionService.getNextId(),
        'question': '',
        'subject': '',
        'correct': -1,
        'answers': ['']
    };

    if (defaultQuestion == null) {
        defaultQuestion = emptyQuestion;
    }

    $scope.subjects = subjectsList;
    $scope.newQuestion = copy(defaultQuestion);
    $scope.validationError = false;

    $scope.addAnswer = function () {
        $scope.newQuestion.answers.push('');
    }

    $scope.save = function () {
        if (!validate()) {
            $scope.validationError = true;
        } else {
            questionService.save($scope.newQuestion);
            $scope.newQuestion = copy(emptyQuestion);
            $scope.newQuestion.id = questionService.getNextId();
            $scope.validationError = false;
        }
    }

    function validate() {
        return $scope.newQuestion.question !== '' && $scope.newQuestion.correct > -1 && $scope.newQuestion.answers.join('') != '';
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

function randomizeOrder(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

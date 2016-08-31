(function (window, angular, _, undefined) {

	'use strict';

	angular.module('study-helper').factory('questionService', questionService);

	function questionService() {


		var KEY = "QUESTION_LIST";
		var ID_KEY = "ID_KEY";

		return {
			getList: getList,
			save: save,
			getNextId: getNextId,
			remove: remove
		};

		function getNextId() {
			var str = localStorage.getItem(ID_KEY) || "0";
			var int = parseInt(str);
			localStorage.setItem(ID_KEY, (int + 1) + "");
			return int;
		}

		function getList() {
			var stringList = localStorage.getItem(KEY) || "[]";
			return JSON.parse(localStorage.getItem(KEY));
		}

		function remove(id) {
			var list = getList() || [];

			var filteredList = list.filter(function (question) {
				return question.id !== id;
			});

			localStorage.setItem(KEY, JSON.stringify(filteredList));
		}

		function save(question) {
			var list = getList() || [];
			list.push(question);

			var filteredList = list.filter(function (question) {
				return question.question !== '';
			});

			localStorage.setItem(KEY, JSON.stringify(list));
		}
	}

} (window, window.angular, window._));
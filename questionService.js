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
			remove: remove,
			get: get
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

		function get(id) {
			var list = getList();
			return list.find(function (element) {
				return element.id == id;
			});
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
			var index = indexById(list, question.id);

			if (index > -1) {
				list[index] = question;
			} else {
				list.push(question);
			}

			var filteredList = list.filter(function (question) {
				return question.question !== '';
			});

			localStorage.setItem(KEY, JSON.stringify(list));
		}

		function indexById(list, id) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].id == id) {
					return i;
				}
			}
			return -1;
		}
	}

} (window, window.angular, window._));
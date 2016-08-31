(function (window, angular, _, undefined) {

	'use strict';

	angular.module('study-helper').factory('subjectService', subjectService);

	function subjectService() {


		var KEY = "SUBJECT_LIST";

		return {
			getList: getList,
			save: save,
			remove: remove
		};

		function getList() {
			var stringList = localStorage.getItem(KEY) || '[]';
			return JSON.parse(stringList);
		}

		function remove(subject) {
			var list = getList() || [];
            var index = list.indexOf(subject);
            if (index != -1) {
                list.splice(index, 1);
            }
			localStorage.setItem(KEY, JSON.stringify(list));
		}

		function save(subject) {
			var list = getList() || [];
			if (list.indexOf(subject) === -1) {
				list.push(subject);

				var filteredList = list.filter(function (sub) {
					return sub !== '';
				});

				localStorage.setItem(KEY, JSON.stringify(list));
			}
		}
	}

} (window, window.angular, window._));
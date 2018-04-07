'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URL = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";

var Users = function () {
	function Users() {
		_classCallCheck(this, Users);

		this._users = [];
	}

	_createClass(Users, [{
		key: 'setUsers',
		value: function setUsers(users) {
			this._users = users;
		}
	}, {
		key: 'getUsers',
		value: function getUsers() {
			return this._users;
		}
	}, {
		key: 'findUserById',
		value: function findUserById(userId) {
			return this._users.filter(function (user) {
				return user.id === userId;
			})[0];
		}
	}, {
		key: 'sortBy',
		value: function sortBy(type, order) {
			if (order === 'A-Z') {
				this._users.sort(function (a, b) {
					if (a[type] > b[type]) {
						return 1;
					}
				});
			} else if (order === 'Z-A') {
				this._users.sort(function (a, b) {
					if (a[type] < b[type]) {
						return 1;
					}
				});
			}
		}
	}]);

	return Users;
}();

var App = function () {
	function App() {
		_classCallCheck(this, App);
	}

	_createClass(App, [{
		key: 'init',
		value: function init() {
			var _this = this;

			this.users = new Users();

			this._initViews();
			this._getData().then(function (users) {
				return _this._convertUsers(users);
			}).then(this.users.setUsers.bind(this.users)).then(this._drawUsersList.bind(this));
		}
	}, {
		key: '_initViews',
		value: function _initViews() {
			var _this2 = this;

			//сортировка
			this.sortNameEl = document.getElementById('sort-name');
			this.sortOrderEl = document.getElementById('sort-order');
			this.sortNameEl.addEventListener('change', this._onSortChanged.bind(this));
			this.sortOrderEl.addEventListener('change', this._onSortChanged.bind(this));

			// попап
			this.blockscreenEl = document.getElementById('blockscreen');
			this.blockscreenEl.addEventListener('click', function (event) {
				if (event.currentTarget === event.target) {
					event.target.classList.remove('active');
					_this2._scrollBodyOn();
				}
			});

			// контейнер
			this.usersListContainer = document.getElementById('list');
			this.usersListContainer.addEventListener('click', function (event) {
				var target = event.target;

				// цикл двигается вверх от target к родителям до list
				while (target != _this2.usersListContainer) {
					if (target.id == 'user_card') {
						// нашли элемент, который нас интересует!
						_this2._onUserClick(target.dataset.id);
						return;
					}
					target = target.parentNode;
				}
			});
		}
	}, {
		key: '_getData',
		value: function _getData() {
			return fetch(URL).then(function (data) {
				return data.json();
			}).then(function (data) {
				return data.results;
			}).catch(function (error) {
				alert(error);
			});
		}
	}, {
		key: '_getSelectedValue',
		value: function _getSelectedValue(select) {
			return select.options[select.selectedIndex].value;
		}
	}, {
		key: '_convertUsers',
		value: function _convertUsers(users) {
			return users.map(function (user, index) {
				return {
					id: index,
					avatarMedium: user.picture.medium,
					avatarLarge: user.picture.large,
					title: user.name.title,
					firstName: user.name.first,
					lastName: user.name.last,
					street: user.location.street,
					city: user.location.city,
					state: user.location.state,
					postcode: user.location.postcode,
					email: user.email,
					phone: user.phone
				};
			});
		}
	}, {
		key: '_drawUsersList',
		value: function _drawUsersList() {
			var _this3 = this;

			var result = '';

			this.users.getUsers().forEach(function (user) {
				result += _this3._getUsersItemTemplate(user);
			});

			this.usersListContainer.innerHTML = result;
		}
	}, {
		key: '_getUsersItemTemplate',
		value: function _getUsersItemTemplate(user) {
			return '<div id="user_card" data-id="' + user.id + '" class="shadow">\n\t\t\t\t<img src="' + user.avatarMedium + '"/></td>\n\t\t\t\t<span>' + user.title + '. ' + user.firstName + ' ' + user.lastName + '</span>\n\t\t\t</div>';
		}
	}, {
		key: '_getBlockscreenTemplate',
		value: function _getBlockscreenTemplate(user) {
			return '<div class="shadow" id="info">\n\t\t\t<h1 id="username">' + user.title + '. ' + user.firstName + ' ' + user.lastName + '</h1>\n\t\t\t<img id="photo" src="' + user.avatarLarge + '">\n\t\t\t<div>\n\t\t\t\t<span id="address"><b>Address:</b> ' + user.postcode + ', ' + user.state + ', ' + user.city + ', ' + user.street + '</span><br>\n\t\t\t\t<span id="conacts"><b>Contacts:</b> ' + user.phone + ', ' + user.email + '</span>\n\t\t\t</div>\n\t\t</div>';
		}
	}, {
		key: '_onUserClick',
		value: function _onUserClick(userId) {
			var clickedUser = this.users.findUserById(+userId);
			this.blockscreenEl.innerHTML = this._getBlockscreenTemplate(clickedUser);
			this.blockscreenEl.classList.add('active');
			var body = document.getElementsByTagName("body")[0];
			body.setAttribute("style", "overflow: hidden");
		}
	}, {
		key: '_onSortChanged',
		value: function _onSortChanged() {
			this.users.sortBy(this._getSelectedValue(this.sortNameEl), this._getSelectedValue(this.sortOrderEl));
			this._drawUsersList();
		}
	}, {
		key: '_scrollBodyOn',
		value: function _scrollBodyOn() {
			var body = document.getElementsByTagName("body")[0];
			body.removeAttribute("style", "overflow: hidden");
		}
	}]);

	return App;
}();

var app = new App();

window.addEventListener('load', app.init.bind(app));
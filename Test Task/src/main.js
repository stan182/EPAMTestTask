const URL = "https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture";

class Users {
	constructor() {
		this._users = [];
	}

	setUsers(users) {
		this._users = users;
	}

	getUsers() {
		return this._users
	}

	findUserById(userId) {
		return this._users.filter((user) => user.id === userId)[0];
	}

	sortBy(type, order) {
		if (order === 'A-Z') {
			this._users.sort((a,b) => {
				if (a[type] > b[type]) {
					return 1;
				}
			});
		} else if (order === 'Z-A') {
			this._users.sort((a,b) => {
				if (a[type] < b[type]) {
					return 1;
				}
			});
		}
	}
}

class App {
	init() {
		this.users = new Users();

		this._initViews();
		this._getData()
			.then(users => this._convertUsers(users))
			.then(this.users.setUsers.bind(this.users))
			.then(this._drawUsersList.bind(this));
	}

	_initViews() {
		//сортировка
		this.sortNameEl = document.getElementById('sort-name');
		this.sortOrderEl = document.getElementById('sort-order');
		this.sortNameEl.addEventListener('change', this._onSortChanged.bind(this));
		this.sortOrderEl.addEventListener('change', this._onSortChanged.bind(this));


		// попап
		this.blockscreenEl = document.getElementById('blockscreen');
		this.blockscreenEl.addEventListener('click', (event) => {
			if (event.currentTarget === event.target) {
				event.target.classList.remove('active');
                this._scrollBodyOn();
			}
		});

		// контейнер
		this.usersListContainer = document.getElementById('list');
		this.usersListContainer.addEventListener('click', (event) => {
			var target = event.target;

			// цикл двигается вверх от target к родителям до list
			while (target != this.usersListContainer) {
				if (target.id == 'user_card') {
					// нашли элемент, который нас интересует!
					this._onUserClick(target.dataset.id);
					return;
				}
				target = target.parentNode;
			}
		});
	}

	_getData() {
		return fetch(URL)
			.then(data => data.json())
			.then((data) => data.results)
			.catch((error) => {alert(error)});
	}

	_getSelectedValue(select) {
		return select.options[select.selectedIndex].value;
	}

	_convertUsers(users) {
		return users.map((user, index) => {
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
				phone: user.phone,
			};
		})
	}

	_drawUsersList() {
		let result = '';

		this.users.getUsers().forEach((user) => {
			result += this._getUsersItemTemplate(user);
		});

		this.usersListContainer.innerHTML = result;
	}

	_getUsersItemTemplate(user) {
		return `<div id="user_card" data-id="${user.id}" class="shadow">
				<img src="${user.avatarMedium}"/></td>
				<span>${user.title}. ${user.firstName} ${user.lastName}</span>
			</div>`;
	}

	_getBlockscreenTemplate(user) {
		return `<div class="shadow" id="info">
			<h1 id="username">${user.title}. ${user.firstName} ${user.lastName}</h1>
			<img id="photo" src="${user.avatarLarge}">
			<div>
				<span id="address"><b>Address:</b> ${user.postcode}, ${user.state}, ${user.city}, ${user.street}</span><br>
				<span id="conacts"><b>Contacts:</b> ${user.phone}, ${user.email}</span>
			</div>
		</div>`;
	}

	_onUserClick(userId) {
		const clickedUser = this.users.findUserById(+userId);
		this.blockscreenEl.innerHTML = this._getBlockscreenTemplate(clickedUser);
		this.blockscreenEl.classList.add('active');
		const body = document.getElementsByTagName("body")[0];
		body.setAttribute("style", "overflow: hidden");
	}

	_onSortChanged() {
		this.users.sortBy(this._getSelectedValue(this.sortNameEl), this._getSelectedValue(this.sortOrderEl));
		this._drawUsersList();
	}

	_scrollBodyOn() {
        const body = document.getElementsByTagName("body")[0];
        body.removeAttribute("style", "overflow: hidden");
	}
}

const app = new App();

window.addEventListener('load', app.init.bind(app));
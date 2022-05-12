window.addEventListener('DOMContentLoaded', () => {

	// Tabs
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}
	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	//Timer

	const deadline = '2022-05-09';

	function getTimeRemaining(endtime) {
		let days, hours, minutes, seconds;
		const t = Date.parse(endtime) - Date.parse(new Date());

		if (t <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			days = Math.floor(t / (1000 * 60 * 60 * 24));
			hours = Math.floor((t / (1000 * 60 * 60) % 24)); // остаток от деления на 24 покажет часы
			minutes = Math.floor((t / 1000 / 60) % 60);
			seconds = Math.floor((t / 1000) % 60);
		}

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) { // подставляем 0 в число если оно менее 10
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}
	setClock('.timer', deadline);

	//Modal window

	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');
	// modalCloseBtn = document.querySelector('[data-close]');

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden'; // позволяет не прокручивать окно позади модалки
		clearInterval(modalTimerId); // сбрасывает таймер модала если окно было открыто раньше таймера
	}
	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});



	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	// modalCloseBtn.addEventListener('click', closeModal); 

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) { // работает только когда окно открыто
			closeModal();
		}
	});

	const modalTimerId = setTimeout(openModal, 500000);

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll); // удаляет событие после первого появления
		}
	}

	window.addEventListener('scroll', showModalByScroll);

	// Menu Cards

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes; // массив
			this.parent = document.querySelector(parentSelector);
			this.transfer = 29.25;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = this.price * this.transfer;
		}
		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className)); // добавляем класс аргументом
			}

			element.innerHTML = `
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.descr}}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
					</div>
		`;
			this.parent.append(element);
		}
	}

	const getResource = async (url) => { // async говорит что внутри функции будет асинхронный код
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Couldn't fetch ${url}, status: ${res.status}`); // выкидываем ошибку вручную если запрос не будет выполнен
		}
		
		return await res.json(); // promise, await + async required
	};

	// getResource('http://localhost:3000/menu')
	// .then(data => { // массив с обьектами
	// 	data.forEach(({img, altimg, title, descr, price}) => {
	// 		new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
	// 	});
	// });

	getResource('http://localhost:3000/menu')
		.then(data => createCard(data));

	function createCard(data) {
		data.forEach(({img, altimg, title, descr, price}) => {
			const element = document.createElement('div');
			price *= 29.25;
			element.classList.add('menu__item');

			element.innerHTML = `
				<img src=${img} alt=${altimg}>
				<h3 class="menu__item-subtitle">${title}</h3>
				<div class="menu__item-descr">${descr}}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${price}</span> грн/день</div>
				</div>
			`;
			document.querySelector('.menu . container').append(element);
		});
	}

	// new MenuCard(
	// 	"img/tabs/vegy.jpg",
	// 	"vegy",
	// 	'Меню "Фитнес"',
	// 	'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
	// 	9,
	// 	'.menu .container',
	// 	// '.menu__item'
	// ).render();
	// new MenuCard(
	// 	"img/tabs/elite.jpg",
	// 	"elite",
	// 	'Меню “Премиум”',
	// 	'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
	// 	14,
	// 	'.menu .container',
	// 	// '.menu__item'
	// ).render();
	// new MenuCard(
	// 	"img/tabs/post.jpg",
	// 	"post",
	// 	'Меню "Постное"',
	// 	'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
	// 	21,
	// 	'.menu .container',
	// 	// '.menu__item'
	// ).render();

	// Forms

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо, скоро мы с Вами свяжемся',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {
		bindPostData(item);
	});

	const postData = async (url, data) => { // async говорит что внутри функции будет асинхронный код
		const res = await fetch(url, { // fetch возвращает promise, await дожидается выполнения запроса
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});
		return await res.json(); // promise, await + async required
	};

	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault(); // отменяем перезагрузку страницы

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading; // спиннер загрузки
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			// form.append(statusMessage);
			form.insertAdjacentElement('afterend', statusMessage);

			// const request = new XMLHttpRequest();
			// request.open('POST', 'server.php');



			// request.setRequestHeader('Content-type', 'application/json');
			const formData = new FormData(form);
			// const object = {};

			// formData.forEach(function (value, key) {
			// 	object[key] = value;
			// });
			const json = JSON.stringify(Object.fromEntries(formData.entries())); // превращаем нашу форму в массив массивов, после этого - в обьект, а после - в json

			postData('http://localhost:3000/requests', json)
			// .then(data => data.text()) // получаем ответ от сервера в текстово формате
			.then(data => {
				console.log(data);
				showThanksModal(message.success);
				

				statusMessage.remove(); // через 3 секунды убираем сообщение о статусе
			}).catch(() => {
				showThanksModal(message.failure);
			}).finally(() => {
				form.reset(); // сбрасываем данные из формы
			});

			// request.send(json); // отправляем форму

			// request.addEventListener('load', () => {
			// 	if (request.status === 200) {
			// 		console.log(request.response);
			// 		showThanksModal(message.success);
			// 		form.reset(); // сбрасываем данные из формы

			// 		statusMessage.remove(); // через 3 секунды убираем сообщение о статусе

			// 	} else {
			// 		showThanksModal(message.failure);
			// 	}
			// });
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);

		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 5000);
	}

	fetch('http://localhost:3000/menu')
	.then(data => data.json())
	.then(res => console.log(res));

});
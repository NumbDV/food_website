import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {
    // Forms

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с Вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });



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
        openModal('.modal', modalTimerId);

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
            closeModal('.modal');
        }, 5000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json());
        // .then(res => console.log(res)); 
}

export default forms;
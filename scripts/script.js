'use strict';

const headerCityButton = document.querySelector('.header__city-button');

let hash = location.hash.substring(1); //обрезаем элемент #

headerCityButton.textContent = localStorage.getItem('lamoda-location') || 'Ваш Город?';

headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите Ваш город ');
    headerCityButton.textContent = city;
    localStorage.setItem('lamoda-location', city);
});

// блокировка скрола (копипаста - пригодится)

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;

    //document.body.style.overflow = 'hidden'; //cssText
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
};

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    })
};

//модальное окно

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModelOpen = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModelClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
};



// запрос базы данных

const getData = async () => {
    const data = await fetch('db.json'); // await не будет выполнять присваивание , пока fetch не пришлет овтет

    if (data.ok) {
        return data.json();
    } else {
        throw new Error (`Данные небыли получены, ошибка ${data.status} ${data.statusText}`);
    }
}; //получение данные

const getGoods = (callback, value) => {
    getData()
        .then(data => {                    //then обрабытывает метод который содержится в promise и вызывает callback функцию, когда getData отработает
            if (value) {
                callback(data.filter(item => item.category === value))
            } else {         
            callback(data);
            }
        })
        .catch(err => {                         //отлавливает ошибки
            console.error(err);
        });
}; // обработали

// getGoods((data) => {
//     console.warn(data);
// }); // попробовали, вызвали


subheaderCart.addEventListener('click', cartModelOpen);

cartOverlay.addEventListener('click', event => {
     const target = event.target;

    if (target.classList.contains('cart__btn-close') || target.matches('.cart-overlay')) {
        cartModelClose(); //два варианта способа определения classList.contains и matches
    }
});

//Вывод товаров на страницу

try {

    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page';
    }

    const createCard = ({id, preview, cost, brand, name, sizes}) /*вариант нр.3 или data необходим, для варианта 1 и 2*/ => {

        //const {id, preview, cost, brand, name, sizes} = data; // вариант нр.2 объявления параметров

        // const id = data.id; // вариант нр.1 объявление параметров
        // const preview = data.preview;
        // const cost = data.cost;
        // const brand = data.brand;
        // const name = data.name;
        // const sizes = data.sizes;

        const li = document.createElement('li');
        li.classList.add('goods__item');
        
        li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#${id}">
                    <img class="good__img" src="goods-image/${preview}" alt="">
                </a>
                 <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                    
                    ${sizes ? // исклюбчение на товары, где нет какого либо (размеры) параметра
                    `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
                    ''} 

                    <a class="good__link" href="card-good.html#${id}>Подробнее</a>
                </div>
            </article>
        `;

        return li;
    };

    const renderGoodsList = data => {
        goodsList.textContent = '';

        // for (let i = 0; i <data.length; i++) {
        //      console.log('for: ', data[i]);
        // } // циел перебора всего массива через for

        // for (const item of data) {
        //     console.log('for of: ', item);
        // } // циел перебора всего массива через for of

        // data.forEach((item, i, arr) => {
        //     console.log('forEach: ', item);
        //     console.log(i); // индекс
        //     console.log(arr); // сам массив
        // }); // функция запускает колл бэк функцияю, столько элементов в массиве

        data.forEach((item) => {
            const card = createCard(item);
            goodsList.append(card);
        });

    };

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, hash);
    })

    getGoods(renderGoodsList, hash);

} catch (err) {
    console.warn(err);
}
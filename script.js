// Esse tipo de comentário que estão antes de todas as funções são chamados de JSdoc,
// experimente passar o mouse sobre o nome das funções e verá que elas possuem descrições! 
// Fique a vontade para modificar o código já escrito e criar suas próprias funções!

// const getSavedCartItems = require("./helpers/getSavedCartItems");

// const saveCartItems = require("./helpers/saveCartItems");

/**
 * Função responsável por criar e retornar o elemento de imagem do produto.
 * @param {string} imageSource - URL da imagem.
 * @returns {Element} Elemento de imagem do produto.
 */
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

/**
 * Função responsável por criar e retornar qualquer elemento.
 * @param {string} element - Nome do elemento a ser criado.
 * @param {string} className - Classe do elemento.
 * @param {string} innerText - Texto do elemento.
 * @returns {Element} Elemento criado.
 */
const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

/**
 * Função responsável por criar e retornar o elemento do produto.
 * @param {Object} product - Objeto do produto. 
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.thumbnail - URL da imagem do produto.
 * @returns {Element} Elemento de produto.
 */
const createProductItemElement = ({ id, title, thumbnail, price }) => {
  const section = document.createElement('section');
  section.className = 'item';
  const priceFormated = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  .format(price);
  section.appendChild(createCustomElement('span', 'item_id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('span', 'item__price', priceFormated));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};
const createProductList = async () => {
  const sectionItens = document.querySelector('.items');
  const fetch = await fetchProducts('computador');
  const listProducts = fetch.results;
  listProducts.forEach((element) => {
    const item = createProductItemElement(element);
    sectionItens.appendChild(item);
  });
};

/**
 * Função que recupera o ID do produto passado como parâmetro.
 * @param {Element} product - Elemento do produto.
 * @returns {string} ID do produto.
 */
const getIdFromProductItem = (product) => product.querySelector('span.item_id').innerText;

/**
 * Função responsável por criar e retornar um item do carrinho.
 * @param {Object} product - Objeto do produto.
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.price - Preço do produto.
 * @returns {Element} Elemento de um item do carrinho.
 */
 const cartItensArray = [];
 const addLocalStorage = (id) => {
  cartItensArray.push(id);
   const save = JSON.stringify(cartItensArray);
   saveCartItems(save);
 };
 const removeLocalStorage = (id) => {
   const index = cartItensArray.indexOf(id);
   cartItensArray.splice(index, 1);
   const save = JSON.stringify(cartItensArray);
   saveCartItems(save);
 };
 const cartItemClickListener = (itemCLick) => {
  const cartItens = document.querySelector('.cart__items');
  cartItens.removeChild(itemCLick.target);
  // console.log(itemCLick.target.id);
  removeLocalStorage(itemCLick.target.id);
 };
const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id;
  addLocalStorage(id);
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};
const cartItem = document.querySelector('.cart__items');
const addCart = async () => {
  await createProductList();
  const addCartBtn = document.querySelectorAll('.item__add');
  addCartBtn.forEach((element) => {
    element.addEventListener('click', async (btn) => {
      const idTarget = btn.target.parentNode.firstChild;
      const itemInfo = await fetchItem(idTarget.innerText);
      cartItem.appendChild(createCartItemElement(itemInfo));
    });
  });
};
const restoreLocalStorage = async () => {
  const save = getSavedCartItems();
  const saveArray = JSON.parse(save);
  saveArray.forEach(async (element) => {
    const item = await fetchItem(element);
    cartItem.appendChild(createCartItemElement(item));
  });
};
window.onload = () => {
  addCart();
  restoreLocalStorage();
};

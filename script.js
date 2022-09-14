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
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('span', 'item__title', title));
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
 const updatePrice = (valor) => {
  const totalPrice = document.querySelector('.total-price');
  const subPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  .format(valor);
  totalPrice.innerText = `Subtotal ${subPrice}`;
  // totalPrice.innerText = valor;
};
let soma = 0;
const sum = (valor) => {
  soma += valor;
  updatePrice(soma);
};
const subtraction = (valor) => {
  soma -= valor;
  updatePrice(soma);
};

 let cartItensArray = [];

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
//  const items = [];
// const storageCart = (item) => {
//   items.push(item);
//   const save = JSON.stringify(items);
//    saveCartItems(save);
// };
// const removeCart = (item) => {
//   console.log(item);
//   const index = items.indexOf(item);
//   items.splice(index, 1);
//   const save = JSON.stringify(items);
//   saveCartItems(save);
// };
 const cartItemClickListener = (itemCLick) => {
  const cartItens = document.querySelector('.cart__items');
  cartItens.removeChild(itemCLick.target);
  const price = parseFloat(itemCLick.target.classList.item(1));
  removeLocalStorage(itemCLick.target.id);
  // removeCart(itemCLick.target.innerHTML);
  subtraction(parseFloat(price));
 };
const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id;
  li.classList.add(price);
  sum(price);
  addLocalStorage(id);
  const priceFormated = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  .format(price);
  li.innerText = `${title}\n 
  ${priceFormated}`;
  // storageCart(li.innerHTML);
  li.addEventListener('click', cartItemClickListener);
  return li;
};
const loading = () => {
  const itemsHtml = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'loading';
  section.innerText = 'carregando...';
  itemsHtml.appendChild(section);
};
const cartItem = document.querySelector('.cart__items');
const addCart = async () => {
  loading();
  await createProductList();
  const addCartBtn = document.querySelectorAll('.item__add');
  addCartBtn.forEach((element) => {
    element.addEventListener('click', async (btn) => {
      const idTarget = btn.target.parentNode.firstChild;
      const itemInfo = await fetchItem(idTarget.innerText);
      cartItem.appendChild(createCartItemElement(itemInfo))
      .appendChild(createProductImageElement(itemInfo.thumbnail));
    });
  });
  document.querySelector('.loading').remove();
};
const restoreLocalStorage = async () => {
  const save = getSavedCartItems();
  const fetchlist = await fetchProducts('computador');
  const arrayfech = fetchlist.results;
  const saveArray = JSON.parse(save);
  if (saveArray) {
  saveArray.forEach((elementId) => {
    const item2 = arrayfech.find((element) => element.id === elementId);
    cartItem.appendChild(createCartItemElement(item2))
    .appendChild(createProductImageElement(item2.thumbnail));
  });
}
};

const totalPrice = () => {
  const getLocal = document.querySelector('.empty-cart');
  const getcart = document.querySelector('.cart');
  const priceElement = document.createElement('p');
  priceElement.className = 'total-price';
  getcart.insertBefore(priceElement, getLocal);
};
const cleanCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    cartItem.innerHTML = '';
    const saveEmpty = JSON.stringify([]);
    saveCartItems(saveEmpty);
    soma = 0;
    updatePrice(0);
    cartItensArray = [];
  });
};

// const restoreCart = () => {
//   const save = getSavedCartItems();
//   const saveArray = JSON.parse(save);
//   console.log(saveArray);
//   if (saveArray) {
//     saveArray.forEach((elementId) => {
//       const li = document.createElement('li');
//       li.className = 'cart__item';
//       li.innerHTML = elementId;
//       li.addEventListener('click', cartItemClickListener);
//       cartItem.appendChild(li);
//     });
//   }
// };
window.onload = () => {
  addCart();
  totalPrice();
  cleanCart();
  restoreLocalStorage();
  // restoreCart();
};
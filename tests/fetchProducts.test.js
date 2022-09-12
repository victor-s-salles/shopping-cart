require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fetchProducts', () => {
  it('Testa se fetchItem é uma função', () => {
    expect(typeof fetchProducts).toBe('function')
  })
  it('Testa a função fetchProducts com o argumento computador', async () => {
    await fetchProducts('computador')
    expect(fetch).toHaveBeenCalled();
  })
  it('Teste se, ao chamar a função fetchProducts com o argumento computador, a função fetch utiliza o endpoint', async () =>{
    expectedUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    await fetchProducts('computador')
    expect(fetch).toBeCalledWith(expectedUrl);
  })
  it('Teste se o retorno da função fetchProducts com o argumento computador é uma estrutura de dados igual ao objeto computadorSearch', async () =>{
    expect(typeof await fetchProducts('computador')).toEqual(typeof computadorSearch);
  })
  it('Teste se, ao chamar a função fetchProducts sem argumento, retorna um erro com a mensagem: You must provide an url', async () => {
    try {
      await fetchProducts();
    }catch(error){
      expect(error).toEqual(new Error('You must provide an url'))
    }
  })
});

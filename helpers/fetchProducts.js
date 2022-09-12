const fetchProducts = async (key) => {
  try {
  if (!key) throw new Error('You must provide an url');
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${key}`;
  const fetchP = await fetch(url);
  const fetchLlist = await fetchP.json();
  return fetchLlist;
  } catch (error) {
    console.log(error);
  }
};
const test = async () => {
  console.log(await fetchProducts('computador'));
};
test();

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}

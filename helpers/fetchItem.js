const fetchItem = async (id) => {
  try {
  const urlItem = `https://api.mercadolibre.com/items/${id}`;
  const fetchJson = await fetch(urlItem);
  const fetchSearch = await fetchJson.json();
  return fetchSearch;
  } catch (error) {
    throw Error('You must provide an url');
  }
};
if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}

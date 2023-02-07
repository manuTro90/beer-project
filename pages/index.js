import { useState, useEffect } from "react";

function HomePage({ data }) {
  const [beersList, setBeers] = useState(data);
  const [page, setPage] = useState(1);
  const [numItem, setNumItem] = useState(25);
  const [modal, showModal] = useState(false);
  const [beerInfo, setBeerInfo] = useState({});

  useEffect(() => {
    fetch(
      "https://api.punkapi.com/v2/beers?page=" + page + "&per_page=" + numItem
    )
      .then((res) => res.json())
      .then((data) => {
        setBeers(data);
      });
  }, [page, numItem]);

  const handleClick = (event, prev) => {
    event.preventDefault();
    prev ? setPage(page - 1) : setPage(page + 1);
  };

  const setModalInfo = (productInfo) => {
    showModal(true);
    setBeerInfo(productInfo);
  };

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div id="main"></div>
      <div className="">
        <select
          value={numItem}
          onChange={(e) => {
            setNumItem(e.target.value);
          }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <div className="inline-flex">
          {page != 1 && (
            <button
              onClick={(e) => handleClick(e, true)}
            >
              Pagina precedente
            </button>
          )}
          <button
            onClick={handleClick}
          >
            Pagina successiva
          </button>
        </div>
      </div>
      <br></br>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {beersList &&
          beersList.map((product) => (
            <div
              key={product.id}
              className="group"
              onClick={() => setModalInfo(product)}
            >
              <div className="aspect-w-1 aspect-h-1 w-32 overflow-hidden rounded-lg  xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={product.image_url}
                  className="object-contain h-48 w-96"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              {/* <p className="mt-1 text-lg font-medium text-gray-900">
                  {product.price}
                </p> */}
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://api.punkapi.com/v2/beers?page=1");
  const data = await res.json();
  return { props: { data } };
}
export default HomePage;

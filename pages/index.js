import { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#main");

function HomePage({ data }) {
  const [beersList, setBeers] = useState(data);
  const [page, setPage] = useState(1);
  const [numItem, setNumItem] = useState(25);
  const [modal, showModal] = useState(false);
  const [beerInfo, setBeerInfo] = useState({});

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      maxWidth: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

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
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              onClick={(e) => handleClick(e, true)}
            >
              Pagina precedente
            </button>
          )}
          <button onClick={handleClick}>Pagina successiva</button>
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
      <Modal
        isOpen={modal}
        onRequestClose={() => showModal(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {beerInfo.name}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="defaultModal"
            onClick={() => showModal(false)}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <br/>
        <div className="flex">
          <div className="flex-1">
            <img
              src={beerInfo.image_url}
              className="object-contain h-48 w-96"
            />
          </div>
          <div className="flex-1">
            <p>{beerInfo.description}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://api.punkapi.com/v2/beers?page=1");
  const data = await res.json();
  return { props: { data } };
}
export default HomePage;

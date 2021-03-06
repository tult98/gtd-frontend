import React, { useState, useEffect, useContext } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import ProductService from '../../services/ProductService';
import ModalCreate from '../CreateWatch/ModalCreate';
import { numberWithCommas, truncate } from '../../utils/Helpers';
import { PlusIcon } from '../Icons';
import Rating from '../Rating';
import AuthUserContext from '../Session/context';
import { NotFound } from '../NotFound';
import LineChart from '../LineChart';

const ProductDetail = (props) => {
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [productData, setProductData] = useState();
  const [loading, setLoading] = useState(true);
  const { authUser } = useContext(AuthUserContext);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [chartData, setChartData] = useState({});

  const handleChartData = (productData) => {
    const { watches } = productData;
    const chartData = {};
    watches.forEach((watch) => {
      if (chartData[watch['expected_price']]) {
        chartData[watch['expected_price']] += 1;
      } else {
        chartData[watch['expected_price']] = 1;
      }
    });
    return chartData;
  };

  useEffect(() => {
    if (productData && props.location.state.name === 'shop-products') {
      const chartData = handleChartData(productData);
      setChartData(chartData);
    }
  }, [productData]);

  useEffect(() => {
    if (props.location.state.name !== 'shop-products') {
      ProductService.getProductDetail(props.match.params.id)
        .then((res) => {
          setProductData(res);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
          setLoading(false);
          if (error.code === 400 && error.errors.product) {
            setMessage(<NotFound />);
          } else {
            setMessage(
              <div className="text-red-500 text-">
                Có lỗi hệ thống, liên hệ với admin ngay!
              </div>
            );
          }
        });
    } else {
      ProductService.shopProductsDetail(props.match.params.id)
        .then((res) => {
          setProductData(res);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
          setLoading(false);
          if (error.code === 400 && error.errors.product) {
            setMessage(<NotFound />);
          } else {
            setMessage(
              <div className="text-red-500 text-">
                Có lỗi hệ thống, liên hệ với admin ngay!
              </div>
            );
          }
        });
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <ClipLoader size={50} />
          <div>Xin chờ...</div>
        </div>
      ) : (
        <>
          {error ? (
            <div className="flex flex-row items-center justify-center w-full h-full">
              {message}
            </div>
          ) : (
            <div className="flex flex-row justify-center w-full">
              <div className="flex flex-col items-center w-screen mt-12 mb-8 md:w-4/5 md:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 product-overview justify-items-center">
                  <div className="w-11/12 item image md:w-auto">
                    <img src={productData.images[0]?.base_url} alt="product" />
                  </div>
                  <div className="w-11/12 col-span-2 px-4 py-4 mt-5 bg-white md:ml-2 overview md:mt-0 md:w-full">
                    <div className="flex text-sm text-gray-600">
                      Nhãn hiệu:{' '}
                      <p className="ml-1 text-blue-500">{` ${productData.brand?.name}`}</p>
                    </div>
                    <p className="text-xl font-light">{productData?.name}</p>
                    <div className="flex flex-row mt-4 rating-section">
                      <Rating rate={productData?.rating_average} />
                    </div>
                    <div className="flex flex-row items-center mt-8 price-section">
                      <p className="text-2xl font-bold">
                        {numberWithCommas(productData?.price)} đ
                      </p>
                      <div className="ml-4 discount-section">
                        <div className="flex flex-row">
                          <p className="text-xs line-through">
                            {numberWithCommas(productData?.list_price)} đ
                          </p>
                          <p className="ml-2 text-xs line-through">{`${productData?.discount_rate}%`}</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex flex-row items-center mt-16 button-section">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `https://tiki.vn/${productData?.url_path}`
                          )
                        }
                        className="px-8 py-2 text-lg font-semibold bg-yellow-300 rounded-lg hover:bg-yellow-400"
                      >
                        Xem tại Tiki
                      </button>
                      {authUser[0] ? (
                        <div
                          className="ml-4 text-red-500 cursor-pointer"
                          onClick={() => setShowModal(true)}
                        >
                          <PlusIcon />
                          <ModalCreate
                            productData={productData}
                            showModal={showModal}
                            setShowModal={setShowModal}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                {props.location.state.name !== 'shop-products' ? (
                  <div className="w-11/12 mt-8 product-description md:w-full">
                    <ShowDescription
                      showAll={showAll}
                      setShowAll={setShowAll}
                      description={productData.description}
                    />
                  </div>
                ) : (
                  <div className="w-11/12 mt-8 bg-white md:w-full">
                    <LineChart chartData={chartData} />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      <header>
        <title>{productData?.name}</title>
      </header>
    </>
  );
};

export const ShowDescription = ({ showAll, setShowAll, description }) => {
  return (
    <>
      <p className="mb-4 text-lg text-black uppercase">Mô tả sản phẩm</p>
      <div className="px-8 py-4 bg-white">
        {showAll ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <div className="flex flex-row justify-center w-full mt-4">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="px-8 py-2 text-blue-500 border border-blue-500 rounded-lg hover:text-white hover:bg-blue-500 focus:outline-none"
              >
                Thu gọn
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: truncate(description, 800) }}
            />
            <div className="flex flex-row justify-center w-full mt-4">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="px-8 py-2 text-blue-500 border border-blue-500 rounded-lg hover:text-white hover:bg-blue-500 focus:outline-none"
              >
                Xem thêm
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetail;

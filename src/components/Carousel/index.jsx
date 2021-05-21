import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import ClipLoader from 'react-spinners/ClipLoader';
import ProductService from '../../services/ProductService';
import ItemCarousel from './ItemCarousel';

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1024: { items: 4 },
};

const ProductCarousel = ({ type }) => {
  const [productItems, setProductItems] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const items = [];

  useEffect(() => {
    if (type === 'popular') {
      ProductService.getPopularProduct({ params: { ordering: '-watch_count' } })
        .then((res) => {
          setError(false);
          setLoading(false);
          setProductItems(res.data);
        })
        .catch((error) => {
          setError(true);
          setLoading(false);
          if (error.errors.code === 4000) {
            setMessage(
              'There is an error in the system. Please contact with the admin'
            );
          }
          setMessage(error.errors.message);
        });
    } else if (type === 'top-drops') {
      ProductService.getTopDropProduct({
        params: { ordering: '-discount_rate' },
      })
        .then((res) => {
          setLoading(false);
          setProductItems(res.data);
        })
        .catch((error) => {
          setError(true);
          setLoading(false);
          if (error.errors.code === 4000) {
            setMessage(
              'There is an error in the system. Please contact with the admin'
            );
          }
          setMessage(error.errors.message);
        });
    }
  }, []);

  productItems.forEach((item) => {
    items.push(<ItemCarousel data={item} />);
  });

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex flex-row justify-center items-center">
          <ClipLoader size={30} />
        </div>
      ) : (
        <>
          {error ? (
            <div>{message}</div>
          ) : (
            <AliceCarousel
              mouseTracking
              items={items}
              responsive={responsive}
              controlsStrategy="responsive"
            />
          )}
        </>
      )}
    </>
  );
};

export default ProductCarousel;

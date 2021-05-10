import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Logout from '../logout';
import defaultAvatar from '../../static/img/default-avatar.png';

const NavigationAuth = ({ authUser, setAuthUser }) => {
  const [isShow, setIsShow] = useState(false);

  const addDefaultSrc = (ev) => {
    ev.target.src = defaultAvatar;
  };

  return (
    <div className="avatarDropdown flex justify-evenly items-center">
      <div className="text-white text-medium mr-4">
        Hello, {authUser.fullname}
      </div>
      <div className="flex flex-col justify-center h-full">
        <div className="flex flex-row items-center">
          <button
            className="avatar h-10 w-10 rounded-full overflow-hidden border-2 border-gray-500 block focus:outline-none"
            type="button"
          >
            <img
              src={authUser.photo_url ? authUser.photo_url : defaultAvatar}
              onError={addDefaultSrc}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
          <button
            type="button"
            onMouseEnter={() => setIsShow(true)}
            // onMouseLeave={() =>
            //   setTimeout(() => {
            //     setIsShow(false);
            //   }, 2000)
            // }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 block ml-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <Logout setAuthUser={setAuthUser} />
        </div>
      </div>

      {isShow ? (
        <div
          className="bg-white rounded-lg py-2 border-2 border-gray-300 absolute top-14 right-8"
          onMouseEnter={() => setIsShow(true)}
          onMouseLeave={() => setIsShow(false)}
        >
          <Link
            to="/popular"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
          >
            Sản phẩm phổ biển
          </Link>
          <Link
            to="/most_drop"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
          >
            Sản phẩm giảm nhiều
          </Link>
          <Link
            to="/watching"
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
          >
            Sản phẩm theo dõi
          </Link>
          <Link
            to={ROUTES.ACCOUNT}
            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500"
          >
            Tài khoản
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default NavigationAuth;

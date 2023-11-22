import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MenuLink from './MenuLink';
import MarketExpansionMenu from './MarketExpansionMenu';
import SearchArea from './SearchArea';
import SuperAdminProfile from '../userProfile/SuperAdminProfile';
import AdminProfile from '../userProfile/AdminProfile';
import { signOut, useSession } from 'next-auth/react';
import NormalUserProfile from '../userProfile/NormalUserProfile';
import getConfig from 'next/config';
import SiteSelection from './SiteSelection';
import CustomerSegmentation from './CustomerSegmentation';
import globalStore from '../../stores/global';
import SiteMonitoring from './SiteMonitoring';
const { publicRuntimeConfig } = getConfig();

const MainMenu = () => {
  const userPermission = globalStore((state) => state.userPermission);
  const setUserPermission = globalStore((state) => state.setUserPermission);
  const { data: session, status } = useSession();
  const [activeOption, setActiveOption] = useState();
  const [isHovering, setIsHovering] = useState();
  const [shoWProfile, setShowProfille] = useState(false);
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    if (status === 'authenticated') {
      getUserData();
    }
  }, []);

  const getUserData = async () => {
    let res = await fetch(publicRuntimeConfig.API_ROOT_URL + 'my/profile/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });

    if (res.ok) {
      let user = await res.json();
      setUserProfile(user);
      let response = await fetch(
        publicRuntimeConfig.API_ROOT_URL + 'my/permission/',
      );
      if (response.ok) {
        setUserPermission(await response.json());
      }
    } else {
      signOut({
        callbackUrl: '/login',
      })
    }
  };

  const showOptions = (option) => {
    if (activeOption !== option) {
      setActiveOption(option);
      setIsHovering(false);
    } else {
      setActiveOption('');
    }
  };

  const handleMouseOver = () => setIsHovering(true);
  const handleMouseOut = () => setIsHovering(false);

  const disablePointer = (e) => {
    document.getElementById('leftMenuBar').style.pointerEvents = 'none';
    setTimeout(() => {
      document.getElementById('leftMenuBar').removeAttribute('style');
    }, 300);
  };

  const checkPermission = (option) => {
    let permission = false;
    if (userPermission) {
      const dataLayer = userPermission[option];
      permission =
        dataLayer.customer_segment ||
        dataLayer.demography ||
        dataLayer.digital_penetration ||
        dataLayer.footfall ||
        dataLayer.infrastructure ||
        dataLayer.poi ||
        dataLayer.socioeconomics;
    }
    return permission;
  };

  return (
    <>
      <div
        className={`shadow-lg fixed top-0 bottom-0 left-0 z-20 flex ${
          isHovering ? 'expand' : ''
        }`}
      >
        <div
          id="leftMenuBar"
          className="menuBar"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={disablePointer}
        >
          <div>
            <div className="h-16">
              {!isHovering ? (
                <div className="table px-1 pt-5 ml-1 text-center">
                  <span className="text-xl 2xl:text-2xl icon-search"></span>
                </div>
              ) : (
                <div className="px-2 pt-3">
                  <div className="relative">
                    <SearchArea className={''} />
                  </div>
                </div>
              )}
            </div>

            <ul className="mainMenu">
              {checkPermission('macro_trends') && (
                <li onClick={() => showOptions('Macro Trends')}>
                  <MenuLink
                    isActive={activeOption === 'Macro Trends'}
                    iconClass="2xl:text-2xl text-xl icon-groth"
                    label="Macro Trends"
                  />
                </li>
              )}
              {checkPermission('market_expansion') && (
                <li onClick={() => showOptions('Market Expansion')}>
                  <MenuLink
                    isActive={activeOption === 'Market Expansion'}
                    iconClass="2xl:text-2xl text-xl icon-bar-chart"
                    label="Market Expansion"
                  />
                </li>
              )}
              {checkPermission('site_selection') && (
                <li onClick={() => showOptions('Site Selection')}>
                  <MenuLink
                    isActive={activeOption === 'Site Selection'}
                    iconClass="2xl:text-2xl text-xl icon-location"
                    label="Site Selection"
                  />
                </li>
              )}
              {checkPermission('customer_segmentation') && (
                <li onClick={() => showOptions('Customer Segmentation')}>
                  <MenuLink
                    isActive={activeOption === 'Customer Segmentation'}
                    iconClass="2xl:text-2xl text-xl icon-user-group"
                    label="Customer Segmentation"
                  />
                </li>
              )}
              {checkPermission('site_monitoring') && (
                <li onClick={() => showOptions('Site Monitoring')}>
                  <MenuLink
                    isActive={activeOption === 'Site Monitoring'}
                    iconClass="2xl:text-2xl text-xl icon-map"
                    label="Site Monitoring"
                  />
                </li>
              )}
              {checkPermission('demand_sensing') && (
                <li>
                  <MenuLink
                    isActive={activeOption === 'Demand Sensing'}
                    iconClass="2xl:text-2xl text-xl icon-groth-bar"
                    label="Demand Sensing"
                  />
                </li>
              )}
            </ul>
          </div>

          {userProfile && (
            <div className="relative border-2 rounded-full w-9 h-9 border-primary1">
              <Image
                layout="fill"
                src="/images/profilePicture.png"
                alt="Profile"
                onClick={() => setShowProfille(true)}
              />
            </div>
          )}
        </div>
        {activeOption === 'Market Expansion' && (
          <MarketExpansionMenu
            className={isHovering ? 'opacity-0' : 'opacity-100'}
            permission={userPermission.market_expansion}
            close={() => setActiveOption('')}
          />
        )}
        {activeOption === 'Site Selection' && (
          <SiteSelection
            className={isHovering ? 'opacity-0' : 'opaciinputty-100'}
            permission={userPermission.site_selection}
            close={() => setActiveOption('')}
          />
        )}
        {activeOption === 'Customer Segmentation' && (
          <CustomerSegmentation
            className={isHovering ? 'opacity-0' : 'opacity-100'}
            permission={userPermission.customer_segmentation}
            close={() => setActiveOption('')}
          />
        )}
        {activeOption === 'Site Monitoring' && (
          <SiteMonitoring
            className={isHovering ? 'opacity-0' : 'opacity-100'}
            permission={userPermission.site_monitoring}
            close={() => setActiveOption('')}
          />
        )}
      </div>
      {shoWProfile && userProfile.level === 1 && (
        <SuperAdminProfile
          user={userProfile}
          close={() => setShowProfille(false)}
        />
      )}
      {shoWProfile && userProfile.level === 2 && (
        <AdminProfile user={userProfile} close={() => setShowProfille(false)} />
      )}
      {shoWProfile && userProfile.level === 3 && (
        <NormalUserProfile
          user={userProfile}
          close={() => setShowProfille(false)}
        />
      )}
    </>
  );
};

export default MainMenu;

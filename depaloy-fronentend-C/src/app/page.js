"use client";
import Image from "next/image";
import { volkhov } from '../lib/fonts';
import Link from "next/link";
import "./globals.css";
import FashionSlider from '../components/FashionSlider';
import NewArrivals from '../components/NewArrivals';
import FollowUsOnInstagram from '../components/onInstagram';
import FashionCarousel from '../components/carousel';
import Mainbanner from '../components/mainbanner';
import CategoriesSection from '../components/categories';

export default function Home() {


  return (
    <>
    

  <CategoriesSection />
      {/* ////3box img/// */}
        {/* <Mainbanner /> */}
      {/* Other Sections */}
      <FashionSlider />
      {/* <NewArrivals /> */}
      <FollowUsOnInstagram />
      {/* <FollowUsOnInstagram /> */}
      <FashionCarousel />
    </>
  );
}

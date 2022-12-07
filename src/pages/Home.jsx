import React, { useState, useMemo } from "react";

import Layout from "../components/layout/Layout";
import List from "../components/home/List";
import Search from "../components/home/Search";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TopButton from "../components/elements/TopButton";
import ScrollToTop from "../components/elements/ScrollToTop";
import WritingToggle from "../components/elements/WritingToggle";

import PageState from "../components/common/PageState";

import { postApis } from "../api/api-functions/postApis";
import { useQuery } from "@tanstack/react-query";
import useInput from "../hooks/useInput";

// 가이드 모달
import { flexRow } from "../components/styles/Flex";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import guide01 from "../assets/images/banner/guide/guide_01.jpg";
import guide02 from "../assets/images/banner/guide/guide_02.jpg";
import guide03 from "../assets/images/banner/guide/guide_03.jpg";
import guide04 from "../assets/images/banner/guide/guide_04.jpg";
import { useEffect } from "react";

SwiperCore.use([Pagination, Autoplay, Navigation]);
// ------------- 여기까지 ---------------

const Home = () => {

  //배너 가져오기
  const banner = useQuery(['banner'], async () => await postApis.getAdminPostAX(), { cacheTime: 3000, refetchOnWindowFocus: false, retry: 1 })

  //유저 지역정보 가져오기
  const userAddressTag = localStorage.getItem('userAddressTag');
  //client 검색 state
  const [searchState, setSearchState] = useState({
    main: "event",
    tag: userAddressTag !== null && userAddressTag !== 'null' ? [userAddressTag] : [],
    progress: '진행중',
    sort: '최신순',
    search: '',
  });
  //검색어 state
  const [search, setSearch, searchHandle] = useInput({ search: '' });
  //검색어로 검색후 검색어를 지웠을때 처리
  useMemo(() => {
    if (search.search === "") {
      setSearchState({ ...searchState, search: search.search });
    }
  }, [search.search])

  //모달
  const [modalOn, setModalOn] = useState(false);

  // 가이드 모달
  const [guideOn, setGuideOn] = useState(false);
  const guides = [guide01, guide02, guide03, guide04];
  // ------------- 여기까지 ---------------

  return (

    <Layout>
      <StHomeWrap>
        <>
          <ScrollToTop />
          {modalOn && <WritingToggle modalOn={modalOn} setModalOn={setModalOn} />}
          <TopButton modalOn={modalOn} setModalOn={setModalOn} />

          {guideOn && (
            <Bg
              onClick={() => {
                setGuideOn(!guideOn);
              }}
            >
              <StyleGuide onClick={(e) => e.stopPropagation()}>
                <StyledSwiper
                  className="swipe"
                  spaceBetween={0}
                  slidesPerView={1}
                  scrollbar={{ draggable: true }}
                  // navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 15000, disableOnInteraction: false }}
                  loop={true}
                  centeredSlides={true}
                  style={{ backgroundColor: "transparent" }}
                >
                  {guides?.map((guide, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <ItemDetailImg src={guide} />
                      </SwiperSlide>
                    );
                  })}
                </StyledSwiper>
                {/* StyledSwiper */}

                <button
                  onClick={() => {
                    setGuideOn(!guideOn);
                  }}
                >
                  ✕
                </button>
              </StyleGuide>
            </Bg>
          )}

          {/* ---------- 여기까지 ---------- */}
        </>
        {/* 슬라이드 */}
        <StCarouselWrap>
          <Carousel >
            {!banner.isLoading &&
              banner.data?.data.data.length === 0 ?
              <Carousel.Item>
                <PageState
                  display='flex'
                  state='notFound' imgWidth='25%' height='180px'
                  text='등록된 배너가 없습니다.' />
              </Carousel.Item>
              :
              banner.data?.data.data.map((post) => {
                return (
                  <Carousel.Item key={post.id} onClick={() => {
                    if (post.postLink === "https://이용방법") {
                      setGuideOn(!guideOn);
                    } else {
                      window.open(post.postLink, post.title)
                    }
                  }}>
                    <img style={{ height: "180px" }}
                      className="d-block w-100"
                      src={post.imgLink}
                      alt="First slide"
                    />
                    <Carousel.Caption>
                      <h3>{post.title}</h3>
                    </Carousel.Caption>
                  </Carousel.Item>
                )
              })}
          </Carousel>
        </StCarouselWrap>

        {/* 검색 */}
        <Search searchState={searchState} setSearchState={setSearchState} search={search} searchHandle={searchHandle} />

        {/* 리스트 */}
        <StTabBox>
          <Tabs
            defaultActiveKey="event"
            id="justify-tab-example"
            activeKey={searchState.main}
            onSelect={(key) => setSearchState({ ...searchState, main: key, page: 0 })}
            className="tabs"
            justify
          >
            <Tab eventKey="event" title="행사글" />
            <Tab eventKey="gather" title="모집글" />
            <Tab eventKey="ask" title="질문글" />
          </Tabs>
          {/* 리스트 */}
          <List searchState={searchState} />
          <Deletes />
        </StTabBox>
      </StHomeWrap>
    </Layout >
  );
};

export default Home;

const Deletes = styled.div`
  width: 100%;
`;

const StHomeWrap = styled.div`
  display: ${(props) => props.display};
`;

const StCarouselWrap = styled.div`
  .carousel-indicators [data-bs-target] {
    width: 3px;
    border-radius: 50%;
  }
  /* .carousel a {
    display: none;
  } */
  .carousel-caption {
    right: 0%;
    text-align: inherit;
  }
`;
const StTabBox = styled.div`
  .tabs {
    margin: 0 10px;
  }
  .nav-link {
    color: #adaba9;
    font-weight: bold;
  }
  .nav-link.active {
    color: black;
    font-weight: bold;
  }
  .nav-link.active {
    color: black;
    font-weight: bold;
    border-bottom: 2px solid #3556e1;
  }
`;

/* 배너 모달 버튼 -- 수정할 것 */
const BannerModal = styled.div`
  background-color: red;
  width: 50px;
  height: 50px;
`;

export const StyledSwiper = styled(Swiper)`
  background: red;
  ${flexRow}
  justify-content: center;
  width: 370px;
  /* @media screen and (max-width: 425px)  {
        width: 95%;
        border-radius: 20px;
    } */
`;

const StyleGuide = styled.div`
  ${flexRow}
  justify-content: center;
  width: 300px;
  height: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* @media screen and (min-width: 400px) and (max-width:100vw) {
        width: 400px;
        height: 100%;
        border-radius: 20px;
    } */
  .swipe {
    width: 100%;
  }
`;

const Bg = styled.div`
  ${flexRow}
  z-index: 99;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  right: 0;
  width: 425px;
  background-color: rgba(0, 0, 0, 0.85);
  button {
    z-index: 100;
    display: flex;
    position: fixed;
    /* left: 50%;
    transform: translateX(-50%); */
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    background-color: #ffffffeb;
    justify-content: center;
    border: none;
    /* border-radius: 10px; */
    :hover {
      cursor: pointer;
    }
  }
`;

export const ItemDetailImg = styled.img`
  width: 100%;
  height: 100%;
`;

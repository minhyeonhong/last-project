import React, { useState, useRef, useEffect } from 'react';
import Comment from '../common/Comment';
import KakaoMap from '../common/KakaoMap';
import Carousel from 'react-bootstrap/Carousel';
import { FiSearch } from 'react-icons/fi'
import Form from 'react-bootstrap/Form';
import {
    STLinkTextarea, STTitleInput, ModalWrap, StWrap, STSelect, AllTextarea, StCarouselWrap, STUploadButton, STIng, STIngDiv, STInput, STButton, STButton2, STBox2, StContent, STAddressButton, STEditButton, STImg, SelectWrap, SelTop, SelBottom, STInput2, STInput3, StRadioBox, StSearchBox, STAddressDiv, STDiv, STCountButton
} from '../styles/DetailPost.styled.js'
import { useDispatch } from 'react-redux';
import SearchAddress from '../post/SearchAddress';
import useImgUpload from "../../hooks/useImgUpload";
import { __deletePost, __putPost } from '../../redux/modules/PostSlice2'
import PostScrap from './PostScrap';
import Views from '../../assets/icon/Views.svg'
//성별관련 svg import
import GenderFemale from '../../assets/icon/GenderFemale.svg'
import GenderIntersex from '../../assets/icon/GenderIntersex.svg'
import GenderMale from '../../assets/icon/GenderMale.svg'

const Gather = ({ post, postId, modPost, setmodPost, modPostHandle }) => {

    const dispatch = useDispatch();

    //수정하기
    const [edit, setEdit] = useState(false);
    const toggleEdit = () => { setEdit(!edit); };

    //이미지 업로드 훅
    const [files, fileUrls, uploadHandle, setImgFiles, setImgUrls] = useImgUpload(5, true, 0.5, 1000);

    //기존 프리뷰 지울 state
    const [delImg, setDelImg] = useState([]);
    const imgRef = useRef();

    //submit
    const onSubmitGather = () => {

        if (counter < 1) { return alert('모집인원을 입력하세요') }
        if (modPost.kakaoLink === "") { return alert('연락할 카카오 링크를 입력하세요') }
        if (modPost.sex === "") { return alert('성비를 선택하세요') }
        if (modPost.startAge === "" || modPost.endAge === "") { return alert('연령대를 입력하세요') }
        if (modPost.title === "") { return alert('제목을 입력하세요') }
        if (modPost.content === "") { return alert('내용을 입력하세요') }
        if (modPost.category === "") { return alert('카테고리를 입력하세요') }

        //링크 검사(행사장링크 필수 아님)
        const link = /(http|https):\/\//.test(modPost.postLink)
        if (modPost.postLink !== "") {
            if (link === false) {
                return alert("'http://' 또는 'https://'가 포함된 링크를 입력해주세요.")
            }
        }

        const formData = new FormData();

        if (files.length > 0) {
            files.forEach((file) => {
                formData.append("multipartFile", file);
            })
        } else {
            formData.append("multipartFile", null);
        }
        const detail = modPost.detailAddress === undefined ? "" : modPost.detailAddress

        const obj = {
            category: modPost.category,
            content: modPost.content,
            date: modPost.date,
            endAge: modPost.endAge,
            imgId: delImg.join(),
            kakaoLink: modPost.kakaoLink,
            number: counter,
            postAddress: modPost.postAddress + detail,
            postLink: modPost.postLink,
            sex: modPost.sex,
            startAge: modPost.startAge,
            title: modPost.title,
            postState: modPost.postState,
        }

        formData.append("gatherPostDto", new Blob([JSON.stringify(obj)], { type: "application/json" }));
        dispatch(__putPost({ postId, content: formData }));
    }

    //날짜 제한
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear()
    const today2 = year + '-' + month + '-' + day;

    //성별 관련
    const sex = post.sex === "W" ? ("여") : (post.sex === "M" ? ("남") : ("상관없음"))

    //모집인원 counter 세기
    const [counter, setCounter] = useState(post.number);

    const handleAdd = () => { setCounter(counter + 1); }

    const handleminus = () => {
        if (counter > 0) {
            setCounter(counter - 1)
        }
    }

    useEffect(() => {
        if (post.number !== NaN) {
            setCounter(post.number)
        }
    }, [post.number])

    // 주소 API 팝업창 상태 관리& useState
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const popupPostCode = () => { setIsPopupOpen(!isPopupOpen) }
    const [postAddress, setPostAddress] = useState(post.postAddress)

    //슬라이드 자동으로 넘기는 부분
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    //기존글의 삭제할 이미지
    const delImgHandle = (postImgId) => {
        setDelImg((e) => [...e, postImgId]);
    }

    useEffect(() => {
        if (postAddress !== "") {
            setmodPost({ ...modPost, postAddress })
        }
    }, [postAddress])

    //게시글 삭제하기
    const onGatherDelete = (postId) => {
        dispatch(__deletePost(postId))
    }

    const ingHandle = (e) => {
        if (e.target.checked) {
            setmodPost({ ...modPost, postState: "진행중" });
        } else {
            setmodPost({ ...modPost, postState: "마감" });
        }
    }

    //새로추가한 글 삭제할 이미지
    function deleteNewFile(e) {
        const imgurls = fileUrls.filter((imgUrl, index) => index !== e);
        setImgUrls(imgurls);

        const imgdelete = files.filter((file, index) => index !== e);
        setImgFiles(imgdelete);
    }

    //성별에 맞는 svg 
    const sexSvg = sex === "남" ? GenderMale : (sex === "여" ? GenderFemale : GenderIntersex)
    console.log(post)
    return (
        Object.keys(post).length < 1 ?
            <div>페이지 정보 없음</div>
            :
            <StWrap>

                {
                    edit ?
                        (
                            <div>

                                <h4 style={{ textAlign: "center", marginTop: "18px", marginBottom: "18px" }}>모집글</h4>
                                <STTitleInput style={{ height: "48px", marginBottom: "14px" }} type="text" placeholder="제목" name="title" defaultValue={modPost.title || ""} onChange={modPostHandle} />


                                {/*이미지 올리기*/}
                                <StCarouselWrap>
                                    <Carousel activeIndex={index} onSelect={handleSelect}>

                                        {delImg === "" || modPost.postImgInfo.length - delImg.length > 0 &&
                                            modPost.postImgInfo
                                                .filter((item, i) => delImg.indexOf(item.postImgId) === -1)
                                                .map((imgInfo, i) => {
                                                    return (
                                                        <Carousel.Item key={imgInfo.id}>
                                                            <img style={{ width: "100%", height: "396px", borderRadius: "10px", objectFit: "contain" }}
                                                                className="d-block w-100"
                                                                src={imgInfo.postImgUrl}
                                                                alt={`slide${i + 1}`}
                                                            />
                                                        </Carousel.Item>
                                                    )
                                                })}
                                        {fileUrls && fileUrls.map((imgUrl, i) => {
                                            return (
                                                <Carousel.Item key={i}>
                                                    <img style={{ width: "100%", height: "396px", borderRadius: "10px", objectFit: "contain" }}
                                                        className="d-block w-100"
                                                        src={imgUrl}
                                                        alt={`slide${i + 1}`}
                                                    />
                                                </Carousel.Item>
                                            )
                                        })}
                                    </Carousel>

                                    {modPost.postImgInfo.map((imgInfo, i) => {
                                        return (
                                            imgInfo.postImgId &&
                                            <button style={{ display: delImg.indexOf(imgInfo.postImgId) > -1 ? "none" : "inline-block" }}
                                                onClick={() => delImgHandle(imgInfo.postImgId)} key={i}>
                                                <img style={{ width: '60px', height: '60px' }} src={imgInfo.postImgUrl} />
                                            </button>
                                        )
                                    })}

                                    <STUploadButton onClick={() => { imgRef.current.click() }}>+</STUploadButton>

                                    <label htmlFor="imgFile">
                                        <input
                                            style={{ display: "none" }}
                                            type="file"
                                            id="imgFile"
                                            onChange={uploadHandle}
                                            accept="image/*"
                                            ref={imgRef}
                                            name="imgFile"
                                            multiple />
                                    </label>

                                    {
                                        fileUrls && fileUrls.map((imgUrl, i) => {
                                            return (
                                                <button key={imgUrl} onClick={() => deleteNewFile(index)}>
                                                    <img style={{ width: '60px', height: '60px' }} src={imgUrl} key={i} />
                                                </button>
                                            )
                                        })
                                    }

                                </StCarouselWrap>
                                <div>* '+'버튼 옆에 있는 사진을 클릭하면 삭제됩니다.</div>
                                <AllTextarea style={{ width: "100%", height: "200px", marginTop: "14px", marginBottom: "14px" }} name="content" defaultValue={modPost.content || ""} onChange={modPostHandle} />

                                <SelectWrap>

                                    <div style={{ display: "flex", marginLeft: "10px", marginBottom: "5px" }}>
                                        <div style={{ flex: "1" }}>카테고리</div>
                                        <div style={{ flex: "0.9" }}>만날 날짜</div>
                                    </div>

                                    <SelTop >
                                        <STSelect style={{ width: "50%" }} defaultValue={modPost.category} name="category" onChange={modPostHandle}>
                                            <option value="마라톤">마라톤</option>
                                            <option value="페스티벌">페스티벌</option>
                                            <option value="전시회">전시회</option>
                                            <option value="공연">공연</option>
                                            <option value="기타">기타</option>
                                        </STSelect>
                                        <STInput2 style={{ width: "50%" }} type="date" name="date" defaultValue={modPost.date || ""} onChange={modPostHandle} min={today2} />
                                    </SelTop>

                                    <div style={{ display: "flex", marginLeft: "10px", marginBottom: "5px" }}>
                                        <div style={{ flex: "1" }}>성비관련</div>
                                        <div style={{ flex: "0.9" }}>인원 수</div>
                                    </div>

                                    <SelBottom style={{ marginBottom: "14px" }}>
                                        <STSelect style={{ width: "50%" }} name="sex" defaultValue={modPost.sex} onChange={modPostHandle}>
                                            <option value="NF">성비무관</option>
                                            <option value="M">남</option>
                                            <option value="W">여</option>
                                        </STSelect>
                                        <STDiv style={{ width: "50%", textAlign: "center", display: "flex" }}>
                                            <STCountButton style={{ flex: "0.7" }} onClick={handleAdd}>+</STCountButton>
                                            <div style={{ flex: "1" }}>{counter}</div>
                                            <STCountButton style={{ flex: "0.7", right: "0px" }} onClick={handleminus}>-</STCountButton>
                                        </STDiv>
                                    </SelBottom>
                                    <SelBottom>

                                    </SelBottom>
                                </SelectWrap>

                                <div style={{ marginBottom: "14px" }}>
                                    <label>카카오 링크</label><br />
                                    <STInput3 type="text" name="kakaoLink" defaultValue={modPost.kakaoLink} onChange={modPostHandle} />
                                </div>

                                <div style={{ marginBottom: "14px"}}>
                                    <label>행사장 링크</label><br />
                                    <STLinkTextarea type="text" name="postLink" defaultValue={modPost.postLink} onChange={modPostHandle} />
                                </div>

                                <div>
                                    <div>행사장소</div>
                                    <StSearchBox style={{ background: "#E1E3EC" }} onClick={popupPostCode}>
                                        <button style={{ color: "#8B909F" }}><FiSearch style={{ width: '20px', height: '20px', color: '#424754', marginLeft: "10px", marginRight: "10px" }} />주소검색</button>
                                    </StSearchBox>

                                    {isPopupOpen && (
                                        <ModalWrap onClick={popupPostCode}>
                                            <SearchAddress setPostAddres={setPostAddress} popupPostCode={popupPostCode} />
                                        </ModalWrap>
                                    )}

                                    <div style={{ margin: "0px 20px" }}>
                                        {
                                            modPost.postAddress && (
                                                <>
                                                    <div style={{ display: "flex", marginTop: "14px" }}>
                                                        <STAddressDiv>#{modPost.postAddress.split(' ')[0].length < 2 ? modPost.postAddress.split(' ')[0] : modPost.postAddress.split(' ')[0].substr(0, 2)}</STAddressDiv>
                                                        <STInput style={{ marginLeft: "10px" }}>{modPost.postAddress}</STInput>
                                                    </div>
                                                </>
                                            )}


                                        {
                                            modPost.postAddress !== post.postAddress && <STInput3 style={{ marginBottom: "10px", float: "right", width: "100%", marginTop: "10px" }} type="text" placeholder='상세주소' name="detailAddress" onChange={modPostHandle} />
                                        }

                                        <KakaoMap address={modPost.postAddress} width='100%' height='130px' />
                                    </div>

                                </div>
                                <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                                    <StRadioBox>
                                        <label>{modPost.postState}</label>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            checked={modPost.postState === '진행중' ? true : false}
                                            onChange={ingHandle}
                                        />
                                    </StRadioBox>
                                    <div >
                                        <STEditButton onClick={onSubmitGather}>수정완료</STEditButton>
                                        <STEditButton style={{ background: "#515466", marginRight: "5px" }} onClick={toggleEdit}>취소</STEditButton>
                                    </div>
                                </div>
                            </div>

                        )
                        :
                        (
                            <>
                                <STIng style={{ margin: "14px 0" }}>
                                    <div style={{ display: "flex" }}>
                                        <div>
                                            {post.postState === "진행중" ?
                                                (<STIngDiv><div>{post.postState}</div></STIngDiv>)
                                                :
                                                (<STIngDiv style={{ background: "#727785" }}>{post.postState}</STIngDiv>)
                                            }
                                        </div>
                                        <div>
                                            <STImg>
                                                <div style={{ background: "white", width: "70px", height: "45px" }}>
                                                    <div style={{ margin: "0 5px 0 18px", paddingTop: "10px" }}>
                                                        <img src={Views} style={{ width: "20px", height: "20px", flex: "2", marginRight: "4px" }} />
                                                        {post.viewCount}
                                                    </div>
                                                </div>
                                            </STImg>
                                        </div>

                                    </div>
                                    <div>
                                        <PostScrap style={{ right: "0px" }} bookMarkStatus={post.bookMarkStatus} />
                                    </div>

                                </STIng>

                                <STBox2 style={{ marginBottom: "14px", display: "flex" }}>
                                    <STButton style={{ width: "70px", flex: "2", padding:"0 3px", fontSize:"15px" }}>모집글</STButton>
                                    <STButton style={{ width: "70px", flex: "2", padding:"0 3px", fontSize:"15px"}}>{post.category}</STButton>
                                    <STButton2 style={{ color: "#424754", backgroundColor: "white", width: "208px", flex: "4",padding:"0 3px", fontSize:"15px"}}>약속날짜 | {post.date}</STButton2>
                                </STBox2>
                                <STBox2 style={{ marginBottom: "14px", display: "flex" }}>
                                    <STButton2 style={{ width: "159px", flex: "2", padding:"0 3px", fontSize:"15px" }}>모집인원 | {post.number}명</STButton2>
                                    <STButton2 style={{ width: "67px", flex: "1", padding:"0 3px", fontSize:"15px" }}><img src={sexSvg} /></STButton2>
                                    <STButton2 style={{ width: "162px", flex: "2",padding:"0 3px", fontSize:"15px" }}>나이대 | {post.startAge}~{post.endAge}</STButton2>
                                </STBox2>
                                <STInput >{post.title}</STInput>

                                <div>
                                    <Carousel>
                                        {
                                            post.postImgInfo
                                            && post.postImgInfo.map((img, i) => {
                                                return (
                                                    <Carousel.Item key={img.id + i}>
                                                        <img style={{ width: "100%", height: "396px", objectFit: "contain" }}
                                                            src={img.postImgUrl} />
                                                    </Carousel.Item>)
                                            })
                                        }
                                    </Carousel>
                                </div>
                                <StContent style={{ marginBottom: "14px", padding: "5px", borderRadius:"10px" }} value={post.content || ""} readOnly />

                                <div>카카오 링크</div>
                                <STInput style={{ marginBottom: "14px" }}>{post.kakaoLink}</STInput>

                                <div>행사장 링크</div>
                                <STInput style={{ marginBottom: "14px", minHeight:"40px" }}>{post.postLink}</STInput>

                                {
                                    modPost.postAddress && (
                                        <>
                                            <div>행사장소</div>
                                            <div style={{ marginBottom: "8px", display: "flex" }}>
                                                <STAddressButton style={{ flex: "1" }}>#{modPost.postAddress.split(' ')[0].length < 2 ? modPost.postAddress.split(' ')[0] : modPost.postAddress.split(' ')[0].substr(0, 2)}</STAddressButton>
                                                <STInput style={{ marginLeft: "5px", flex: "4" }}>{post.postAddress}</STInput>
                                            </div>
                                        </>
                                    )
                                }

                                <KakaoMap address={post.postAddress} width='100%' height='144px' />


                                {localStorage.getItem('userId') === post.userId.toString() &&
                                    (<div style={{ float: "right", marginTop: "10px" }}>
                                        <STEditButton onClick={toggleEdit}>수정</STEditButton>
                                        <STEditButton style={{ background: "#515466", marginRight: "5px" }} onClick={() => { onGatherDelete(postId); }}>삭제</STEditButton>
                                    </div>)}

                            </>
                        )
                }


                <Comment postId={postId} kind='gather' commentDtoList={post.commentDtoList} style={{ marginTop: "20px" }} />

            </StWrap>
    );
};

export default Gather;

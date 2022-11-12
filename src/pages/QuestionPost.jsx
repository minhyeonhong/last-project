import React, {useState, useEffect, useRef} from 'react';
import Layout from '../components/layout/Layout';
import SearchAddress from './SearchAddress';
import KakaoMap from '../components/common/KakaoMap'
import PopupDom from './PopupDom';
import { useDispatch, useSelector } from 'react-redux';
import imageCompression from 'browser-image-compression';
import { useNavigate } from 'react-router-dom';
import {__addPost3 } from "../redux/modules/postSlice3"

const QuestionPost =() => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const questionPosts = useSelector((state)=> state.questionPosts.questionPosts)

    // 주소 API 팝업창 상태 관리
    const [postAddress, setPostAddress] = useState("")
    const [isPopupOpen, setIsPopupOpen] = useState(false)
 
    const popupPostCode = () => {
        setIsPopupOpen(!isPopupOpen)
    }

    //내용 onChange
    const [question, setQuestion] = useState({
        title :"",
        content : "",
        postLink : ""
    })

    const onChangeHandler =(e) => {
        const {value, name} = e.target;
        setQuestion({
            ...question,
            [name] : value
        })
    }
    
    //1.이미지 업로드 부분
    const [imgFile, setImgFile] = useState([]);
    const [imgUrl, setImgUrl] = useState([]);
    const imgRef = useRef();

    const onChangeImage = (e) => {
        const files = e.currentTarget.files;
  
        if ([...files].length > 5) {
          alert('이미지는 최대 3개까지 업로드가 가능합니다.');
          return;
        }
  
        //선택한 이미지 파일 반복문 돌리기
        [...files].forEach(file => {
  
          //이미지 압축 지정 
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 220,
            useWebWorker: true,
          };
  
          //압축 관련 내용
          imageCompression(file, options)
            .then((res) => {
  
              //이미지를 담기 : type에서 "image/*"을 하면 나오지 X split을 이용
              setImgFile(imgs => [...imgs, new File([res], res.name, { type: "image/" + res.name.split(".")[1] })]);
              const reader = new FileReader(); 
  
              reader.onload = () => {
                setImgUrl(imgUrl => [...imgUrl, reader.result]);
              };
              reader.readAsDataURL(res); 
            })
            .catch((error) => {
              console.log("파일 압축 실패", error);
            })
        });
  
      }

      const onSubmit = () => {

        const formData = new FormData();

        if (imgFile.length > 0) {
            imgFile.forEach((file) => {
              formData.append("multipartFile", file);
            })
          } else {
            formData.append("multipartFile", null);
          }
           
        const obj3 = {
            title : question.title,
            content : question.content,
            //postLink : question.postLink,
            //postAddress : postAddress,
        }

        formData.append(
            "askPostRequestDto",
            new Blob([JSON.stringify(obj3)], { type: "application/json" })
            );

        dispatch(__addPost3(formData))

    }


    return(
        <div>
            <Layout>
                <div>
                    <label>글 작성</label><br/>
                    <input type="text" placeholder="제목" name="title" onChange={onChangeHandler}/>
                </div>
                <div><br/>
                    <button onClick={()=> { imgRef.current.click()}}> 업로드 버튼</button><br/>
                        <label htmlFor="imgFile">
                            <input
                                style={{ display: "none" }}
                                type="file"
                                id="imgFile"
                                onChange={onChangeImage}
                                accept="image/*"
                                ref={imgRef}
                                name="imgFile"/>
                                    
                                {
                                    imgUrl.map((img) => {
                                        return (
                                            <div key={img.id}>
                                                <img src={img ? img : ""}  style={{height: "300px", width : "300px"}}/>
                                            </div>
                                        )
                                    })
                                }
                        </label>
                </div >
                <input type="text" placeholder="소개글" name="content" onChange={onChangeHandler}/>
                <div>
                    <label>행사장 링크</label>
                    <input type="text" placeholder="링크" name="postLink" onChange={onChangeHandler}/>
                </div>
                <div>
                    <button type='button' onClick={popupPostCode}>우편번호 검색</button>
                            
                        <div id='popupDom'>
                            {postAddress}
                            {isPopupOpen && (
                                <PopupDom>
                                    <SearchAddress onClose={popupPostCode} setPostAddres={setPostAddress}/>  
                                </PopupDom>
                                )}
                        </div>  
                            {
                                postAddress !== ""&&<KakaoMap address={postAddress} width="500px" height="300px"/>
                            }                                                        
                </div>

                    <button onClick={onSubmit}>등록하기</button>
                    <button onClick={()=>navigate(-1)}>취소</button>

                    {
                       questionPosts&&questionPosts.map((item)=> (
                            <div key={item.id}>
                                <div>{item.title}</div>
                                <div>여기에 이미지가 들어갑니다</div>
                                <div>{item.content}</div>
                                <div>{item.postAddress}</div>
                                <hr/>
                            </div>
                        ))
                    }
            </Layout>
        </div>
    )
}

export default QuestionPost;
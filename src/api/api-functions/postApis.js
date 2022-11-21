import { hInstance, nhInstance } from "../instance";

export const postApis = {
    /**전체글 검색 조회 */
    searchPostAX: (searchInfo) => nhInstance.get(
        `${process.env.REACT_APP_API_URL}/allposts`, { params: { ...searchInfo, tag: searchInfo.tag.join() } }),
    /**상세글 조회 */
    getPostAX: (post) => hInstance.get(`${process.env.REACT_APP_API_URL}/${post.url}/${post.postId}`),
    /**상세글 수정 */
    putPostAx: (post) => hInstance.put(`${process.env.REACT_APP_API_URL}/eventposts/${post.postId}`, post.content),
    /**좋아요 */
    postScrapAx: (payload) => hInstance.post(`likes/${payload.url}/${payload.postId}`, ""),
}
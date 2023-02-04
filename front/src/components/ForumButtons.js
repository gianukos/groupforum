import CreatePosts from "./CreatePosts.js";
import RecentPost from "./RecentPost.js";
import PostList from "./PostList.js"
import SinglePost from "./SinglePost.js"

export default {
    name: 'ForumButtons',
    components: {
        CreatePosts,
        RecentPost,
        PostList,
        SinglePost
    },
    props: {
        userID: String,
        userName: String
    },
    data(){
        return{
            showrecent: true,
            showlist: false
        }
    },
    methods: {
        showPosts(){
            this.showrecent = !this.showrecent
            this.showlist = !this.showrecent
        },
        showSingle(){
            this.showrecent = false
            this.showlist = false
        }
    },
    template:`
        <div class="forumbuttons">
            <div v-if="showrecent">
            <RecentPost :userID="this.userID" :userName="this.userName" @view-single="showSingle"></RecentPost>
            <CreatePosts :userID="this.userID" :userName="this.userName" @display-list="showPosts"></CreatePosts>
            </div>
            <div v-else-if="showlist">
            <PostList @view-single="showSingle"></PostList>
            </div>
            <div v-else>
            <SinglePost  @view-posts="showPosts"></SinglePost>
            </div>
        </div>
    `
}
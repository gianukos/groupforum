import CreatePosts from "./CreatePosts.js";
import RecentPost from "./RecentPost.js";
import PostList from "./PostList.js"

export default {
    name: 'ForumButtons',
    components: {
        CreatePosts,
        RecentPost,
        PostList
    },
    props: {
        userID: String,
        userName: String
    },
    data(){
        return{
            showrecent: true
        }
    },
    methods: {
        showPosts(){
            this.showrecent = !this.showrecent
        }
    },
    template:`
        <div class="forumbuttons">
            <div v-if="showrecent">
            <RecentPost :userID="this.userID" :userName="this.userName"></RecentPost>
            <CreatePosts :userID="this.userID" :userName="this.userName" @display-list="showPosts"></CreatePosts>
            </div>
            <div v-else>
            <PostList></PostList>
            </div>
        </div>
    `
}
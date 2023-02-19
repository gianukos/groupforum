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
            showlist: false,
            previews: {}
        }
    },
    methods: {
        showPosts(){
            this.showrecent = !this.showrecent
            this.showlist = !this.showrecent
        },
        showSingle(ref){
            this.showrecent = false
            this.showlist = false
            // previews object of child components RecentPosts or PostList
            if ( ref === 'recent'){
                Object.keys(this.$refs.recent.previews).forEach( (k) => {
                    this.previews[k] = this.$refs.recent.previews[k]
                })
            } else {
                Object.keys(this.$refs.list.previews).forEach( (k) => {
                    this.previews[k] = this.$refs.list.previews[k]
                })
            }
        }
    },
    template:`
        <div class="forumbuttons">
            <div v-if="showrecent">
            <RecentPost :userID="this.userID" :userName="this.userName" @view-single="showSingle('recent')" ref="recent"></RecentPost>
            <CreatePosts :userID="this.userID" :userName="this.userName" @display-list="showPosts"></CreatePosts>
            </div>
            <div v-else-if="showlist">
            <PostList :userID="this.userID" @view-single="showSingle('list')" @view-forum="showPosts" ref="list"></PostList>
            </div>
            <div v-else>
            <SinglePost  @view-posts="showPosts" :previews="previews" :userID="this.userID" :userName="this.userName"></SinglePost>
            </div>
        </div>
    `
}
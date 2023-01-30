import CreatePosts from "./CreatePosts.js";
import RecentPost from "./RecentPost.js";

export default {
    name: 'ForumButtons',
    components: {
        CreatePosts,
        RecentPost
    },
    props: {
        userID: String,
        userName: String
    },
    template:`
        <div class="forumbuttons">
            <RecentPost :userID="this.userID" :userName="userName"></RecentPost>
            <CreatePosts :userID="this.userID" :userName="userName"></CreatePosts>
        </div>
    `
}
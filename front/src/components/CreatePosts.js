import ReadPosts from "./ReadPosts.js";
import PostForm from "./PostForm.js";
export default {
    name: 'CreatePosts',
    components: {
        ReadPosts,
        PostForm
    },
    props: {
        userID: String,
        userName: String
    },
    data(){
        return{
        showForm: false,
        buttonVal: "Create a post"
        }
    },
    emits: ['displayList'],
    methods: {
        showButton() {
            this.showForm = !this.showForm;
            document.getElementById('dbresult').innerText = '';
            this.buttonVal = ( this.showForm ? "Cancel posting" : "Create a post" );
        },
        showPosts() {
            // emits to parent ForumButtons event emitted by child ReadPosts
            this.$emit('displayList')
        }
    },
    template: `
        <input type="button" class="button show" @click="showButton" :value=this.buttonVal />
        <ReadPosts @display-list="showPosts"></ReadPosts>
        <PostForm v-show="this.showForm" :userID="this.userID" :userName="this.userName"></PostForm>
    `,
    updated() {
        document.getElementById('forumsections').scrollIntoView({block: "start", inline:"nearest"});
    }

}
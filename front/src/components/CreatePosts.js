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
    methods: {
        showButton() {
            this.showForm = !this.showForm;
            this.buttonVal = ( this.showForm ? "Cancel posting" : "Create a post" );
        }
    },
    template: `
    <input type="button" class="button show" @click="showButton" :value=this.buttonVal />
    <ReadPosts></ReadPosts>
    <PostForm v-show="this.showForm" :userID="this.userID" :userName="this.userName"></PostForm>
    `,
    updated() {
        document.getElementById('forumsections').scrollIntoView({block: "start", inline:"nearest"});
    }

}
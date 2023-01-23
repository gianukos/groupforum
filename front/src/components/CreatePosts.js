import PostForm from "./PostForm.js";
export default {
    name: 'CreatePosts',
    components: {
        PostForm
    },
    props: {
        id: String,
        name: String
    },
    data(){
        return{
        showForm: false,
        buttonVal: "Create a post"
        }
    },
    methods: {
        showCreate() {
            if (!sessionStorage.getItem("sessionUser")){
                console.log("Component CreatePosts")
			}else{
                var myuser = sessionStorage.getItem('sessionUser');
                console.log(`${myuser} will click here to create posts`)
                this.showForm = !this.showForm;
                this.buttonVal = ( this.showForm ? "Cancel posting" : "Create a post" );
                
            }
        }
    },
    template: `
    <input type="button" class="button show" @click="showCreate" :value=this.buttonVal />
    <PostForm v-show="showForm" :userID=this.id :userName=this.name></PostForm>
    `,
    updated() {
        document.getElementById('postform').scrollIntoView({block: "start", inline:"nearest"});
    }

}
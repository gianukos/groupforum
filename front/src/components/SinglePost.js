import PostComment from "./PostComment.js";
export default {
    name: 'SinglePost',
    components: {PostComment},
    props: ['previews', 'userID', 'userName'],
    emits: ['viewPosts'],
    data(){
        return{
            endpoint: 'http://localhost:3000/api',
            showallcomments: false,
            allcomments:[],
            cbuttonval:"show group comments",
            imgbuttonval: "display "
        }
    }, 
    methods:{
        getComments(){
            // get comments for post
            if( this.allcomments.length > 0 ){ return true };
            let pParam = "?p=" + this.previews.id;
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"GET",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            (async () => {
                const response = await fetch(this.endpoint + '/comments/comments' + pParam, requestOpts).catch((error) => { return false })
                if ( response.status === 200  ) {
                    let commentsObj = await response.json();
                    if ( ! commentsObj.message ){
                        this.allcomments = commentsObj.userData
                    }
                }
                if ( this.allcomments && this.allcomments.length > 0) { // async double-check
                    this.expandComments()
                }
            })();
            return true
        },
        getImage(){
            if ( this.imgbuttonval === "hide ") {
                this.imgbuttonval = "display "
                return true
            }
            let pParam = "?p=" + this.previews.id;
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"GET",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            
            (async () => {
                const response = await fetch(this.endpoint + '/posts/image' + pParam, requestOpts).catch((error) => { return false });
                if ( response.status === 200  ) {
                    this.imgbuttonval = "hide "
                    let fileBlob = await response.json();
                    let output = document.getElementById('previewspath')
                    output.src = fileBlob.userDataBuf
                    }
            })();  
        },        
        expandComments(){
            if( this.showallcomments ){
                this.showallcomments = false;
                this.cbuttonval = 'show group comments';
            } else if ( this.allcomments.length == 0 ){
                 this.cbuttonval = 'no comments yet'
            } else {
                this.cbuttonval = 'hide group comments'
                this.showallcomments = true;
            }
        },
        resetComments(){
            while( this.allcomments && this.allcomments.length > 0 ){
                this.allcomments.pop();
            }
            this.allcomments = []
            this.cbuttonval = 'show group comments';
        },
        formatTimeStamp(t){
            let pd = new Date(t)
            let postdate = pd.toString().split(' ')
            postdate = postdate[0] + ' ' + postdate[1] + ' ' +  postdate[2] + ' ' + postdate[4];
            return postdate
        },
        decoded(u){
            let areaURL = document.createElement('textarea');
            areaURL.innerHTML = u;
            return areaURL.value;
        }
    },
    template:
    `
        <section class="postpage">
        <div v-if="previews.url.length > 0"><a :href="this.decoded(previews.url)">{{this.decoded(previews.url)}}</a></div>
        <h3>{{previews.Topic}}</h3>
        <div><span>by {{previews.name === 'none' ? 'anonymous' : previews.name}} on </span><span>{{previews.Date}}</span></div>
        <div class="postpage"><strong>{{previews.description}}</strong></div>
        <div v-if="previews.path">
        <div class="comments"><a @click="getImage()"><span v-show="previews.path">{{imgbuttonval}}{{previews.path}}</span><br>
        <img v-show="imgbuttonval === 'hide '" id="previewspath" style="height:300px; width:300px;" alt="image posted by {{previews.name}}">
        </a></div>
        </div>
        <div class="comments"><a @click="getComments()&&expandComments()">{{cbuttonval}}</a></div>
        <div v-if="showallcomments" class="showcomments">
        <div class="commentsview" v-for="comment in this.allcomments" :key="comment.commentID">
        <span>comment by {{comment.name !== 'none' ? comment.name : 'anonymous'}} on {{this.formatTimeStamp(comment.time_created)}}</span><br>
        <br><span>{{comment.comment}}</span><br>---<br>
        </div></div>
        <PostComment :postID="previews.id" :userID="this.userID" :userName="this.userName" @get-reset="resetComments()&&getComments()&&expandComments()"></PostComment>
        <button type="button" class="button preview" @click="this.$emit('viewPosts')">back</button>
        </section>
    `
    ,
    mounted() {
        document.getElementsByClassName('postpage')[0].scrollIntoView({behavior: "smooth", block: "start", inline:"center"});
    }
}
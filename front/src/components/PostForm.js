export default {
    name: 'PostForm',
    data(){
        return{
        endpoint: 'http://localhost:3000/api',			
        edit: {topic:'', desc:'', resrc:'', url: ''},
        router: []
        }
    },
    props: {
        userID: String,
        userName: String
    },
    methods: {
        setEdit(prop, val){
            this.edit.prop = val;
        },
        postForm( idParam, nameParam, topicParam, descParam, urlParam ){
            var dataStr = `{"id":"${idParam}", "name":"${nameParam}", "topic":"${topicParam}", "description":"${descParam}", "url":"${urlParam}"}`;
            const userToken = sessionStorage.getItem('sessionToken');
            const postParams = JSON.parse(dataStr);
			const requestOpts = { method:"POST",  headers:{"Content-Type":"application/json", "Authorization": "Bearer " + userToken}, body:JSON.stringify(postParams)};
            (async () => {
                const response = await fetch(this.endpoint + "/posts/create", requestOpts).catch(	(error) => { return false })
                const body = await response.json();
                const dbpostresult = document.getElementById('dbpostresult');
                dbpostresult.scrollIntoView({block: "start", inline:"center"});
                if ( response.status === 200 ){
                    dbpostresult.innerText = "Post created!"
                } else if ( response.status === 400) {
                    if (body.error === "duplicate post"){
                        this.edit.topic = '';
                        this.edit.desc = '';
                        dbpostresult.innerText = "Sorry: " + body.error;
                    }
                }else{
					dbpostresult.innerText = "Please try again :  " +  response.statusText;
				}
            })();
        }
    },
    template: `
    <section>
    <div class="postform">
    <div class="input"> 
    <form type="submit">
        <h3>New Post<br>____________</h3>
        <label for="topic"><h4 class="edit">Create a post</h4></label>
        <input v-model="edit.topic" type="text" name="topic" id="topic" placeholder="Give your post a title" maxlength=100>
        <label for="description"><h4 class="edit">Description of post</h4></label>
        <div>
            <textarea v-model="edit.desc" name="description" id="description" label="description" placeholder="Describe the content of your post" spellcheck="true" rows="8" cols="70"></textarea><br>
        </div>
        <div class="input">
            <label for="url"><h4>link to information online</h4></label>
            <input v-model="edit.url" type="text" name="url" id="url" placeholder="Provide a link to a website (optional)">
        </div>
        <div><p></p></div>
        <label for="submitPost"><span class="edit">Submit your post!</span></label>
        <div class="input">
			<input type="button"  class="submit" value="submit" id="submitPost" @click="postForm( this.userID, this.userName, edit.topic, edit.desc, edit.url )">
		</div>
        <div><p id="dbpostresult"></p></div>
    </form>
    </div>
    <div class="input">
    <form enctype="multipart/form-data" method="post" action="" onsubmit="">
        <h5 class="edit">Option to post an image<br>(jpg or png)</h5>
        <div class="input">
        <label for="select"></label>
        <input type="file" class="file" id="select">
        </div>
        <div class="input">
        <label for="imgSubmit"></label>
        <input type="button"  class="submit" id="imgSubmit" value="Submit image" @click="this.edit.title='false'">
        </div>
    </form>        
    </div>
    </div>
    </section>
    `
}
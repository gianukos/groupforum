export default {
    name: 'PostForm',
    data(){
        return{
        endpoint: 'http://localhost:3000/api',			
        edit: {topic:'', desc:'', resrc:'', url:'', filepath:'', file: null},
        router: [],
        urlerror: false
        }
    },
    props: {
        userID: String,
        userName: String
    },
    methods: {
        loadFile(e){
            const reader = new FileReader();
            let select = e.target.files[0]
            let tmpname  =  select.name.split(' ').join('_');
            let extension = tmpname.split('.').pop();
            if(! [ 'jpg', 'jpeg', 'png'].includes( extension ) ){
                this.edit.file = false
                return
            } else {
                this.edit.filepath = `${tmpname.slice(0, tmpname.lastIndexOf('.'))}.${Date.now()}.${extension}`;
                Object.defineProperty(select, "name" , {value: this.edit.filepath})
                console.log(select.name)
            }
            reader.addEventListener("load", () => {
                this.edit.file =  reader.result 
            }, false);
            reader.readAsDataURL(select)
        },
        postForm( idParam, nameParam, topicParam, descParam, urlParam, pathParam, fileParam ){
            var dataStr = `{"id":"${idParam}", "name":"${nameParam}", "topic":"${topicParam}", "description":"${descParam}", "url":"${urlParam}", "filepath":"${pathParam}"}`;
            const userToken = sessionStorage.getItem('sessionToken');
            const postParams = JSON.parse(dataStr);
            postParams.file = fileParam
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ ;
            if ( postParams.url.length > 0 && ! urlPattern.test(postParams.url.length)){
                postParams.url = '';
                this.edit.url = '';
                this.urlerror = true
            } else {
                this.urlerror = false
            }
			const requestOpts = { method:"POST",  headers:{"Content-Type":"application/json", "Authorization": "Bearer " + userToken}, body:JSON.stringify(postParams)};
            (async () => {
                const response = await fetch(this.endpoint + "/posts/create", requestOpts).catch(	(error) => { return false })
                const body = await response.json();
                const dbpostresult = document.getElementById('dbpostresult');
                dbpostresult.scrollIntoView({block: "start", inline:"start"});
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
            <div class="urlerror" v-if="urlerror">must be a valid url</div>
        </div>
        <div><p></p></div>
        <label for="submitPost"><span class="edit">Submit your post!</span></label>
        <div class="input">
			<input type="button"  class="submit" value="submit" id="submitPost" @click="postForm( this.userID, this.userName, edit.topic, edit.desc, edit.url, edit.filepath, edit.file )">
		</div>
        <div><p id="dbpostresult"></p></div>
        <div class="input">
        <h5 class="edit">Option to post an image<br>(jpg or png)</h5>
        <label for="select"></label>
        <input type="file" class="file" id="select" name="select" @change="this.loadFile($event)" accept="image/jpeg image/png">
        </div>
    </form>
    </div>
    </div>
    </section>
    `
}
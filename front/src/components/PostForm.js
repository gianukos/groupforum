export default {
    name: 'PostForm',
    data(){
        return{
        endpoint: 'http://localhost:3000/api',			
        edit: {topic:'', desc:'', resrc:'', url:'', filepath:''},
        router: [],
        urlerror: false
        }
    },
    props: {
        userID: String,
        userName: String
    },
    methods: {
        loadFile(i){
            // let select = e.target.files[0]
            console.log(`selected file ${i.name}`)
            let tmpname  =  i.name.split(' ').join('_');
            let extension = tmpname.split('.').pop();
            if(! [ 'jpg', 'jpeg', 'png'].includes( extension ) ){
                // formData.delete('image');
                return false
            } else {
                // this.edit.filepath = select.name;
                return true
            }
        },
        postForm(){
            const userToken = sessionStorage.getItem('sessionToken');
            
            const form = document.forms.namedItem("postform");
            const formData = new FormData(form);
            formData.append("id", this.userID);
            formData.append("name", this.userName);
            formData.append("filepath", this.edit.filepath)
            if (formData.has('image')){
                let extMessage = "Please select file with extension 'png' or 'jpg'."
                if ( ! this.loadFile(formData.get('image')) ){
                    dbpostresult.innerText = extMessage;
                    return
                }
            } 
            if ( this.edit.topic === '' ){
                dbpostresult.innerText = "Please include a post title"
                document.getElementById('topic').style = "border:solid 8px #f0d3d8"
                return
            }
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ ;
            if ( this.edit.url.length > 0 && ! urlPattern.test(this.edit.url)){
                this.edit.url = '';
                this.urlerror = true
            } else {
                this.urlerror = false
            }
			const requestOpts = { method:"POST",  headers:{ "Authorization": "Bearer " + userToken}, body:formData};
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
    <form type="submit" enctype="multipart/form-data" method="post" name="postform">
        <h3>New Post<br>____________</h3>
        <label for="topic"><h4 class="edit">Create a post</h4></label>
        <input v-model="edit.topic" type="text" name="topic" id="topic" placeholder="Give your post a title" maxlength=100 required>
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
			<input type="button"  class="submit" value="submit" id="submitPost" @click="postForm()">
		</div>
        <div><p id="dbpostresult"></p></div>
        <div class="input">
        <h5 class="edit">Option to post an image<br>(jpg or png)</h5>
        <label for="select"></label>
        <input type="file" class="file" id="select" name="image"  accept="image/jpeg, image/png">
        </div>
    </form>
    </div>
    </div>
    </section>
    `
}
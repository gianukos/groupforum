export default {
    name: 'PostForm',
    data(){
        return{
        edit: {topic:'', desc:'', resrc:'', url: ''},
        router: []
        }
    },
    template: `
    <div class="postform">
    <div class="input"> 
    <form type="submit">
        <h3>New Post<br>____________</h3>
        <h4 class="edit">Create a post</h4>
        <input v-model="edit.topic" type="text" name="topic" placeholder="Give your post a title" @click="this.edit.title='false'">
        <label for="description"><h4 class="edit">Description of post</h4></label>
        <div>
            <textarea v-model="edit.desc" name="description" id="description" label="description" placeholder="Describe the content of your post" spellcheck="true" rows="8" cols="70"></textarea><br>
        </div>
        <label for="url"><h5 class="edit">link to information online</h5></label>
        <div>
            <input v-model="edit.url" type="text" name="url" id="url" placeholder="Provide a link to a website (optional)">
        </div>
        <label for="submitPost"><h5 class="edit">Submit your post!</h5></label>
        <div>
			<input type="button"  class="submit" value="submit" id="submitPost">
		</div>
    </form>
    </div>
    <div class="input">
    <form enctype="multipart/form-data" method="post" action="" onsubmit="">
        <label for="imgSubmit"><h5 class="edit">Option to post an image<br>(jpg or png)</h5></label>
        <div class="input">
        <label for="select"></label>
        <input type="file" class="file" id="select">
        </div>
        <input type="button"  class="submit" id="imgSubmit" value="Submit image" @click="this.edit.title='false'">
    </form>        
    </div>
    </div>
    `,
    style: `
        div.show{visibility: none;}
        
    `
}
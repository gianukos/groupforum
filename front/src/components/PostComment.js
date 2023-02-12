export default {
    name: 'PostComment',
    props: ['postID', 'userID', 'userName'],
    emits: ['getReset'],
    data(){
        return{
            endpoint: 'http://localhost:3000/api',
            comment:''
        }
    },
    template:   `
                <div>
                    <div>make a comment</div>
                    <textarea v-model="this.comment" label="comment" rows="3"></textarea>
                    <br>
                    <div><p id="cdbpostresult"></p></div>
                    <button type="button" class="button submit" @click="submitComment( this.comment, this.userName, this.postID, this.userID )">submit</button>
                </div>
                `,
    methods:{
        submitComment( commentParam, nameParam, postParam, userParam ){ 
            if ( commentParam.length === 0){ return }
            var dataStr = `{"comment":"${commentParam}", "postID":"${postParam}", "userID":"${userParam}", "name":"${nameParam}"}`;
            let userToken = sessionStorage.getItem('sessionToken');
            const postParams = JSON.parse(dataStr);
            const requestOpts = { method:"POST",  headers:{"Content-Type":"application/json", "Authorization": "Bearer " + userToken}, body:JSON.stringify(postParams)};
            (async () => {
                const response = await fetch(this.endpoint + "/comments/comment", requestOpts).catch(	(error) => { return false })
                const body = await response.json();
                const dbpostresult = document.getElementById('cdbpostresult');
                if ( response.status === 200 ){
                    dbpostresult.innerText = "comment posted!"
                    this.$emit('getReset')
                } else if ( response.status === 400) {
                    if (body.error === "duplicate post"){
                        this.comment = '';
                        dbpostresult.innerText = "Sorry, " + body.error;
                        this.$emit('getReset')
                    }
                }else{
					dbpostresult.innerText = "Please try again :  " +  response.statusText;
				}
            })();
        }
    }
}
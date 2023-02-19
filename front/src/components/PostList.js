export default {
    name: 'PostList',
    expose: ['previews'],
    emits: ['viewSingle', 'viewForum'],
    props: ['userID'],
    data(){
        return {
            endpoint: 'http://localhost:3000/api',
            allposts: [],
            previews: {id:'', Topic:'', name:'', Date:'', description:'', url:'', path:'', before: false}
        }
    },
    methods: {
        getAllPosts(){
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"GET",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            (async () => {
                const response = await fetch(this.endpoint + '/posts/posts/', requestOpts).catch((error) => { return false })
                if ( response.status === 200  ) {
                    let postObject = await response.json();
                    this.allposts = postObject.userData;
                    this.checkRead();
                }
            })();
        },
        formatTimeStamp(t){
            let pd = new Date(t)
            let postdate = pd.toString().split(' ')
            postdate = postdate[0] + ' ' + postdate[1] + ' ' +  postdate[2] + ' ' + postdate[4];
            return postdate
        },
        setPreviews(l, t){
            this.previews['id'] = l.postID 
            this.previews['Topic'] = l.topic
            this.previews['name'] = l.name
            this.previews['Date'] = t
            this.previews['description'] = l.description
            this.previews['url'] = l.url
            this.previews['path'] = l.filepath
            this.previews['before'] = true
            this.wasRead(l.postID);
            return true  // emit custom event
        },
        checkRead(){
            let readlist = []
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"GET",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            (async () => {
                const response = await fetch(this.endpoint + '/posts/before/' + this.userID , requestOpts).catch((error) => { return false })
                if ( response.status === 200  ) {
                    let readPost = await response.json();
                    readPost.userData.forEach( (postJson) => {
                        readlist.push(postJson.postID)
                    })
                    this.allposts.forEach(( postData ) => {
                        if ( readlist.includes(postData.postID)){
                            postData['read_before'] = true;
                        } else {
                            postData['read_before'] = false;
                        }
                    })
                }
            })();
        },
        wasRead(p){
            let pParam = "?p=" + p;
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"PUT",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            (async () => {
                const response = await fetch(this.endpoint + '/posts/after/' + this.userID  + pParam , requestOpts).catch((error) => { return false })
                if ( response.status === 200  ) {
                    true
                }
            })();
        }
    },
    template:
    `
        <section class="postlist">
        <h3><a @click="getAllPosts">All Posts</a></h3>
        <div>
        <ul>
        <li v-for="item in this.allposts" :key="item.postID">
        <div class="postlist">
        <a @click="setPreviews(item, this.formatTimeStamp(item.time_created))&&this.$emit('viewSingle')"><span>{{item.topic}}&nbsp;&nbsp;</span><span class="postlist poster">by&nbsp;{{item.name !== 'none' ? item.name : 'anonymous'}}&nbsp;&nbsp;</span></a>
        <span>{{this.formatTimeStamp(item.time_created)}}</span><span v-if="!item.read_before">&nbsp;&nbsp;&nbsp;&nbsp;<button id='before'>unread</button></span>
        </div>
        </li>
        </ul>
        </div>
        <div><button type="button" class="button preview" @click="this.$emit('viewForum')">back</button></div>
        </section>
    `
        ,
    created() {
        this.getAllPosts();
    },
    updated() {
        document.getElementById('forumsections').scrollIntoView({behavior:"smooth", block: "start", inline:"nearest"});
    }
}
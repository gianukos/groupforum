export default {
    name: 'RecentPost',
    expose: ['previews'],
    emits: ['viewSingle'],
    data(){
        return {
            endpoint: 'http://localhost:3000/api',
            topics: true,
            description: false,
            latest: "see your latest posts",
            buttonval: "NEW",
            dbuttonval: "preview",
            counter: 1,
            i: false,
            previews: {id:'', Topic:'', name:'', Date:'', description:'', url:'', path:''},
            recentdb: "data base error. Please try again later."
        };
    },
    template: `
        <section class="recent">
        <div class="recent" id="recent" v-if="this.topics">
        
            <div>
            <button type="button" class="button recent" @click="showRecent">{{buttonval}}</button>
            <div>
            <span>{{latest}}</span><span v-if="this.userName!=='none'&&latest.length>0">{{this.userName}}</span>
            <span v-else v-show="latest.length>0">! &nbsp;</span>
            <div v-if="previews.name.length > 0">
            <a href="#recent" @click="this.$emit('viewSingle')">
            <span id="recentTopic">{{previews.Topic}}</span>
            <span id="recentName">by</span><span>&nbsp;{{previews.name !== 'none' ? previews.name : 'anonymous'}}</span></a>
            <span id="recentDate">{{previews.Date}}</span></div>
            </div></div>
            <div class="preview" v-if="buttonval!=='NEW'">
            <button type="button" class="button preview" @click="showDescription">{{dbuttonval}}</button>
            <div class="preview text" v-if="this.description">{{previews.description}}</div>
            </div> 
        </div>
        <div v-else class="recent dberror">{{recentdb}}</div>
        </section>
    `,
    props: {
        userID: String,
        userName: String
    },
    methods: {
        showRecent(){
            if (this.i) { 
                this.counter += 1 
            }
            else {
                this.i = true;
                document.getElementById('dbresult').innerText = '';
            }
            let pParam = "?p=" + this.counter;
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"GET",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            (async () => {
                const response = await fetch(this.endpoint + '/posts/recent/' + this.userID  + pParam , requestOpts).catch((error) => { return false })
                if ( response.status === 200  ) {
                    const recent = await response.json();
                    if ( recent.message ){
                        this.topics = false;
                        this.recentdb = recent.message;
                    } else {
                        this.topics = true;
                        this.previews.id = recent.id
                        this.previews.Date = recent.Date
                        this.previews.Topic = recent.Topic
                        this.previews.name = this.userName
                        this.previews.description = recent.description
                        this.previews.url = recent.url
                        this.previews.path = recent.filepath
                        this.latest = '';
                        if ( recent.Limit === "more" ){
                            this.buttonval = 'NEXT'
                            this.previews.Topic = this.previews.Topic + "  "
                        } else {
                            this.buttonval = "NEW";
                            this.latest = "see your latest posts"
                            this.i = false;
                            this.counter = 1;
                            this.previews.Topic = ''
                            this.previews.name = ''
                            this.previews.Date = ''
                        }
                // } else {
                //     this.topics = false;
                    }
                }
            })();
        },
        showDescription(){
            this.description = !this.description
            this.dbuttonval === 'preview' ? this.dbuttonval = 'hide preview' : this.dbuttonval = 'preview'
        }
    }
}
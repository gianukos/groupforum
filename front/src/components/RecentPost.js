export default {
    name: 'RecentPost',
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
            previews: {Topic:'', name:'', Date:'', description:''}
        };
    },
    template: `
        <section class="recent">
        <div class="recent" id="recent"  v-if="this.topics">
            <div>
            <button type="button" class="button recent" @click="showRecent">{{buttonval}}</button>
            <div>
            <span>{{latest}}</span><span v-if="this.userName!=='none'&&latest.length>0">{{this.userName}}</span>
            <span v-else v-show="latest.length>0">!</span><a href="#recent">
            <span id="recentTopic">{{previews.Topic}}</span>
            <span id="recentName">{{previews.name}}</span></a>
            <span id="recentDate">{{previews.Date}}</span></div>
            </div>
            <div class="preview" v-if="buttonval!=='NEW'">
            <button type="button" class="button preview" @click="showDescription">{{dbuttonval}}</button>
            <div class="preview text" v-if="this.description">{{previews.description}}</div>
            </div>
        </div>
        <div class="recent dberror" v-else>"data base error. Please try again later."</div>
        </section>
    `,
    props: {
        userID: String,
        userName: String
    },
    methods: {
        showRecent(){
            console.log(this.userName)
            if (this.i) { 
                this.counter += 1 
            }
            else {
                this.i = true;
            }
            let pParam = "?p=" + this.counter;
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"GET",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            (async () => {
                const response = await fetch(this.endpoint + '/posts/recent/' + this.userID  + pParam , requestOpts).catch((error) => { return false })
                if ( response.status === 200  ) {
                    this.topics = true;
                    const recent = await response.json();
                    this.previews.Date = recent.Date
                    this.previews.Topic = recent.Topic
                    this.previews.name = this.userName
                    this.previews.description = recent.description
                    this.latest = '';
                    if ( recent.Limit === "more" ){
                        this.buttonval = 'NEXT'
                        this.previews.Topic = this.previews.Topic + "  "
                        this.previews.name = "by " + this.previews.name + "  "
                    } else {
                        this.buttonval = "NEW";
                        this.latest = "see your latest posts"
                        this.i = false;
                        this.counter = 1;
                        this.previews.Topic = ''
                        this.previews.name = ''
                        this.previews.Date = ''
                    }
                } else {
                    this.topics = false;
                }
            })();
        },
        showDescription(){
            this.description = !this.description
            this.dbuttonval === 'preview' ? this.dbuttonval = 'hide preview' : this.dbuttonval = 'preview'
        }
    }
}
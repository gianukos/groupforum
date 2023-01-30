export default {
    name: 'RecentPost',
    data(){
        return {
            endpoint: 'http://localhost:3000/api',
            latest: "see for your latest posts !",
            buttonval: "NEW",
            counter: 1,
            i: false
        };
    },
    template: `
        <section class="recent">
        <div class="recent" id="recent">
            <div>
            <button type="button" class="button recent" @click="showRecent">{{buttonval}}</button>
            <div><span>{{latest}}</span><a href="#recent">
            <span id="recentTopic"></span>
            <span id="recentName"></span></a>
            <span id="recentDate"></span></div>
            </div>
        </div>
        </section>
    `,
    props: {
        userID: String,
        userName: String
    },
    methods: {
        showRecent(){
            let forumName = "none";

            if ( localStorage.getItem(this.userID) ){
                this.userName  === JSON.parse(localStorage.getItem(this.userID)).uid.userName ? forumName = this.userName : forumName =  JSON.parse(localStorage.getItem(this.userID)).uid.userName
            }

            let pParam  = '';
            if (this.i) { 
                this.counter += 1 
                pParam = "?p=" + this.counter;
            }
            else {
                pParam = "?p=" + this.counter;
                this.i = true;
            }
            let userToken = sessionStorage.getItem('sessionToken');
            let requestOpts = { method:"GET",  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
            (async () => {
                const response = await fetch(this.endpoint + '/posts/recent/' + this.userID  + pParam , requestOpts).catch((error) => { return false })
                if ( response.status === 200  ) {
                    const recent = await response.json();
                    let anon = forumName;
                    forumName === 'none' ? anon = 'anonymous' : false;
                    this.latest = '';
                    if ( recent.Limit === "more" ){
                        this.buttonval = 'NEXT'
                    } else {
                        this.buttonval = "NEW";
                        recent.Topic = "no more posts "
                        this.i = false;
                        this.counter = 1;
                    }
                    document.getElementById('recentTopic').innerText = recent.Topic + "  ";
                    document.getElementById('recentName').innerText = "by " + anon + "  ";
                    document.getElementById('recentDate').innerText = recent.Date;
                } else {
                    document.getElementById('recent').style.display  = 'none';
                }
            })();
        }
    }
}
export default {
    name: 'ReadPosts',
    template: `
        <input type="button" class="button show" @click="showPosts" :value=this.buttonval />
    `,
    data(){
        return {
            buttonval: "Read group posts"
        }
    },
    emits: ['displayList'],
    methods: {
        showPosts() {
				console.log("Component ReadPosts")
                var myuser = sessionStorage.getItem('sessionUser');
                console.log(`${myuser} clicks here to read posts`)
                this.$emit('displayList')
                this.buttonval === "Read group posts" ? this.buttonval = "Hide group posts" : this.buttonval = "Read group posts"
        }
    }
}

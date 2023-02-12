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
                var myuser = sessionStorage.getItem('sessionUser');
                this.$emit('displayList')
                this.buttonval === "Read group posts" ? this.buttonval = "Hide group posts" : this.buttonval = "Read group posts"
        }
    }
}

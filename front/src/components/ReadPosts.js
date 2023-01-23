export default {
    name: 'ReadPosts',
    // components: {
    //     PostList
    // },
    template: `
        <input type="button" class="button show" @click="showPosts" value="Read group posts" />
    `,

    methods: {
        showPosts() {
            if (!sessionStorage.getItem("sessionUser")){
				console.log("Component ReadPosts")
			}else{
                var myuser = sessionStorage.getItem('sessionUser');
                console.log(`${myuser} clicks here to read posts`)
            }
        }
    }

}
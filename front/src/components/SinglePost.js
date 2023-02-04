import PostComment from "./PostComment.js";
export default {
    name: 'SinglePost',
    components: {PostComment} ,
    template:`
        <div>SinglePost component says 'hello'</div>
        <button type="button" class="button preview" @click="this.$emit('viewPosts')">exit</button>
        `
    ,
    emits: ['viewPosts']
}
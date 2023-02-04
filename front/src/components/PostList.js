export default {
    name: 'PostList',
    template:`
        <div>PostList component says 'hello'</div>
        <br>
        <div><a @click="this.$emit('viewSingle')"><li>list item <i>click for more info</i></li></a></div>
        `,
    emits: ['viewSingle']
}
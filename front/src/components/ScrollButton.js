export default{
    name: 'ScrollButton',
    template: `
    <div class="scrollto" v-if="this.scrollUp>500">
    <a href="#logo">scroll up</a>
    </div>
    `,
    data() {
        return {
          scrollUp: 0,
        };
    },
    methods: {
        handleScroll() {
          this.scrollUp = window.scrollY;
        },
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
}
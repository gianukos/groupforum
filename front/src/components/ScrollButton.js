export default{
    name: 'ScrollButton',
    template: `
    <a class="scrollto" href="#logo"><div title="Back to Top" class="scrollto" v-if="this.scrollUp>500">&#11014;</div></a>
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
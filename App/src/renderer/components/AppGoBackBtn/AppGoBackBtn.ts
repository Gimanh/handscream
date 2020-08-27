import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';

@Component
export default class AppGoBackBtn extends ZMixin {
    goBack() {
        this.$router.go( -1 );
    }
}

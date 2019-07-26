<template>
  <div>
    <control-room v-if="token"></control-room>
    <login-form v-else @login="login"></login-form>
  </div>
</template>

<script>
import ControlRoom from './ControlRoom';
import LoginForm from './LoginForm';
import { get } from './http';

export default {
  components: {
    ControlRoom,
    LoginForm,
  },
  data() {
    return {
      token: undefined,
    };
  },
  methods: {
    login(token) {
      this.token = token;
    },
  },
  async mounted() {
    this.token = await get('/token');
  },
  name: 'App',
};
</script>

<style scoped></style>

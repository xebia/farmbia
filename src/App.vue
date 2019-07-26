<template>
  <div>
    <control-room v-if="loggedIn"></control-room>
    <login-form></login-form>
  </div>
</template>

<script>
import ControlRoom from './ControlRoom';
import LoginForm from './LoginForm';

export default {
  components: {
    ControlRoom,
    LoginForm,
  },
  name: 'App',
  data() {
    return {
      loggedIn: false,
    };
  },
};
</script>

<style scoped></style>

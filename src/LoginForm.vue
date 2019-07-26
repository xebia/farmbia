<template>
  <sui-segment vertical>
    <sui-container>
      <h1>Login to my.farm.bot</h1>
      <sui-form @submit.prevent="submit()" :class="{ error: errors }">
        <sui-form-field :error="errors && !!errors.email">
          <label>E-mail address</label>
          <input
            type="text"
            name="email"
            placeholder="E-mail address"
            v-model="email"
          />
          <sui-message error v-if="errors && !!errors.email">{{errors.email}}</sui-message>
        </sui-form-field>
        <sui-form-field :error="errors && !!errors.password">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
          />
          <sui-message error v-if="errors && !!errors.password">{{errors.password}}</sui-message>
        </sui-form-field>
        <sui-form-field>
          <input type="checkbox" v-model="cheat"> Cheat
        </sui-form-field>

        <sui-button primary>Login</sui-button>
      </sui-form>
      <sui-message error v-if="errors && errors.auth">{{errors.auth}}</sui-message>
    </sui-container>
  </sui-segment>
</template>

<script>
import { post } from './http';

export default {
  data() {
    return {
      cheat: false,
      errors: undefined,
      email: '',
      password: '',
    };
  },
  name: 'LoginForm',
  methods: {
    async submit() {
      try {
        if (this.cheat) {
          this.$emit('login', '9Bi5*&jd3fzY');
        } else {
          const res = await post('/login', {
            email: this.email,
            password: this.password,
          });
          this.$emit('login', res.token.encoded);
        }
      } catch (e) {
        this.errors = JSON.parse(e.message);
        console.log(this.errors);
      }
    },
  },
};
</script>

<style scoped></style>

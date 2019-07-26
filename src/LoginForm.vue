<template>
  <sui-segment vertical>
    <sui-container>
      <h1>Login to my.farm.bot</h1>
      <sui-form @submit.prevent="submit()">
        <sui-form-field>
          <label>E-mail address</label>
          <input
            type="text"
            name="email"
            placeholder="E-mail address"
            v-model="email"
          />
        </sui-form-field>
        <sui-form-field>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
          />
        </sui-form-field>

        <sui-button primary>Login</sui-button>
      </sui-form>
    </sui-container>
  </sui-segment>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  name: 'LoginForm',
  methods: {
    async submit() {
      console.log(this.email, this.password);
      const res = await fetch('https://my.farm.bot/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          user: {
            email: this.email,
            password: this.password,
          },
        }),
      });
      console.log(res);
    },
  },
};
</script>

<style scoped></style>

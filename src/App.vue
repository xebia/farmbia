<template>
  <div>
    <div class="ui vertical segment">
      <div class="ui container">
        <h1>FarmBia!
          <button @click="unlock" class="ui right floated large yellow button">Unlock</button>
          <button @click="stop" class="ui right floated large red button"><i class="bullhorn icon"></i> STOP!</button>
        </h1>
      </div>
    </div>

    <div class="ui vertical secondary segment">
      <div class="ui container" id="app">
        <div>
          <h2>Manual movement</h2>
          <form class="ui form" @submit.prevent="move">
            <div class="grouped fields">
              <label>Movement type</label>
              <div class="field">
                <div class="">
                  <label for="relative">
                    <input type="radio" id="relative" name="movementType" value="relative"
                           v-model="movementType"/>
                    Relative</label>
                </div>
              </div>
              <div class="field">
                <div class="">
                  <label for="absolute">
                    <input type="radio" id="absolute" name="movementType" value="absolute"
                           v-model="movementType"/>
                    Absolute</label>
                </div>
              </div>
            </div>
            <div class="ui input">
              <input type="number" v-model="x" placeholder="X">
            </div>
            <div class="ui input">
              <input type="number" v-model="y" placeholder="Y">
            </div>
            <div class="ui input">
              <input type="number" v-model="z" placeholder="Z">
            </div>

            <button class="ui button">Move</button>
          </form>

          <h2>Execute sequences</h2>
          <form class="ui form" @submit.prevent="executeSequence">
            <select name="executeSequence" id="executeSequence" v-model="seqId" class="ui dropdown">
              <option value="13729">DISCO!</option>
              <option value="13728">Take weeder and weed the plant</option>
              <option value="13812">Take seeder and suck seed</option>
            </select>
            <button class="ui button">Execute</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  data() {
    return {
      movementType: 'relative',
      seqId: 13812,
      x: 0,
      y: 0,
      z: 0,
    };
  },
  methods: {
    getSequences() {},
    stop() {
      fetch('http://localhost:3000/stop', {
        method: 'POST',
      });
    },
    unlock() {
      fetch('http://localhost:3000/unlock', {
        method: 'POST',
      });
    },
    move() {
      const { x, y, z } = this;

      fetch(`http://localhost:3000/move/${this.movementType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          x: +x,
          y: +y,
          z: +z,
        }),
      });
    },
    executeSequence() {
      if (this.seqId) {
        fetch(`http://localhost:3000/sequence/execute/${this.seqId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.ui.form .ui.dropdown {
  display: inline-block;
  width: auto;
}
</style>

<template>
  <div>
    <sui-segment emphasis="secondary" vertical>
      <sui-container>
        <h1 is="sui-header">FarmBia! <sui-image size="small" :src="logo" />
          <button @click="unlock" class="ui right floated large yellow button">Unlock</button>
          <button @click="stop" class="ui right floated large red button"><i class="bullhorn icon"></i> STOP!</button>
        </h1>
      </sui-container>
    </sui-segment>

    <sui-segment vertical padded="very">
      <sui-container>
        <sui-grid columns="two">
          <sui-grid-column>

            <sui-form @submit.prevent="move(x, y, z, 'absolute')">
              <h2 is="sui-header">Manual movement</h2>

              <sui-grid columns="three">
                <sui-grid-column>
                  <sui-form-field>
                    <label>X</label>
                    <input type="number" v-model="x" placeholder="X">
                  </sui-form-field>
                </sui-grid-column>
                <sui-grid-column>
                  <sui-form-field>
                    <label>Y</label>
                    <input type="number" v-model="y" placeholder="Y">
                  </sui-form-field>
                </sui-grid-column>
                <sui-grid-column>
                  <sui-form-field>
                    <label>Z</label>
                    <input type="number" v-model="z" placeholder="Z">
                  </sui-form-field>
                </sui-grid-column>
              </sui-grid>

              <p>
                <sui-button color="green">Absolute</sui-button>
                <sui-button @click.prevent="move(x, y, z, 'relative')">Relative</sui-button>
              </p>
            </sui-form>

          </sui-grid-column>

          <sui-grid-column>
            <h2 is="sui-header">Execute sequences</h2>
            <form class="ui form" @submit.prevent="executeSequence">
              <div class="ui action input">
                <select name="executeSequence" id="executeSequence" v-model="seqId" class="ui dropdown">
                  <option value="13729">DISCO!</option>
                  <option value="13728">Take weeder and weed the plant</option>
                  <option value="13812">Take seeder and suck seed</option>
                </select>
                <sui-button color="green">Execute</sui-button>
              </div>
            </form>

            <h2 is="sui-header">Tools</h2>
            <form class="ui form" @submit.prevent="goToTool">
              <div class="ui action input">
                <select name="executeSequence" id="goToTool" v-model="toolId" class="ui dropdown">
                  <option v-for="tool in tools" :key="tool.id" :value="tool.id">{{tool.name}}</option>
                </select>
                <sui-button color="green">Pick up tool</sui-button>
              </div>
            </form>
          </sui-grid-column>
        </sui-grid>
      </sui-container>
    </sui-segment>
  </div>
</template>

<script>
import logo from './assets/favicon.svg';

const TOKEN = undefined; // TODO: get token securely
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

export default {
  name: 'app',
  components: {},
  data() {
    return {
      tools: [],
      toolId: undefined,
      logo,
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
    move(x, y, z, movementType = 'relative') {
      fetch(`http://localhost:3000/move/${movementType}`, {
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
    async goToTool() {
      const points = await fetch('https://my.farmbot.io/api/points', {
        headers,
      }).then(res => res.json());
      const { x, y, z } = points.find(p => p.tool_id === this.toolId);
      this.move(x, y, z, 'absolute');
    },
  },
  async mounted() {
    this.tools = await fetch(`https://my.farmbot.io/api/tools`, {
      headers,
    }).then(res => res.json());
    this.toolId = this.tools[0].id;
  },
};
</script>

<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.ui.form .ui.dropdown {
  display: inline-block;
  width: auto;
}
</style>

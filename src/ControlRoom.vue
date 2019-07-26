<template>
  <div>
    <sui-segment emphasis="secondary" vertical>
      <sui-container>
        <h1 is="sui-header">
          FarmBia! <sui-image size="small" :src="logo" />
          {{ info.locked }}
          <button
            v-if="info.locked"
            @click="post('/unlock')"
            class="ui right floated large yellow button"
          >
            Unlock
          </button>
          <button
            v-else
            @click="post('/stop')"
            class="ui right floated large red button"
          >
            <i class="bullhorn icon"></i> STOP!
          </button>
        </h1>
      </sui-container>
    </sui-segment>

    <sui-segment vertical padded="very">
      <sui-container>
        <sui-grid columns="two">
          <sui-grid-column>
            <sui-form
              @submit.prevent="
                move(position.x, position.y, position.z, 'absolute')
              "
            >
              <h2 is="sui-header">Manual movement</h2>

              <sui-grid columns="three">
                <sui-grid-column>
                  <sui-form-field>
                    <label>X</label>
                    <input
                      type="number"
                      step="0.01"
                      v-model="position.x"
                      placeholder="X"
                    />
                  </sui-form-field>
                </sui-grid-column>
                <sui-grid-column>
                  <sui-form-field>
                    <label>Y</label>
                    <input
                      type="number"
                      step="0.01"
                      v-model="position.y"
                      placeholder="Y"
                    />
                  </sui-form-field>
                </sui-grid-column>
                <sui-grid-column>
                  <sui-form-field>
                    <label>Z</label>
                    <input
                      type="number"
                      step="0.01"
                      v-model="position.z"
                      placeholder="Z"
                    />
                  </sui-form-field>
                </sui-grid-column>
              </sui-grid>

              <p>
                <sui-button color="green">Absolute</sui-button>
                <sui-button
                  @click.prevent="
                    move(position.x, position.y, position.z, 'relative')
                  "
                  >Relative</sui-button
                >
              </p>
            </sui-form>
          </sui-grid-column>

          <sui-grid-column>
            <h2 is="sui-header">Execute sequences</h2>
            <form class="ui form" @submit.prevent="executeSequence">
              <div class="ui action input">
                <select
                  name="executeSequence"
                  id="executeSequence"
                  v-model="seqId"
                  class="ui dropdown"
                >
                  <option :value="s.id" v-for="s in sequences" :key="s.id">{{
                    s.name
                  }}</option>
                </select>
                <sui-button color="green">Execute</sui-button>
              </div>
            </form>

            <h2 is="sui-header">Tools</h2>
            <form class="ui form" @submit.prevent="goToTool">
              <div class="ui action input">
                <select
                  name="executeSequence"
                  id="goToTool"
                  v-model="toolId"
                  class="ui dropdown"
                >
                  <option
                    v-for="tool in tools"
                    :key="tool.id"
                    :value="tool.id"
                    >{{ tool.name }}</option
                  >
                </select>
                <sui-button color="green">Pick up tool</sui-button>
              </div>
            </form>

            <h2 is="sui-header">Peripherals</h2>
            <form class="ui form">
              <sui-grid columns="two" v-for="p in peripherals" :key="p.id">
                <sui-grid-column>
                  <sui-form-field>
                    <sui-checkbox
                      :label="p.label"
                      toggle
                      v-model="p.value"
                      @change="writePin(p.pin, p.value)"
                    />
                  </sui-form-field>
                </sui-grid-column>
                <sui-grid-column>
                  <sui-label>pin {{ p.pin }}</sui-label>
                </sui-grid-column>
              </sui-grid>
            </form>
          </sui-grid-column>
        </sui-grid>
      </sui-container>
    </sui-segment>
  </div>
</template>

<script>
import Vue from 'vue';
import logo from './assets/favicon.svg';
import { getFarmbot, post } from './http';
import SockJS from 'sockjs-client';

export default {
  name: 'control-room',
  components: {},
  data() {
    return {
      info: {},
      logo,
      movementType: 'relative',
      peripherals: [],
      position: {
        x: undefined,
        y: undefined,
        z: undefined,
      },
      post,
      sequences: [],
      seqId: 13812,
      toolId: undefined,
      tools: [],
    };
  },
  methods: {
    move(x, y, z, movementType = 'relative') {
      post(`/move/${movementType}`, { x: +x, y: +y, z: +z });
    },
    executeSequence() {
      if (this.seqId) {
        post(`/sequence/execute/${this.seqId}`);
      }
    },
    async goToTool() {
      const points = await getFarmbot('/points');
      const { x, y, z } = points.find(p => p.tool_id === this.toolId);
      this.move(x, y, z, 'absolute');
    },
    writePin(pinId, value) {
      post(`/pin/${pinId}`, { value });
    },
  },
  async mounted() {
    this.tools = await getFarmbot('/tools');
    this.peripherals = await getFarmbot('/peripherals');
    this.sequences = await getFarmbot('/sequences');
    this.toolId = this.tools[0].id;

    const sockjs = new SockJS('http://localhost:3000/updates');

    sockjs.onopen = () => console.log('[*] open', sockjs.protocol);
    sockjs.onclose = () => console.log('[*] close');
    sockjs.onmessage = e => {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.pins) {
        this.peripherals.forEach(per => {
          Vue.set(per, 'value', !!data.pins[per.pin].value);
        });
      }

      if (data.info) {
        this.info = data.info;
      }

      if (data.position) {
        if (this.position.x === undefined) {
          this.position.x = data.position.x;
        }
        if (this.position.y === undefined) {
          this.position.y = data.position.y;
        }
        if (this.position.z === undefined) {
          this.position.z = data.position.z;
        }
      }
    };
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

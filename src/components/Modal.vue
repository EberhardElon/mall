<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="close">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>

        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdShow" @click="close"></div>
  </div>
</template>

<script>
  export default {
    props:["mdShow"],
    name: "Modal",
    methods:{
      close(){
        this.mdShow=false;
        this.$emit("close");
      }
    }
  }

</script>

<template>
  <div id="app">
    <!-- nav bar -->
    <div class="top-bar">
      <div class="top-bar-left">
        <ul class="dropdown menu" data-dropdown-menu>
          <li class="menu-text"><a href="https://phenotypr.com/index.html">PHENOTYPR</a></li>
          <li><router-link to="/">Body Tool</router-link></li>
        </ul>
      </div>
    </div>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

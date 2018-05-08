<template>
  <div id="app" class="wrapper">
    <div>
      <div>
        <div class="top-bar header"></div>
        <nav class="second-bar nav-bar-wrapper">
          <span class="nav-bar-text">
            <a href="https://phenotypr.com/index.html" class="nav-links-home"><strong>PHENOTYPR</strong></a>
            <a href="/#/" class="nav-links-home">Body Tool</a>
          </span>
        </nav>
      </div>
    </div>

    <div class="grid-content">
      <div class="grid-container">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<template>
  <div class="grid-x grid-margin-x">
    <div class="cell">
      <div class="media-object">
        <div class="media-object-section">
          <div>
            <img src="../../static/body.svg">
          </div>
        </div>

        <div class="media-object-section">
          <h1><strong>Body:</strong> {{title}}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeading',

  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

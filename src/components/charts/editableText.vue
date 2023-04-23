<template>
  <v-text-field
    v-if="isEditing"
    v-model="editedValue"
    @blur="save"
    @keydown.enter="save"
    @keydown.esc="cancel"
    hide-details
    autofocus
    dense
    single-line
  />
  <span v-else class="editable" @click="startEditing">
    {{ formattedText }}
  </span>
</template>

<script>
export default {
  name: "EditableText",
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    formatter: {
      type: Function,
      default: value => value,
    },
  },
  data() {
    return {
      editedValue: this.value,
      isEditing: false,
    };
  },
  computed: {
    formattedText() {
      return this.formatter(this.value);
    },
  },
  methods: {
    startEditing() {
      this.isEditing = true;
      this.editedValue = this.value;
    },
    save() {
      if (String(this.value) === String(this.editedValue)) {
        return this.cancel();
      }
      if (!String(this.editedValue).trim()) {
        return this.cancel();
      }
      this.$emit("text-edit", this.editedValue);
      this.isEditing = false;
    },
    cancel() {
      this.isEditing = false;
      this.editedValue = this.value;
    },
  },
};
</script>

<style>
.editable {
  cursor: text !important;
}
</style>

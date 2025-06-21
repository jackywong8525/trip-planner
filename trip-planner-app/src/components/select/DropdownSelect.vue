<template>
    <select 
      class="dropdown-select" 
      :value="value"
      @change="updateDropdownValue($event.target.value)"
      :style="{
        backgroundColor:selectedOptionBackgroundColor,
        color: selectedOptionColor
      }"
    >

        <option
          v-for="(option, index) in props.optionType"
          :style="{
            backgroundColor: option.backgroundColor,
            color: option.color
          }"
          :value="option.name"
        >
          {{ option.name }}
        </option>
    </select>
</template>

<script setup>
import { validate } from 'uuid';
import { inject, onMounted, ref } from 'vue';

const $bus = inject('$bus');

onMounted(() => {

  const selectedOptionKey = Object.keys(props.optionType).filter((key) => props.optionType[key].name === props.value);

  selectedOptionBackgroundColor.value = props.optionType[selectedOptionKey].backgroundColor;
  selectedOptionColor.value = props.optionType[selectedOptionKey].color;
});

const selectedOptionBackgroundColor = ref('');
const selectedOptionColor = ref('');

const props = defineProps({
  optionType: {
    type: Object,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  updateEvent: {
    type: String,
    required: true
  }
})

function updateDropdownValue(value){

  const keys = Object.keys(props.optionType);

  const selectedKey = keys.filter((key) => props.optionType[key].name === value);

  selectedOptionBackgroundColor.value = props.optionType[selectedKey].backgroundColor;
  selectedOptionColor.value = props.optionType[selectedKey].color;

  $bus.$emit(props.updateEvent, {
    value
  });
}

</script>

<style scoped>
select,
::picker(select) {
  appearance: base-select;
}

.dropdown-select {
    border: none;
    background: #fff;
    padding: 5px 20px;
    transition: 0.4s;
    width: 90%;
}

.dropdown-select:open::picker-icon {
  rotate: 180deg;
   transition: 0.4s;
}

::picker(select) {
  border: none;
}

option {
  display: flex;
  justify-content: flex-start;
  gap: 20px;

  border: 2px solid #ddd;
  background: #eee;
  padding: 10px;
  transition: 0.4s;
}

option:first-of-type {
  border-radius: 8px 8px 0 0;
}

option:last-of-type {
  border-radius: 0 0 8px 8px;
}

option:not(option:last-of-type) {
  border-bottom: none;
}

option:nth-of-type(odd) {
  background: #fff;
}

option:hover,
option:focus {
  background-color: var(--SUPP-THEME-COLOR-DARK);
  color: var(--SUPP-FONT-COLOR-LIGHT);
}

option:checked {
  font-weight: bold;
}

option::checkmark {
  order: 1;
  margin-left: auto;
  content: "☑️";
}
</style>
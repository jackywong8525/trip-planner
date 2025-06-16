<template>
    <div class="edit-trip-checklist-container">
        <ChecklistCategory
            v-for="(category, index) in categories"
            :category-index="index"
            @drop="onDrop($event, index)"
            @dragenter.prevent
            @dragover.prevent
        >
            <ChecklistItems
                v-for="(item, itemIndex) in checklistItems.filter(item => item.categoryIndex === index)"
                :id="item.id"
                v-model:name="item.name"
                v-model:deadline="item.deadline"
                v-model:status="item.status"
                :category-index="item.categoryIndex"
                @dragstart="dragChecklistItem($event, item)"
                :key="item.id"
                draggable="true"
            ></ChecklistItems>
        </ChecklistCategory>

    </div>

    <div class="add-checkitem-container">
        <button 
            class="add-checklist-category-button"
            @click.prevent="addCategory">
            Add Category
        </button>
        <button 
            class="add-checklist-item-button"
            @click.prevent="addChecklistItem">
            Add Checklist Item
        </button>
    </div>

</template>


<script setup>
import ChecklistCategory from '@/components/checkitem/ChecklistCategory.vue';
import ChecklistItems from '@/components/checkitem/ChecklistItem.vue';
import { ref, inject } from 'vue';


// Variables
const categories = ref([]);
const checklistItems = ref([]);


// Props
const props = defineProps({
    activeTrip: {
        type: Object,
        required: true
    }
});


// Global Variables
const $bus = inject('$bus');

$bus.$on('update-checklist-category', setCategory);
$bus.$on('update-checklist-item', setItem);
$bus.$on('update-checklist-item-name', updateChecklistItemName);
$bus.$on('update-checklist-item-deadline', updateChecklistItemDeadline);
$bus.$on('update-checklist-item-status', updateChecklistItemStatus);

function addCategory() {
    categories.value.push('Category');
}

function setCategory(category) {
    categories[category.index] = category.name;
}

function refreshChecklistItems() {
    checklistItems.value = [...checklistItems.value];
}

function updateChecklistItemName(updatedItem) {
    if(updatedItem.name === '') return;

    console.log('updateName called with:', updatedItem);

    checklistItems.value = [...checklistItems.value.map(item => {
        if(updatedItem.id === item.id) {
            return {
                ...item,
                name: updatedItem.name
            };
        }
        return item;
    })];

    refreshChecklistItems();
    console.log(checklistItems.value);
}

function updateChecklistItemDeadline(updatedItem) {
    if(updatedItem.deadline === '') return;

    checklistItems.value = checklistItems.value.map(item => {
        if(item.id === updatedItem.id) {
            return {
                ...item,
                deadline: updatedItem.deadline
            };
        }
        return item;
    });

    refreshChecklistItems();
}

function updateChecklistItemStatus(updatedItem) {
    if(status === '') return;

    checklistItems.value = checklistItems.value.map(item => {
        if(item.id === status.id) {
            return {
                ...item,
                status: status.status
            };
        }
        return item;
    });

    refreshChecklistItems();
}

function addChecklistItem() {

    if(categories.value.length === 0) {
        addCategory();
    }
    
    checklistItems.value.push({
        id: checklistItems.value.length + 1,
        name: 'Item',
        deadline: '',
        status: 'Unpacked',
        categoryIndex: categories.value.length - 1
    })

    console.log(checklistItems.value);
}

function setItem(item){
    let index = checklistItems.value.findIndex(i => i.id === item.id);
    
    if (index !== -1) {
        checklistItems.value[index] = {
            id: item.id,
            name: item.name,
            deadline: item.deadline,
            status: item.status,
            categoryIndex: item.categoryIndex
        };
    }
    checklistItems.value = [...checklistItems.value];

    console.log(checklistItems.value);

}

function dragChecklistItem(event, item) {
    // Visual Feedback for the drag operation
    event.dataTransfer.dropEffect = 'move';

    // Move the item instead of copying
    event.dataTransfer.effectAllowed = 'move';
    
    // Set the data to be transferred
    event.dataTransfer.setData('itemId', item.id.toString());
}

function onDrop(event, categoryIndex){
    const itemId = event.dataTransfer.getData('itemId');
    // const item = checklistItems.value.find(item => item.id === parseInt(itemId));
    
    // if (item) {
    //     item.categoryIndex = categoryIndex;
    //     checklistItems.value = [...checklistItems.value];
    //     console.log(checklistItems.value);
    // }

    const index = checklistItems.value.findIndex(item => item.id === parseInt(itemId));
    
    if (index !== -1) {
        const item = checklistItems.value[index];
        checklistItems.value[index] = {
            ...item,
            categoryIndex: categoryIndex
        };
        // This replacement triggers reactivity properly
        checklistItems.value = [...checklistItems.value];
        console.log(checklistItems.value);
    }

}

</script>

<style scoped>

.edit-trip-checklist-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px;
}

.add-checkitem-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.add-checklist-category-button,
.add-checklist-item-button {
    /* Box and Size Properties */
    height: var(--BUTTON-HEIGHT);
    width: 150px;
    padding: var(--BUTTON-PADDING);
    margin: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
    
    /* Border */
    border: var(--BUTTON-BORDER);
    border-radius: var(--BUTTON-BORDER-RADIUS);

    /* Color */
    color: var(--SUPP-FONT-COLOR-LIGHT);
    background-color: var(--SUPP-THEME-COLOR-DARK);

    /* Other */
    cursor: pointer;

    /* Shadow */
    box-shadow: var(--GENERAL-SHADOW);


}

.add-checklist-category-button:hover,
.add-checklist-item-button:hover {
    filter: var(--BUTTON-HOVER-FILTER);
}

</style>
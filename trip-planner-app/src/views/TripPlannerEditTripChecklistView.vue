<template>
    <div class="edit-trip-checklist-container">
        <ChecklistCategory
            v-for="(category, index) in categories"
            :key="category.id"
            v-model:category-name="category.name"
            :category-index="index"
            @drop="onDrop($event, index)"
            @dragenter.prevent
            @dragover.prevent
        >
            <ChecklistItems
                v-for="(item, itemIndex) in checklistItems.filter(item => item.categoryIndex === index)"
                :itemId="item.id"
                v-model:name="item.name"
                v-model:deadline="item.deadline"
                v-model:status="item.status"
                :category-index="item.categoryIndex"
                @dragstart="dragChecklistItem($event, item)"
                @dragend="onDragend"
                @drag="onDrag"
                :key="item.id"
                draggable="true"
                :id="`checklist-item-${item.id}`"
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
import { v4 as uuidv4 } from 'uuid';


// Variables
const categories = ref([]);
const checklistItems = ref([]);
const isDragging = ref(false);

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
$bus.$on('delete-checklist-category', deleteCategory);
$bus.$on('delete-checklist-item', deleteChecklistItem);

function addCategory() {
    categories.value.push({
        id: uuidv4(),
        name: 'Category'
    });
}

function setCategory(category) {
    categories.value[category.index].name = category.name;
}

function deleteCategory(index) {
    // Remove the category from the categories array
    categories.value.splice(index, 1);

    // Remove all checklist items associated with this category
    checklistItems.value = checklistItems.value.filter(item => item.categoryIndex !== index);

    // Update the categoryIndex of remaining checklist items
    checklistItems.value = checklistItems.value.map(item => {
        if (item.categoryIndex > index) {
            return { ...item, categoryIndex: item.categoryIndex - 1 };
        }
        return item;
    });

    refreshChecklistItems();
}

function refreshChecklistItems() {
    checklistItems.value = [...checklistItems.value];
}

function updateChecklistItemName(updatedItem) {
    if(updatedItem.name === '') return;


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
    if(updatedItem.status === '') return;

    checklistItems.value = checklistItems.value.map(item => {
        if(item.id === updatedItem.id) {
            return {
                ...item,
                status: updatedItem.status
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
        id: uuidv4(),
        name: 'Item',
        deadline: '',
        status: 'Unpacked',
        categoryIndex: categories.value.length - 1
    })
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
    refreshChecklistItems();

}

function deleteChecklistItem(itemId) {
    // Find the index of the item to be deleted
    const index = checklistItems.value.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
        // Remove the item from the checklistItems array
        checklistItems.value.splice(index, 1);
        // Trigger reactivity by replacing the array
        refreshChecklistItems();
    }
}

function dragChecklistItem(event, item) {
    // Visual Feedback for the drag operation
    event.dataTransfer.dropEffect = 'move';

    // Move the item instead of copying
    event.dataTransfer.effectAllowed = 'move';
    
    // Set the data to be transferred
    event.dataTransfer.setData('itemId', item.id);

    // Set the dragged item's opacity 
    const draggedItem = document.getElementById(`checklist-item-${item.id}`);
    draggedItem.style.opacity = '0.2';

    // Set a hidden drag image and its style
    let hideDragImage = draggedItem.cloneNode(true);
    hideDragImage.id = "hideDragImage-hide";
    hideDragImage.style.opacity = 0;

    // Set a visible drag image
    let dragImage = draggedItem.cloneNode(true);
    dragImage.id = "dragImage";
    dragImage.style.position = 'absolute';
    dragImage.style.opacity = '1';
    dragImage.style.pointerEvents = 'none'; // Avoid interaction disruption
    dragImage.style.left = `${event.pageX}px`;
    dragImage.style.top = `${event.pageY}px`;
    dragImage.style.width = `${draggedItem.offsetWidth}px`;
    dragImage.style.backgroundColor = 'white';

    // Append the drag images to the body
    document.body.appendChild(hideDragImage);
    document.body.appendChild(dragImage);

    // Set the hidden drag image using setDragImage
    event.dataTransfer.setDragImage(hideDragImage, 0, 0);


    isDragging.value = true;
}

function onDragend() {
    isDragging.value = false;

    const hideDragImage = document.getElementById('hideDragImage-hide');
    const dragImage = document.getElementById('dragImage');

    // Remove the drag images from the DOM
    if (hideDragImage) {
        hideDragImage.remove();
    }
    
    if (dragImage) {
        dragImage.remove();
    }
}

function onDrag(event) {
    if (isDragging.value) {
        const dragImage = document.getElementById('dragImage');
        if (dragImage) {
            // Update the position of the drag image to follow the cursor
            dragImage.style.left = `${event.pageX}px`;
            dragImage.style.top = `${event.pageY}px`;
        }
    }
}

function onDrop(event, categoryIndex){
    const itemId = event.dataTransfer.getData('itemId');

    const index = checklistItems.value.findIndex(item => item.id === itemId);
    
    if (index !== -1) {
        const item = checklistItems.value[index];

        console.log(checklistItems.value[index])

        checklistItems.value[index] = {
            ...item,
            categoryIndex: categoryIndex
        };
        // This replacement triggers reactivity properly
        checklistItems.value = [...checklistItems.value];
    }

    isDragging.value = false;

    // Reset the opacity of the dragged item
    const draggedItem = document.getElementById(`checklist-item-${itemId}`);
    draggedItem.style.opacity = '1';
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
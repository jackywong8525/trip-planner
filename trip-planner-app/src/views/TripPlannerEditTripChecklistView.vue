<template>
    <div class="edit-trip-checklist-container">

    </div>

    <div class="add-checkitem-container">
        <button class="add-checklist-category-button">
            Add Category
        </button>
        <button class="add-checklist-item-button">
            Add Checklist Item
        </button>
    </div>

</template>


<script setup>

</script>

<style scoped>

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
    background-color: var(--SUPP-THEME-COLOR-LIGHT);

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
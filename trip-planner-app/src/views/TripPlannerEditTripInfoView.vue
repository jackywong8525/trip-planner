<template>

<div class="edit-trip-info-container">
    <div class="edit-trip-info-header">
        <div class="edit-trip-info-trip-name">
            {{ props.trip.name }}
        </div>
        <div    
            class="edit-trip-info-trip-created-date">
            created at {{ props.trip.createdAt.slice(0, 10) }}
        </div>
    </div>
    <div class="edit-trip-info-content">
        <div class="edit-trip-info-trip-location-label">
            <img 
                class="edit-trip-info-trip-location-icon"
                src="/icons/location-icon.png">
            Location: 
        </div>
        <div class="edit-trip-info-trip-location-value">
            {{ props.trip.location }}
        </div>
        <div class="edit-trip-info-trip-date-label">
            <img 
                class="edit-trip-info-trip-date-icon"
                src="/icons/calendar-icon.png">
            Date:
        </div>
        <div class="edit-trip-info-trip-date-value">
            {{ props.trip.startDate }} - {{ props.trip.endDate }}
        </div>
        <div class="edit-trip-info-trip-people-label">
            <img 
                class="edit-trip-info-trip-people-icon"
                src="/icons/user-icon.png">
            User: 
        </div>
    </div>
</div>

</template>

<script setup>

const props = defineProps({
    trip: {
        type: Object,
        required: true
    }
})

</script>

<style scoped>

.edit-trip-info-container {
    display: grid;
    grid-template-rows: 1fr 2fr;
    padding: 10px;
}

.edit-trip-info-header,
.edit-trip-info-content {
    margin: 10px;
}

.edit-trip-info-trip-name {
    font-size: 3rem;
    font-weight: 600;
    margin: 10px 20px 0px 20px
}

.edit-trip-info-trip-created-date {
    margin: 0px 20px 10px 20px
}

.edit-trip-info-content {
    display: grid;
    grid-template-columns: 150px 1fr;
    margin: 20px;
}

.edit-trip-info-trip-location-label,
.edit-trip-info-trip-date-label,
.edit-trip-info-trip-people-label {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-trip-info-trip-location-value,
.edit-trip-info-trip-date-value,
.edit-trip-info-trip-people-value {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-trip-info-trip-location-icon,
.edit-trip-info-trip-date-icon,
.edit-trip-info-trip-people-icon {
    width: 30px;
    margin: 10px
}




</style>
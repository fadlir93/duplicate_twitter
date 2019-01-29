<template>
    <div class="ui message" :class="type">
        {{ message }}
    </div>
</template>

<script>
/* eslint-disable */ 
export default {
        name: 'Notification',
        props: {
            message: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
        },
    };
</script>

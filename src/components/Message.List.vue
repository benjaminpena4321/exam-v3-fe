<script setup>

defineProps({
    msgArray: {
        type: Array,
        required: true
    }
})



</script>


<template>
    <div class="list-container">
        <p>This is list</p>
        
        <p v-if="msgArray.length === 0">No data Found</p>

        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="m in msgArray" :key="m._id">
                    <td>{{ m.title }}</td>
                    <td>{{ m.description  }}</td>
                    <td>{{ m.status }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>

.list-container{

}

table {
    width: 100%;
}

</style>
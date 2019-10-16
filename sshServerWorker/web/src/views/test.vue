<template>
    <div>
        {{data[0].exists}}
        <button @click="add()">加加</button>
    </div>   
    
</template>
<script>
export default {
    name:'test',
    data(){
        return {
            data:[
                {exists:true}
            ]
        }
    },
    methods:{
        add(){
            console.log('add2');
            //this.data.exists++;
            this.$set(this.data[0],'exists',!this.data[0].exists);
        }
    }
}
</script>
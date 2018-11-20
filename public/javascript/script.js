/* eslint-disable */

Vue.component('todoItem', {
    props: {
        text: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number,
            default: 0
        }
    },
    template: '\
        \
            <li class="item" \
                v-bind:class="{inactive : !isActive}">\
                    <p class="text">\
                        {{ index }}. {{ text }}\
                    </p>\
                    <div class="controls">\
                    <button class="toggle-btn" v-on:click="$emit(\'toggle\')"  title="Toggle">\
                            <i v-if="isActive" class="fas fa-toggle-off"></i>\
                            <i v-else class="fas fa-toggle-on"></i>\
                    </button>\
                    <button class="delete-btn" v-on:click="$emit(\'remove\')"  title="Delete">\
                            <i class="fas fa-trash-alt"></i>\
                    </button>\
                    </div>\
            </li>\
        '
});


    let app = new Vue({
    el: '#app',
    data: {
        nextTodoText: '',
        nextTodoId: 3,
        showInactive: true,
        todoList: [],
        rowInfo: null,
        loading: false,
        errored: false,
        offset: 15,
        logged: false,
        user: null,
        username: 'kdfepadk'
    },
    methods:{
        addTodo: function(todoText, active = true){

            if(typeof todoText == undefined || typeof todoText == 'object'){
                todoText = this.nextTodoText;
                this.nextTodoText = '';
            }

            this.todoList.push({
                text: todoText.trim(), 
                isActive: active,
                id: this.nextTodoId++
            });

            
        },
        deleteTodo: function(id){
            this.todoList.splice(id, 1);
        },
        toggleTodo: function(id){
            this.todoList[id].isActive = ! this.todoList[id].isActive;
        },
        login: function(){
            this.logged = true;
            this.user = 'Nikita User';
            
            console.log('signed as ', this.user);
        },
        signout: function(){
            this.user = null;
            this.logged = false;
        },
        getNewData: function(amount){
            
            this.loading = true;


            let callback = function(vm, err = true, data = []){
                    // for visualisation
                setTimeout(function(){
                    if(err){
                        vm.loading = false;
                        vm.errored = true;
                        return false;
                    }
                    else{
                        vm.loading = false;
                        vm.rowInfo = data;
                        
                        let from = vm.todoList.length,
                            to   = from + vm.offset;

                        let newData = data.slice(from, to);
                        if(newData.length === 0){
                            vm.loading = false;
                            vm.errored= true;
                        }

                        newData.forEach(function(e) {
                            vm.addTodo(e.title, e.completed);
                        });

                        
                    }
                }, 2000);
            };
            
            this.rowInfo ? callback(this, false, this.rowInfo) : requestData(this, callback);
        },
    
    },
    mounted() {
        
    }
});


let requestData = function(context, cb){
    let data = null;
    let error = false;

    axios
        .get('http://jsonplaceholder.typicode.com/todos')
        .then(response => {
            data = response.data;
        })
        .catch(error => {
            error = true;
        })
        .finally(() => ( cb(context, error, data) ));

}
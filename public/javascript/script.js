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
        nextTodoId: 0,
        showInactive: true,
        todoList: [],

        loginView: false,
        registerView: false,
        logged: false,
        user: {},
        loginForm: {
            login: "",
            password: "",
            infoText: ""
        },
        registerForm: {
            login: "",
            password: "",
            passwordConfirm: "",
            infoText: ""
        }
    },
    computed: {
        loginFormValidation: function(){
            if(this.loginForm.login.length > 0 && this.loginForm.password.length > 0){
                return true;
            }else{
                return false;
            }
        },
        registerFormValidation: function(){
            if(this.registerForm.login.length == 0 && this.registerForm.password.length == 0){
                this.registerForm.infoText = "";
                return false;
            }
            if(this.registerForm.login.length < 3){
                this.registerForm.infoText = "Login length must be at least 3 characters";
                return false;
            }
            if(this.registerForm.password.length < 6){
                this.registerForm.infoText = "The password must be at least 6 characters long";
                return false;
            }
            if(this.registerForm.password !== this.registerForm.passwordConfirm){
                this.registerForm.infoText = "Passwords must be the same";
                return false;
            }

            this.registerForm.infoText = "";
            return true;
        }
    },
    methods:{
        addTodo: function(todoText, active = true, id = null){

            if(typeof todoText == undefined || typeof todoText == 'object'){
                todoText = this.nextTodoText;
                this.nextTodoText = '';
            }

            if(id == null) {
                id = this.nextTodoId++;
            }
            else{
                this.nextTodoId = id + 1;
            }

            this.todoList.push({
                text: todoText.trim(), 
                isActive: active,
                id
            });

            DS.saveData(this.user, this.todoList);
        },
        deleteTodo: function(id){
            this.todoList.splice(id, 1);

            DS.saveData(this.user, this.todoList);
        },
        toggleTodo: function(id){
            this.todoList[id].isActive = ! this.todoList[id].isActive;
            
            DS.saveData(this.user, this.todoList);
        },
        loginFormSubmit: function(){
            console.log(this.loginForm.login);
            console.log(this.loginForm.password);
        },
        registerFormSubmit: function(){
            console.log(this.registerForm.login);
            console.log(this.registerForm.password);
            console.log(this.registerForm.passwordConfirm);
        },
        openLoginForm: function(){
            if( ! this.loginView ){
                this.loginView = true;

                if(this.registerView){
                    this.closeRegisterForm();
                }
            }
            else{
                this.closeLoginForm();
            }
        },
        closeLoginForm: function(){
            this.loginView = false;

            this.loginForm.login = "";
            this.loginForm.password = "";
        },
        openSignInForm: function(){
            if( ! this.registerView ){
                this.registerView = true;

                if(this.loginView){
                    this.closeLoginForm();
                }
            }
            else{   
                this.closeRegisterForm();
            }   
        },
        closeRegisterForm: function(){
            this.registerView = false;

            this.registerForm.login = "";
            this.registerForm.password = "";
            this.registerForm.passwordConfirm = "";
        },
        openTodoView: function(){
            this.closeLoginForm();
            this.closeRegisterForm();
        },
        signout: function(){
            this.user = {};
            this.logged = false;
            this.openTodoView();
        },
    },
    mounted() {
        console.log('mounted');

        // DS.clearStorage();
        let user = DS.getUser();
        DS.getData(user, (dataset) => {

            if(!dataset){
                console.log("Saved todos doesn`t found");
                return;
            }
            if(dataset.data){
                dataset = dataset.data;
            }

            // console.log(dataset);
            for(let i = 0; i < dataset.length; i++){
                this.addTodo(dataset[i].text, dataset[i].isActive, dataset[i].id);
            }
        });
    }
});
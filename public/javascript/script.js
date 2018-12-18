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
        user: {
            name: '',
            id: ''
        },
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
        addTodo: function(todoText, active = true, isnew = true, serverid = ''){

            if(typeof todoText == undefined || typeof todoText == 'object'){
                todoText = this.nextTodoText;
                this.nextTodoText = '';
            }
            
            id = this.nextTodoId++;
            
            this.todoList.push({
                text: todoText.trim(), 
                isActive: active,
                id,
                serverID: serverid,
            });

            DS.saveData(this.user, this.todoList);
            
            if(isnew && this.user && this.user.name) {
                axios.post('/todos/add', {
                    userID: this.user.id,
                    text: todoText
                })
                .then((res) => {
                    console.log('Added sucesfully: ', res);
                    var length = this.todoList.length;
                    this.todoList[length-1]['serverID'] = res.data._id;
                    DS.saveData(this.user, this.todoList);
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        deleteTodo: function(id){
            
            if(this.user && this.user.name) {
                axios.post('/todos/delete', {
                    userID: this.user.id,
                    todoID: this.todoList[id].serverID
                })
                .then((res) => {
                    console.log('Deleted sucesfully: ', res);
                })
                .catch((err) => {
                    console.log(err);
                })
            }

            this.todoList.splice(id, 1);

            DS.saveData(this.user, this.todoList);

        },
        toggleTodo: function(id){
            this.todoList[id].isActive = ! this.todoList[id].isActive;

            DS.saveData(this.user, this.todoList);

            if(this.user && this.user.name) {
                axios.post('/todos/toggle', {
                    userID: this.user.id,
                    todoID: this.todoList[id].serverID
                })
                .then((res) => {
                    console.log('Toggled sucesfully: ', res);
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },

        loginFormSubmit: function(){
            console.log('Sending login req');


            axios.post('/user/login', {
                login: this.loginForm.login,
                password: this.loginForm.password
            })
            .then((res) => {
                console.log(res);
                this.login(res.data);
            })
            .catch((err) => {
                console.log(err);
            })

        },
        registerFormSubmit: function(){
            console.log('Sending reqister req');


            axios.post('/user/register', {
                login: this.registerForm.login,
                password: this.registerForm.password,
                passwordConfirm: this.registerForm.passwordConfirm
            })
            .then((res) => {
                console.log(res);
                this.login(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        },

        login: function(data){
            this.user.name = data.username;
            this.user.id = data._id;
            this.logged = true;

            DS.saveUser(this.user);

            this.openTodoView();

            this.todoList = [];
            for(let i = 0; i < data.todoList.length; i++){
                this.addTodo(data.todoList[i].text, data.todoList[i].visible, false, data.todoList[i]._id);
            }
        },
        signout: function(){

            console.log('signeout ', this.user.name);
            DS.removeData(this.user);
            DS.removeUser();

            this.user = {};
            this.logged = false;
            this.openTodoView();

            
            this.todoList = [];
            DS.getData(null, (dataset) => {

                if(!dataset){
                    console.log("Saved todos doesn`t found");
                    return;
                }
                if(dataset.data) { dataset = dataset.data; }
    
                for(let i = 0; i < dataset.length; i++){
                    this.addTodo(dataset[i].text, dataset[i].isActive, false);
                }
            });
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
    },
    mounted() {

        // DS.clearStorage();
        let user = DS.getUser();
        console.log(user);
        if(user && user.name) {
            this.user.name = user.name;
            this.user.id = user.id;
            this.logged = true;
        }
        DS.getData(user, (dataset) => {

            if(!dataset){
                console.log("Saved todos doesn`t found");
                return;
            }
            if(dataset.data){
                dataset = dataset.data;
            }

            for(let i = 0; i < dataset.length; i++){
                var sId = dataset[i].serverID ? dataset[i].serverID : '';
                this.addTodo(dataset[i].text, dataset[i].isActive, false, sId);
            }
        });
    }
});
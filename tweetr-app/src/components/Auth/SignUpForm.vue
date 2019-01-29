<template>
    <div class="ui stackable three column centered grid container">
        <div class="column">
            <h2 class="ui dividing header">Sign up, it's free!</h2>

            <Notification
                :message="notification.message"
                :type="notification.type"
                v-if="notification.message"
            />

            <form class="ui form" @submit.prevent="signup">
                <div class="field" :class="{error: errors.has('name')}">
                    <label>Full name</label>
                    <input type="text" name="name" v-model="name" v-validate="'required'" placeholder="Full Name">
                    <span v-show="errors.has('name')" class="is-danger">{{ errors.first('name')}}</span>
                </div>

                <div class="field" :class="{error: errors.has('username')}">
                    <label>Username</label>
                    <input type="text" name="username" :class="{'input': true, 'is-danger': errors.has('username')}" v-model="username" v-validate="'required'" placeholder="Username">
                    <span v-show="errors.has('username')" class="is-danger">{{ errors.first('username')}}</span>
                </div>

                <div class="field" :class="{ error: errors.has('email')}">
                    <label>Email</label>
                    <input type="text" name="email" :class="{'input': true, 'is-danger': errors.has('email')}" v-model="email" v-validate="'required'" placeholder="Email">
                    <span v-show="errors.has('email')" class="is-danger">{{ errors.first('email')}}</span>
                </div>

                <div class="field" :class="{ error: errors.has('password')}">
                    <label>Password</label>
                    <input type="password" name="password" :class="{'input': true, 'is-danger': errors.has('password')}" v-model="password" v-validation="'required'" placeholder="Password">
                    <span v-show="errors.has('password')" class="is-danger">{{ errors.first('password')}}</span>
                </div>

                <button class="fluid ui primary button" :disabled="!isFormValid">SIGN UP</button>

                <div class="ui hidden divider"></div>
            </form>
            <div class="ui divider"></div>
            <div class="ui column grid">
                <div class="center aligned column">
                    <p>
                        Got an Account? <router-link to="/login">Log-in</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */ 
    import Notification from '@/components/Notification';

    export default{
        name: 'SignUpForm',
        components: {
            Notification,
        },
        data() {
            return {
                name: '',
                username: '',
                email: '',
                password: '',
                notification: {
                    message: '',
                    type: '',
                },
            };
        },
        computed: {
            isFormValid(){
                return Object.keys(this.fields).every(key => this.fields[key].valid);
            },
        },
        beforeRouteEnter(to, from, next) {
            const token = localStorage.getItem('tweetr-token');
            return token ? next('/') : next();
        },
        methods: {
            signup() {
                axios
                    .post('/signup', {
                        name: this.name,
                        username: this.username,
                        email: this.email,
                        password: this.password,
                    })
                    .then(response => {
                        //Save Token in localstorage
                        localStorage.setItem('tweetr-token', response.data.data.token);
                        //redirect to user home
                        this.$router.push('/');
                    })
                    .catch(error => {
                        //display error notification
                        this.notification = Object.assign({}, this.notification, {
                            message: error.reponse.data.message,
                            type: error.response.data.status,
                        });
                    });
            },
        },
    };
</script>

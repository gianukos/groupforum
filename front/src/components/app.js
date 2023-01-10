import InputEml from "./InputEml.js";
import InputPwd from "./InputPwd.js";
const appMain = `
		<div id="headerNavMenu" >
			<nav class="welcome" v-show="navLogin">
				<a @click="showLogin()" href="#login">login</a>
				<a @click="showSignup()" href="#signup">sign up</a>
			</nav>
			<nav class="welcome" v-show="!navLogin">
				<a @click="showEdit()" href="#user">profile</a>
				<a @click="logout" href="#">sign out</a>
			</nav>
		</div>
		<section id="login" class="userInfo" >
		<form v-show="route('login')" @submit.prevent novalidate="true">
			<div class="input"> 
				<h3>Login</h3>
				<input :required="true" v-if="emailAddress" type="email" id="email" name="emailAddress" :value="emailAddress"  />
				<input :required="true" v-else type="email" placeholder="Enter your email address" name="emailAddress" v-model.lazy="emailAddress"  />
				<input :required="true" type="password" placeholder="Enter a password" name="pwd" v-model="inputPass"/>
				<input type="button" class="submit" @click="submitLogin(validEmail(emailAddress), checkPass(inputPass))&&postLogin(emailAddress, inputPass)" value="Submit" />
				<InputEml v-show=emailError></InputEml>
				<InputPwd v-show=pwdError></InputPwd>
				<div><p id="loginErr"></p></div>
			</div>
		</form>
		</section>
		<section id="signup" class="userInfo">
		<form v-show="route('signup')" method="post">
			<div class="input">
				<h3>Sign up</h3>
				<input type="email" name="email"  v-model="emailAddress" placeholder="Enter your email address"  required />
				<input type="password" placeholder="Enter a password" name="pwd" v-model="inputPass" required />
				<input type="button" class="submit"  @click="submitSignup(validEmail(emailAddress), checkPass(inputPass))&&postSignup(emailAddress, inputPass)" value="Submit"/>
				<InputEml v-show=emailError></InputEml>
				<InputPwd v-show=pwdError></InputPwd>
				<div><p id="signupErr"></p></div>
			</div>
		</form>
		</section>
		<section id="newuser" class="userInfo">
		<div class="input" v-show="route('newuser')">
			<p>Your login: <span>{{emailAddress}}</span></p>
			<h4>Welcome!</h4>
			<div class="firstmsg">
				<p>You have just signed into the <strong>Groupomania</strong> web forum for the first time.  Use the app to post links
				to articles and information on the web of interest to your colleagues at <strong>Groupomania</strong>.</p>
				<p>Post commentary prepared by yourself about any topic.  On the home page after login will appear recent posts not yet viewed.  
				There will also be access to current information about your account.</p>
			</div>
			<input type="button" class="button" @click="showLogin" value="Login" />
		</div>
		</section>
		<section id="user" class="userInfo">
			<div>
				<div v-if="route('profile')">
					<div>
						<input type="text" placeholder="first name">
						<input type="text" placeholder="last name">
					</div>
				</div>
				<div v-else>
					<div v-if="!(route('login')|route('signup')|route('newuser'))">
						<input type="button" class="button" @click="showCreate" value="Create a post" />
						<input type="button" class="button" @click="showPosts" value="Read group posts" />
					</div>
				</div>
				<div v-show="route('onlogin')" class="input">
					<p>{{onwelcome}}{{emailAddress}}</p>
				</div>
			</div>
		</section>
	`;

export default {
	name: 'appMain',
	components: {
		InputPwd,
		InputEml
	},
	data() {
		return{
		appName: 'web forum',
		endpoint: 'http://localhost:3000/api',						
		emailError: false,
		pwdError: false,
		navLogin: true,
		emailAddress: '',
		inputPass: '',
		router: [],
		}
	},
	methods: {
		view(){
			return this.router.length - 1;
		},
		route(section){
			return this.router[this.view()] === section ? true : false ;
		},
		showLogin(){							
			this.router.push("login");
		},
		showSignup(){							
			this.router.push("signup");
		},
		showEdit(){
			this.router.push("profile");
		},
		showCreate(){
			if (!sessionStorage.getItem("sessionUser")){
				this.router.push("login");
			}
		},
		showPosts(){
			if (!sessionStorage.getItem("sessionUser")){
				this.router.push("login");
			}
		},
		onSignup(){							
			this.router.push("newuser")
		},
		onLogin(){
			this.router.push("onlogin")
			this.navLogin = false;
		},
		submitSignup(e, p) {
			if ( e && p ){								
				return true;
			} else {
				if ( !e) { 
					this.emailError = true;
					this.emailAddress = ""; 
				} else {
					this.emailError = false;
					this.pwdError = true;
					this.inputPass = "";
				}
				return false;
			}
		},
		submitLogin( e, p ) {
			if ( e && p ){								
				return true;
			} else {
				if ( !e) { 
					this.emailError = true;
					this.emailAddress = "";
				} else {
					this.emailError = false;
					this.pwdError = true;
					this.inputPass = "";
				}
				return false;
			}
		},
		validEmail(email) {
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},
		checkPass(password) {
			if ( password.length < 7 ) {
				this.pwdError = true;
				return false;
			} else {
				this.pwdError = false;
				return true;
			}
		},
		logout(){
			var storedUser = sessionStorage.getItem("sessionUser")
			sessionStorage.removeItem("sessionUser")
			sessionStorage.removeItem("sessionToken")
			sessionStorage.removeItem("eaddr")
			window.location.href = window.location.origin + "/index.html";
			setTimeout(console.log(this.appName + " has restarted   [" + storedUser + " log out]" ), 7500)
			storedUser = null
		},
		postSignup(emailParam, passwordParam){
			var dataStr = `{"name":"", "email":"${emailParam}", "password":"${passwordParam}", "bio":"" }`;
			const signupParams = JSON.parse(dataStr);
			const requestOpts = { method:"POST",  headers:{"Content-Type":"application/json"}, body:JSON.stringify(signupParams)};
			console.log(requestOpts.body)
			fetch(this.endpoint + "/auth/signup", requestOpts)
				.then(response => response.text()) 					
				.then((responseAddr) => {
					if ( responseAddr === '"' + this.emailAddress + '"'){										
						this.onSignup();
					}else{										
						this.route("signup")||this.showSignup();
						if (responseAddr === '\"registered user\"'){
							document.getElementById('signupErr').innerText = this.emailAddress + " is already signed up!";
						}
					}
				}) 								
				.catch(	(error) => {
					return false
				} 
			)
		},
		postLogin(emailParam, passwordParam){
			var dataStr = `{ "email":"${emailParam}", "password":"${passwordParam}" }`;
			const loginParams = JSON.parse(dataStr);
			const requestOpts = { method:"POST",  headers:{"Content-Type":"application/json"}, body:JSON.stringify(loginParams)};
			(async () => {
				const response = await fetch(this.endpoint + "/auth/login", requestOpts).catch(	(error) => { return false })
				if ( response.status === 200 ){									
					this.onLogin();
					const auth = await response.json();
					sessionStorage.setItem("sessionUser", auth.userId)
					sessionStorage.setItem("sessionToken", auth.token)
					sessionStorage.setItem("eaddr", this.emailAddress)
							
				}else{
					this.route("login")||this.showLogin()
					if (response.status === 401 ){
						this.inputPass = "";
						this.emailAddress = "";
						document.getElementById('loginErr').innerText = "Please try again :  " +  response.statusText;
					}
					return false;
				}
			})(); 
		}
	},
	computed: {
		onwelcome: function(){	
			return ("Logged in as ")
		}
	},
	template: appMain
};

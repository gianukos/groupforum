import InputEml from "./InputEml.js";
import InputPwd from "./InputPwd.js";
const appMain = `
		<div id="headerNavMenu" >
			<nav class="welcome" v-show="navLogin">
				<a @click="showLogin()" href="#login">login</a>
				<a @click="showSignup()" href="#signup">sign up</a>
			</nav>
			<nav class="welcome" v-show="!navLogin">
				<a @click="profileExists() && showEdit()" href="#user">profile</a>
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
			<p>New account created</p>
			<p>Login: <span>{{emailAddress}}</span></p>
			<h4>Welcome!</h4>
			<input type="button" class="button" @click="showLogin" value="Login" />
		</div>
		</section>
		<section id="user" class="userInfo">
		<div>
		<div v-if="route('profile')">
		<form type="submit">
			<div class="input">
				<h3>Edit profile<br>____________</h3>
				<h4 class="edit">Your name</h4>
				<p>current name: <span>{{profile.name}}</span></p>
				<input v-model="edit.name" type="text" placeholder="Give yourself a username">
				<h4 class="edit">Your story</h4>
				<p>current bio: <br><span>{{profile.bio}}</span></p>
				<div>
					<textarea v-model="edit.bio" name="bio" id="bio" label="bio" placeholder="Include some information about yourself." spellcheck="true" rows="8" cols="70"></textarea><br>
					<div><input type="button" class="submit" value="submit" @click="setProfile(edit.name, edit.bio)" /><input type="button" class="submit noedit" value="cancel edit" @click="getEaddr()&&onLogin()"/></div>
				</div>
				<h4 class="edit">Delete your account</h4>
				<div>
					<input type="button"  class="submit" value="Delete account" @click="router.push('delete')"/>
				</div>
			</div>
		</form>
		</div>
		<div v-else>
			<div v-show="!(route('login')||route('signup')||route('newuser')||route('delete'))" class="forumControls">
				<input type="button" class="button" @click="showCreate" value="Create a post" />
				<input type="button" class="button" @click="showPosts" value="Read group posts" />
			</div>
		</div>
		</div>
		<div v-show="route('delete')">
			<div class="delete input">
				<p>Is this "goodbye"?</p>
				<input type="button"  class="submit" value="Yes, do it." @click="profileExists(false)"/>
				<input type="button"  class="submit" value="Maybe not." @click="getEaddr()&&onLogin()"/>
				<p id="accountClosed"></p>
			</div>
		</div>
		<div v-show="route('onlogin')" class="input">
			<p>{{onwelcome}}{{emailAddress}}</p>
			<div><p id="dbresult"></p></div>
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
		edit: {name:'', bio:''},
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
		getEaddr(){
			if (this.emailAddress == ""){
				this.emailAddress = sessionStorage.getItem('eaddr');
			}
			return true;
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
			sessionStorage.clear();
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
		},
		setProfile(nameParam, bioParam){
			var dataStr = `{ "name":"${nameParam}", "bio":"${bioParam}" }`;
			const userID = sessionStorage.getItem('sessionUser');
			const userToken = sessionStorage.getItem('sessionToken');
			const userParams = JSON.parse(dataStr);
			const requestOpts = { method:"PUT",  headers:{"Content-Type":"application/json"},  Authorization: "Bearer " + userToken, body:JSON.stringify(userParams)};
			(async () => {
				const response = await fetch(this.endpoint + '/auth/' + userID, requestOpts).catch(	(error) => { return false })
				if ( response.status === 200 ){
					localStorage.setItem("userName", nameParam); 
					localStorage.setItem("userBio",  bioParam);
					this.profile = userID + '###' + nameParam + '###' + bioParam;
					this.onLogin();
					this.emailAddress = sessionStorage.getItem('eaddr');
					document.getElementById('dbresult').innerText = "Profile updated!"
					
				}else{
					document.getElementById('dbresult').innerText = "Please try again :  " +  response.statusText;
				}
			})();
		},
		profileExists(state=true){
			const userID = sessionStorage.getItem('sessionUser');
			const userToken = sessionStorage.getItem('sessionToken');
			var method = "";
			method = state ? "GET" : "DELETE";
			const requestOpts = { method:method, headers:{Authorization: "Bearer " + userToken} };
			(async () => {
				const response = await fetch(this.endpoint + '/auth/' + userID, requestOpts).catch(	(error) => { return false })
				if ( response.status === 200  ){
					if ( state === true ){
						const auth = await response.json();
						localStorage.setItem("userName", auth.Name);
						localStorage.setItem("userBio",  auth.Bio);
						this.edit.name = '';
						this.edit.bio = '';
						this.profile = userID + '###' + auth.Name + '###' + auth.Bio ;
					} else {
						setTimeout(this.logout(), 15000)
						document.getElementById("accountClosed").innerText = "Account is deleted.  About to signout of the app."
						localStorage.clear();
					}
				}else{
					if ( state === true ){
						console.log( `could not retrieve name and bio for ${userID}`)
					} else {
						this.showEdit();
						document.getElementById('dbresult').innerText = "Unable to delete account :  " +  response.statusText;
					}					
				}					
			})();
			return true;
		}
	},
	computed: {
		onwelcome: function(){	
			return ("Logged in as ")
		},
		profile: {
			get(){
				var id = sessionStorage.getItem("sessionUser");
				var name = localStorage.getItem("userName");
				var bio = localStorage.getItem("userBio");
				// replace null value with string
				if(typeof(name)==='object'){name = 'none'};
				if(typeof(bio)==='object'){bio = 'none'};
				this.id = id; this.name = name; this.bio = bio;
				return this;
			},
			set(newValue){
				[this.id, this.name, this.bio] = newValue.split('###');
				console.log(this.name);
			}
		},
	},
	template: appMain
};

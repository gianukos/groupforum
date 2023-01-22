import Main from "./Main.js";
import InputEml from "./InputEml.js";
import InputPwd from "./InputPwd.js";
import CreatePosts from "./CreatePosts.js";
import ReadPosts from "./ReadPosts.js";

const appMain = Main.template;

export default {
	name: 'App',
	components: {
		InputPwd,
		InputEml,
		CreatePosts,
		ReadPosts
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
		encInput: '',
		edit: {name:'', bio:''},
		router: ['home']
		}
	},
	methods: {
		view(){
			return this.router.length - 1;
		},
		route(section){
			return this.router[this.view()] === section ? true : false ;
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
		showLogin(){
			if (!sessionStorage.getItem("sessionUser")){
				this.router.push("login");
			}							
		},
		showSignup(){							
			this.router.push("signup");
		},
		showEdit(){
			this.router.push("profile");
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
			const requestOpts = { method:"PUT",  headers:{"Content-Type":"application/json",  "Authorization": "Bearer " + userToken}, body:JSON.stringify(userParams)};
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
			const requestOpts = { method:method,  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
			(async () => {
				const response = await fetch(this.endpoint + '/auth/' + userID, requestOpts).catch(	(error) => { return false })
				if ( response.status === 200  ){
					if ( state === true ){
						const auth = await response.json();
						localStorage.setItem("userName", auth.Name);
						localStorage.setItem("userBio",  auth.Bio);
						this.edit.name = auth.Name;
						this.edit.bio = auth.Bio;
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
						this.onLogin();
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
				if(typeof(name)==='object' || name === '' ){name = 'none'
				};
				if(typeof(bio)==='object'|| bio === '' ){bio = 'none'
				};
				this.id = id; this.bio = bio; this.name = name;
				return this;
			},
			set(newValue){
				[this.id, this.name, this.bio] = newValue.split('###');
				this.bio === '' ? this.bio = 'none' : false;
				this.name === '' ? this.name = 'none' : false;
			}
		},
	},
	mounted() {
		if (sessionStorage.getItem("sessionUser")&&this.emailAddress===''){
			// page properties reloaded when user is logged in 
			document.getElementsByClassName("welcome")[0].style.display  = 'none';
			document.getElementsByClassName("welcome")[1].style.display  = 'flex';	
			document.getElementById('user').style.display='flex';
			this.router.push('onlogin');
			this.emailAddress = sessionStorage.getItem('eaddr');
		}
	},
	template: appMain
};

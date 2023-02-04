import Main from "./Main.js";
import InputEml from "./InputEml.js";
import InputPwd from "./InputPwd.js";
import ForumButtons from "./ForumButtons.js";
import ScrollButton from "./ScrollButton.js";

const appMain = Main.template;

export default {
	name: 'App',
	components: {
		InputPwd,
		InputEml,
		ForumButtons,
		ScrollButton
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
		showLogin(){
			if (!this.profile.id){
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
			let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
			let storedUser = sessionStorage.getItem("sessionUser") 
			sessionStorage.clear();
			window.location.href = window.location.origin + "/index.html";
			setTimeout(console.log(this.appName + " has restarted   [" + storedUser + " log out]" ), 7500)
			storedUser = null
		},
		postSignup(emailParam, passwordParam){
			let dataStr = `{"name":"", "email":"${emailParam}", "password":"${passwordParam}", "bio":"" }`;
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
			let dataStr = `{ "email":"${emailParam}", "password":"${passwordParam}" }`;
			const loginParams = JSON.parse(dataStr);
			const requestOpts = { method:"POST",  headers:{"Content-Type":"application/json"}, body:JSON.stringify(loginParams)};
			(async () => {
				const response = await fetch(this.endpoint + "/auth/login", requestOpts).catch(	(error) => { return false })
				if ( response.status === 200 ){							
					const auth = await response.json();
					this.profile = auth.userId + '###' + auth.name + '###' + auth.bio;		
					sessionStorage.setItem("sessionUser", auth.userId)
					sessionStorage.setItem("sessionToken", auth.token)
					sessionStorage.setItem("eaddr", this.emailAddress)
					this.onLogin();
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
			let dataStr = `{ "name":"${nameParam}", "bio":"${bioParam}" }`;
			const userID = sessionStorage.getItem('sessionUser');
			const userToken = sessionStorage.getItem('sessionToken');
			const userParams = JSON.parse(dataStr);
			const requestOpts = { method:"PUT",  headers:{"Content-Type":"application/json",  "Authorization": "Bearer " + userToken}, body:JSON.stringify(userParams)};
			(async () => {
				const response = await fetch(this.endpoint + '/auth/' + userID, requestOpts).catch(	(error) => { return false })
				if ( response.status === 200 ){
					if (! localStorage.getItem(userID) ){
						localStorage.setItem( userID, JSON.stringify( {uid:{}} ))
					}
					const luser = JSON.parse(localStorage.getItem(userID));
					luser.uid.userName = nameParam;
					luser.uid.userBio = bioParam;
					localStorage.setItem(userID, JSON.stringify(luser));
					this.edit.name = nameParam;
					this.edit.bio = bioParam;
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
			let method = "";
			method = state ? "GET" : "DELETE";
			const requestOpts = { method:method,  headers:{"Content-Type":"x-www-form-urlencoded", "Authorization": "Bearer " + userToken}};
			(async () => {
				const response = await fetch(this.endpoint + '/auth/' + userID, requestOpts).catch(	(error) => { return false })
				if ( response.status === 200  ){
					if ( state === true ){
						const auth = await response.json();
						if (! localStorage.getItem(userID) ){
							localStorage.setItem( userID, JSON.stringify( {uid:{}} ))
						}
						const luser = JSON.parse(localStorage.getItem(userID));
						luser.uid.userName = auth.Name;
						luser.uid.userBio = auth.Bio;
						localStorage.setItem(userID, JSON.stringify(luser));
						this.edit.name = auth.Name;
						this.edit.bio = auth.Bio;
						this.profile = userID + '###' + auth.Name + '###' + auth.Bio ;
					} else {
						setTimeout(this.logout(), 15000)
						document.getElementById("accountClosed").innerText = "Account is deleted.  About to signout of the app."
						localStorage.removeItem(userID);
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
				let id = sessionStorage.getItem("sessionUser");
				if(typeof(id) !== 'object' && typeof(localStorage.getItem(id)) !== 'object'){
					let localID = localStorage.getItem(id);
					let pname = JSON.parse(localID).uid.userName;
					let bio = JSON.parse(localID).uid.userBio;	
					this.id = id; this.bio = bio; this.pname = pname;			
				} else {
					let pname = '';
					let bio = '';
					this.id = id; this.bio = bio; this.pname = pname;
				}
				// replace null value with string
				this.bio === '' ? this.bio = 'none' : false;
				this.pname === '' ? this.pname = 'none' : false;
				this.id = id;
				return this;
			},
			set(newValue){
				[this.id, this.pname, this.bio] = newValue.split('###');
				this.bio === '' ? this.bio = 'none' : false;
				this.pname === '' ? this.pname = 'none' : false;
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

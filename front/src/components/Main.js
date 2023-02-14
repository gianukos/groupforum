export default {
    name: 'Main',
    template: `
    <div id="headerNavMenu" role="navigation">
      <nav class="welcome" v-show="navLogin" aria-label="login">
        <a @click="showLogin()" href="#login">login</a>
        <a @click="showSignup()" href="#signup">sign up</a>
      </nav>
      <nav class="welcome" v-show="!navLogin" aria-label="logout">
        <a @click="profileExists()&&showEdit()" href="#user">profile</a>
        <a @click="logout" href="#">sign out</a>
      </nav>
    </div>
    <section id="login" class="userInfo">
      <form v-show="route('login')" @submit.prevent novalidate="true">
        <div class="input" aria-describedby="email">
          <h3>Login</h3>
          <input
            :required="true"
            v-if="emailAddress"
            type="email"
            class="email"
            autocomplete="email"
            id="email"
            name="emailAddress"
            :value="emailAddress"
          />
          <input
            :required="true"
            v-else
            type="email"
            class="email"
            autocomplete="email"
            placeholder="Enter your email address"
            name="emailAddress"
            v-model.lazy="emailAddress"
          />
          <input
            :required="true"
            type="password"
            class="password"
            autocomplete="current-password"
            placeholder="Enter a password"
            name="pwd"
            v-model="inputPass"
          />
          <input
            type="button"
            class="submit"
            @click="submitLogin(validEmail(emailAddress), checkPass(inputPass))&&postLogin(emailAddress, inputPass)"
            value="Submit"
          />
          <InputEml v-show="emailError"></InputEml>
          <InputPwd v-show="pwdError"></InputPwd>
          <div><p id="loginErr"></p></div>
        </div>
      </form>
    </section>
    <section id="signup" class="userInfo">
      <form v-show="route('signup')" method="post">
        <div class="input">
          <h3>Sign up</h3>
          <input
            type="email"
            class="email"
            autocomplete="email"
            name="email"
            v-model="emailAddress"
            placeholder="Enter your email address"
            required
          />
          <input
            type="password"
            class="password"
            autocomplete="new-password"
            placeholder="Enter a password"
            name="pwd"
            v-model="inputPass"
            required
          />
          <input
            type="button"
            class="submit"
            @click="submitSignup(validEmail(emailAddress), checkPass(inputPass))&&postSignup(emailAddress, inputPass)"
            value="Submit"
          />
          <InputEml v-show="emailError"></InputEml>
          <InputPwd v-show="pwdError"></InputPwd>
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
              <h3>Edit profile<br />____________</h3>
              <h4 class="edit">Your name</h4>
              <p>current name: <span>{{profile.pname}}</span></p>
              <input
                v-model="edit.name"
                type="text"
                placeholder="Give yourself a username"
              />
              <h4 class="edit">Your story</h4>
              <p>current bio: <br /><span>{{profile.bio}}</span></p>
              <div>
                <textarea
                  v-model="edit.bio"
                  name="bio"
                  id="bio"
                  label="bio"
                  placeholder="Include some information about yourself."
                  spellcheck="true"
                  rows="8"
                  cols="70"
                ></textarea
                ><br />
              </div>
              <div>
                <input
                  type="button"
                  class="submit"
                  value="submit"
                  @click="setProfile(edit.name, edit.bio)"
                />
              </div>
            </div>
          </form>
          <div class="input">
            <div>
              <input
                type="button"
                class="submit noedit"
                value="cancel edit"
                @click="getEaddr()&&onLogin()"
              />
            </div>
            <div><h4 class="edit">Delete your account</h4></div>
            <div>
              <input
                type="button"
                class="submit"
                value="Delete account"
                @click="router.push('delete')"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div
            v-show="!(route('login')||route('signup')||route('newuser')||route('delete')||route('home'))"
            class="forumsections"
            id="forumsections"
          >
            <ForumButtons :userID="profile.id" :userName="profile.pname"></ForumButtons>
          </div>
        </div>
      </div>
      <div v-show="route('delete')">
        <div class="delete input">
          <p>Is this "goodbye"?</p>
          <input
            type="button"
            class="submit"
            value="Yes, do it."
            @click="profileExists(false)"
          />
          <input
            type="button"
            class="submit"
            value="Maybe not."
            @click="getEaddr()&&onLogin()"
          />
          <p id="accountClosed"></p>
        </div>
      </div>
      <div v-show="route('onlogin')" class="input">
        <p>{{onwelcome}}{{emailAddress}}</p>
        <div><p id="dbresult"></p></div>
      </div>
    </section>
    <ScrollButton></ScrollButton>
`
}
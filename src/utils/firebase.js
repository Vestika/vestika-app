import { auth, persistence, usersCollection } from "../firebase.js";

export async function FireSignin({ email, password }) {
  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    if (!user.emailVerified) {
      throw new Error("Email is not yet verified");
    }
    return user;
  } catch (error) {
    console.error("Firebase signin error:");
    console.error(error);
    throw error;
  }
}

export async function FireSignup({ email, username, password }) {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    await usersCollection.doc(user.uid).set({
      username,
    });
    user
      .sendEmailVerification()
      .then(function() {
        console.log("verification mail sent");
        return user;
      })
      .catch(function(error) {
        console.error("Firebase signup error:");
        console.error(error);
        throw error;
      });
  } catch (error) {
    console.error("Firebase signup error:");
    console.error(error);
    throw error;
  }
}
export async function FireSignUpAnonymous({ email, username, password }) {
  try {
    const firebase = require("firebase");
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password,
    );
    auth.currentUser
      .linkWithCredential(credential)
      .then(function(usercred) {
        var user = usercred.user;
        console.log("Anonymous account successfully upgraded", user);
        usersCollection.doc(user.uid).set({
          username,
        });
      })
      .catch(function(error) {
        console.log("Error upgrading anonymous account", error);
      });
  } catch (error) {
    console.error("Firebase signup anonymous error:");
    console.error(error);
    throw error;
  }
}

export async function FireSigninGuest() {
  try {
    const { user } = await auth.signInAnonymously();
    return user;
  } catch (error) {
    console.error("Firebase signin error:");
    console.error(error);
    throw error;
  }
}

export async function FireForgotPassword({ email }) {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error) {
    console.error("Firebase auth error:");
    console.error(error);
    throw error;
  }
}

export async function FireSignout() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Firebase signout error:");
    console.error(error);
    throw error;
  }
}

export async function FireGetToken() {
  return await auth.currentUser.getIdToken(/* forceRefresh */ true);
}

export async function FireHandleRememberMe(isRememberMeChecked) {
  try {
    if (!isRememberMeChecked) {
      await auth.setPersistence(persistence.SESSION);
      console.log("Login: OK, clear session when window is closed.");
    } else {
      await auth.setPersistence(persistence.LOCAL);
      console.log("Login: OK, keep session even when window is closed.");
    }
  } catch (error) {
    console.error("Login: Failed.", error);
    throw error;
  }
}

export async function FireGetUser() {
  try {
    const user = await auth.currentUser;
    return user;
  } catch (error) {
    console.error("Firebase database error:");
    console.error(error);
    throw error;
  }
}

export async function FireIsCurrentUserAnonymous() {
  try {
    const user = await FireGetUser();
    if (user) {
      return user.isAnonymous;
    }
    return null;
  } catch (error) {
    console.error("Firebase database error:");
    console.error(error);
    throw error;
  }
}

export async function FireDeleteUser() {
  const user = auth.currentUser;

  try {
    await user.delete();
  } catch (error) {
    console.log("Delete user wasn't successful.");
    console.log(error);
    throw error;
  }
}

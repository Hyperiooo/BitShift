
document.addEventListener("DOMContentLoaded", async function (event) {
	var signUpForm = document.querySelector("#sign-up");
	signUpForm.onsubmit = signUpSubmitted;

	var logInForm = document.querySelector("#log-in");
	logInForm.onsubmit = logInSubmitted;

	var logoutButton = document.querySelector("#logout-button");
	logoutButton.onclick = logoutSubmitted;
	await console.log(supabase.auth);
});
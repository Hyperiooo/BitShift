document.addEventListener("DOMContentLoaded", async function (event) {
	var signUpForm = document.querySelector("#sign-up");
	if (signUpForm) signUpForm.onsubmit = signUpSubmitted;

	var logInForm = document.querySelector("#log-in");
	if (logInForm) logInForm.onsubmit = logInSubmitted;

	var logoutButton = document.querySelector("#logout-button");
	logoutButton.onclick = logoutSubmitted;
	await console.log(supabase.auth);
});
window.addEventListener("load", async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) {
		window.location.href = "/";
	}
});

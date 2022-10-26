var SUPABASE_URL = "https://kvoplpydhaztlmhnednq.supabase.co";
var SUPABASE_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2b3BscHlkaGF6dGxtaG5lZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQwNDY3ODUsImV4cCI6MTk3OTYyMjc4NX0.IRkGNQij4cSJwCxrpNd7XA1qOipX869bpz7Rqz5tGCs";

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.userToken = null;
var allLoadedProjects = [];
var currentUser

document.addEventListener("DOMContentLoaded", async function (event) {
	var signUpForm = document.querySelector("#sign-up");
	signUpForm.onsubmit = signUpSubmitted;

	var logInForm = document.querySelector("#log-in");
	logInForm.onsubmit = logInSubmitted;

	var logoutButton = document.querySelector("#logout-button");
	logoutButton.onclick = logoutSubmitted;
	await console.log(supabase.auth)
});
supabase.auth.onAuthStateChange(async (event, session) => {
	if (event == "SIGNED_IN") {


	}
	const { data: { user } } = await supabase.auth.getUser()
	currentUser = user
	refreshList();
	
});
async function refreshList() {
	console.log("a");
	var projects = document.getElementById("projects");
	//query for all projects in cities by owner id
	projects.innerHTML = `<div class="loader-5 center"><span></span></div>`;
	if (!currentUser) {
		projects.innerHTML = "no projects. create one!";
		return;
	}
	var { data, err } = await supabase
		.from("cities")
		.select()
		.eq("owner", currentUser.id)
		.order("updated_at", { ascending: true });
	if (data) {
		allLoadedProjects = data;
		projects.innerHTML = ``;
		data.reverse().forEach((e, i) => {
			projects.innerHTML +=
				`<div class='project' style='animation-delay: ${i * 0.02}s'>` +
				e.name +
				" " +
				e.id +
				" updated at:" +
				new Date(e.updated_at) +
				"<br>" +
				"</div>";
		});
	}
}

const signUpSubmitted = (event) => {
	event.preventDefault();
	const email = event.target[0].value;
	const password = event.target[1].value;

	supabase.auth
		.signUp({ email, password })
		.then((response) => {
			response.error ? notify.log(response.error.message) : setToken(response);
		})
		.catch((err) => {
			alert(err);
		});
};

notify = new Alrt({
	position: "top-center",
	duration: 2000, //default duration
	theme: "bitshift-confirmation",
	behavior: "overwrite",
});
const logInSubmitted = (event) => {
	event.preventDefault();
	const email = event.target[0].value;
	const password = event.target[1].value;

	supabase.auth
		.signInWithPassword({ email, password })
		.then((response) => {
			notify.log("signedin")
			console.log(response.error ?"z" : "b")
			response.error ? notify.log(response.error.message) : setToken(response);
		})
		.catch((err) => {
			notify.log(err.response.text);
		});
};

const fetchUserDetails = () => {
	notify.log(JSON.stringify(currentUser));
};

const logoutSubmitted = (event) => {
	event.preventDefault();

	supabase.auth
		.signOut()
		.then((_response) => {
			document.querySelector("#access-token").value = "";
			document.querySelector("#refresh-token").value = "";
			notify.log("Logout successful");
		})
		.catch((err) => {
			notify.log(err.response.text);
		});
	refreshList();
};

async function setToken(response) {
	if (response.data.user.confirmation_sent_at && !response?.data?.session?.access_token) {
		notify.log("Confirmation Email Sent");
	} else {
		document.querySelector("#access-token").value =
			response.data.session.access_token;
		document.querySelector("#refresh-token").value =
			response.data.session.refresh_token;
		notify.log("Logged in as " + response.data.user.email);
		const { data, error } = await supabase
			.from("users")
			.insert(
				[{ id: response.data.user.id, last_access: new Date().toISOString() }],
				{
					upsert: true,
				}
			);
		if (error) {
			console.log(error);
		}
	}
}

async function newProject() {
	const { data, error } = await supabase.from("cities").insert([
		{
			id: crypto.randomUUID(),
			name: "Untitled " + (allLoadedProjects.length + 1),
			country_id: 554,
			owner: currentUser.id,
			updated_at: new Date().toISOString(),
		},
	]);
	if (error) {
		console.log(error);
	}
	if (data) {
		allLoadedProjects.push(data[0]);
	}
	refreshList();
}
async function updateProject(id, dat) {
	const { data, error } = await supabase.from("cities").update([
		{
			id: allLoadedProjects[0].id,
			updated_at: new Date().toISOString(),
		},
	]);
	if (error) console.log(error);
	refreshList();
}
//loading logic: onload, detect all of the currently locally saved projects, and compare their timestamps to the hosted projects.
//If the hosted projects are newer, download them. If the locally saved projects are newer, upload them. If they are the same, do nothing.
//If the user has no projects, download all of the projects from the server.
//If the user has no internet connection, load the locally saved projects.

//current idea: on load, download all projects from the server. Duplicate this array to a temp array, then, for each localstorage project,
//check if it exists on the server. If it exists on the server, see which version is newer. If server is newer, do nothing to temp array.
//If local is newer, replace the server version with the local version in the temp array. If it doesn't exist on the server, add it to the temp array.
//Then, upload the temp array to the server.

//saving logic: when the user saves a project, upload it to the server. If the user has no internet connection, save it locally.
//do all of the saving logic in the background, so that the user can continue to work on the project.
//save every 5 minutes, or when the user closes the tab. If the user has no internet connection, save every 30 seconds.
// when you close the tab, save the project locally so that when you reopen the tab, you can load the newer, local project.

window.addEventListener("load", function (e) {
	//load the projects
	refreshList();
});

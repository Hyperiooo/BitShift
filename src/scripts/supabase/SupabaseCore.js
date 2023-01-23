var SUPABASE_URL = "https://kvoplpydhaztlmhnednq.supabase.co";
var SUPABASE_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2b3BscHlkaGF6dGxtaG5lZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQwNDY3ODUsImV4cCI6MTk3OTYyMjc4NX0.IRkGNQij4cSJwCxrpNd7XA1qOipX869bpz7Rqz5tGCs";

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.allLoadedProjects = [];
window.currentUser;
window.currentProject;
window.currentUserMeta;

supabase.auth.onAuthStateChange(async (event, session) => {
	console.log(event);
	const {
		data: { user },
	} = await supabase.auth.getUser();
	window.currentUser = user;
	if (event == "SIGNED_IN") {
		queryUserMeta();
		queryProjects();
	} else if (event == "SIGNED_OUT") {
		generateProjectList();
		if (!window.location.pathname.includes("login"))
			window.location.href = "login";
	}
});

window.addEventListener("load", async () => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		if (!window.location.pathname.includes("login"))
			window.location.href = "login";
		return;
	}
});
async function queryUserMeta() {
	var { data, err } = await supabase
		.from("users")
		.select()
		.eq("id", window.currentUser.id);

	if (data) {
		window.currentUserMeta = data[0];
		if (document.getElementById("accountName")) {
			document.getElementById("accountName").innerHTML =
				window.currentUserMeta.display_name;
		}
	} else {
		const { data, error } = await supabase.from("users").insert([
			{
				id: window.currentUser.id,
				display_name: "test",
				created_at: new Date().toISOString(),
				last_access: new Date().toISOString(),
			},
		]);
	}
}
async function queryProjects() {
	var { data, err } = await supabase
		.from("projects")
		.select()
		.eq("owner", window.currentUser.id)
		.order("updated_at", { ascending: true });
	if (data) {
		window.allLoadedProjects = data;
	}
	generateProjectList();
}

function generateProjectList() {
	return;
	var projects = document.getElementById("projects");
	//query for all projects in cities by owner id
	projects.innerHTML = `<div class="loader-5 center"><span></span></div>`;
	if (!window.currentUser) {
		projects.innerHTML = "no projects. create one!";
		return;
	}
	projects.innerHTML = ``;
	window.allLoadedProjects.reverse().forEach((e, i) => {
		projects.innerHTML +=
			`<button onclick="selectProject('${
				e.id
			}')" class='project' style='animation-delay: ${i * 0.02}s'>` +
			e.name +
			" " +
			e.id +
			" " +
			formatDate(e.updated_at) +
			"<br>" +
			"</button></br>";
	});
}

async function signUpSubmitted(event) {
	event.preventDefault();
	const email = event.target[0].value;
	const password = event.target[1].value;

	supabase.auth
		.signUp({ email, password })
		.then((response) => {
			response.error ? console.log(response.error.message) : setToken(response);
			supabase.auth.updateUser({ data: { display_name: "test" } });
		})
		.catch((err) => {
			alert(err);
		});
}

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

	supabase.auth.signInWithPassword({ email, password }).then((response) => {
		console.log(response.error ? "z" : "b", response);
		if (response.error) {
			if (response.error.message == "Invalid login credentials") {
				notify.log("Invalid login credentials");
			}
		} else {
			console.log("Signed In");
			setToken(response);
			window.location.href = "/";
		}
	});
};

const logoutSubmitted = (event) => {
	event.preventDefault();

	supabase.auth
		.signOut()
		.then((_response) => {
			console.log("Logout successful");
		})
		.catch((err) => {
			console.log(err.response.text);
		});
	queryProjects();
};

async function setToken(response) {
	if (
		response.data.user.confirmation_sent_at &&
		!response?.data?.session?.access_token
	) {
		console.log("Confirmation Email Sent");
	} else {
		console.log("Logged in as " + response.data.user.email);
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
/*creates project*/
async function newSupaProject(projData) {
	var id = uuidv4();
	console.log(id);
	const { data, error } = await supabase.from("projects").insert([
		{
			id: id,
			owner: window.currentUser.id,
			updated_at: new Date().toISOString(),
			name: projData.name,
			data: { ...projData },
		},
	]);
	if (error) {
		console.log(error);
	}
	if (data) {
		window.allLoadedProjects.push(data[0]);
	}
	queryProjects();
	populateProjects();
	openProject(id);
	return id;
}
//function to create random uuid
function uuidv4() {
	if (crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
async function updateProject(id, dat) {
	const { data, error } = await supabase
		.from("projects")
		.update({
			data: dat,
			name: dat.name,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id);
	if (error) {
		console.log(error);
		cloudSyncError();
	} else {
		postCloudSync();
	}
	queryProjects();
}

function selectProject(pID) {
	console.log("Loading project " + pID + "...");
	queryProjects().then(() => {
		window.currentProject = window.allLoadedProjects.find((e) => e.id == pID);
		loadFile(window.currentProject.data);
	});
	//document.getElementById("data").value = window.currentProject.data.msg
}

function queueForSync() {
	if (!window.currentProject) {
		cloudSyncError();
		return;
	}
	updateProject(window.currentProject.id, compileData());
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

window.cloudSyncEvent = new Event("triggerCloudSync");

window.addEventListener("triggerCloudSync", handleCloudSync);

function handleCloudSync() {
	document
		.getElementById("syncStatusIndicator")
		.classList.remove("hi-check-outline");
	document
		.getElementById("syncStatusIndicator")
		.classList.add("hi-loading-outline");
	document
		.getElementById("syncStatusIndicator")
		.classList.remove("hi-x-outline");
	queueForSync();
}
function postCloudSync() {
	document
		.getElementById("syncStatusIndicator")
		.classList.add("hi-check-outline");
	document
		.getElementById("syncStatusIndicator")
		.classList.remove("hi-loading-outline");
	document
		.getElementById("syncStatusIndicator")
		.classList.remove("hi-x-outline");
}
function cloudSyncError() {
	document
		.getElementById("syncStatusIndicator")
		.classList.remove("hi-check-outline");
	document
		.getElementById("syncStatusIndicator")
		.classList.remove("hi-loading-outline");
	document.getElementById("syncStatusIndicator").classList.add("hi-x-outline");
}

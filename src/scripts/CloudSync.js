window.cloudSyncEvent = new Event("triggerCloudSync")

window.addEventListener("triggerCloudSync", handleCloudSync )

function handleCloudSync() {
	compileData()
    notify.log("cloudSYnc")
}

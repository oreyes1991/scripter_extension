const loc = document.location.href;

console.log(loc);
init();


function init() {
	chrome.storage.sync.get(['state'], (storage) => {
		const { state } = storage;
		state.forEach(st => {
			const isLocation = loc.match(new RegExp(st.target, 'g')) !== null;
			if(isLocation) executeScript(st)
		});
	})
}


function executeScript(st) {
	if (!st.active) return;
	if(st.execTime === 'ONLOAD') {
		eval(st.script);
	} else if(st.execTime === 'WAIT') {
		setTimeout(() => { eval(st.script) }, st.waitTime)
	}
}
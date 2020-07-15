document.addEventListener('DOMContentLoaded', () => {
	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
		let url = tabs[0].url;
		console.log(url);
		render(url);
	});
});

function render(url) {
	chrome.storage.sync.get(['state'], (storage) => {
		const { state } = storage;
		// get element
		const _d = document.querySelector('#main-content');
		// set title
		_d.H3({}, 'Scripts:');
		const scriptBox = _d.Div({className: 'scripts-box'});
		// for each script append script description
		state.forEach((st, i) => {
			if(url.match(new RegExp(st.target, 'g')) !== null) {
				scriptBox.appendChild(getJobItem(st, i));
			}
		});
		if (scriptBox.innerHTML === '') {
			console.log('empty state');
			scriptBox.appendChild(getEmptyState())
		}
		_d.Button({id: 'add-btn', onclick: () => { openManager() }}, 'ADD');
	})
}


function getEmptyState() {
	return Div({className: 'empty-state'},[
		H3({}, 'No scripts match this site'),
		Img({src: 'img/empty-state.png'})
	])
}


function getJobItem(st, i) {
	const item =  Div({ className:'sc-item' }, [
		getJobSubItem('Target match:', st.target, 'target'),
		getJobSubItem('Script name:', st.name, 'title-job'),
		getJobSubItem('Exec Time:', st.execTime, 'exc-t'),
		Div({className: 'is-active'}, [
			Label({}, 'Actve:'), ToggleSwitch(st.active)
		]),
		Div({className: 'sc-actions'}, [
			Button({
				onclick: () => { openManager(i) }
			}, 'Edit'),
			Button({}, 'Delete')
		])
	]);
	return item
}

function getJobSubItem(title, value, id) {
	return Div({}, [
		Label({}, title),
		Input({id, value, className: 'inp-no-outline', attributes: {disabled:''}})
	])
}

function ToggleSwitch(isActive) {
	const att = isActive ? { checked:'', disabled: '' } : {disabled: ''};
	return Label({className: 'switch'}, [
		Input({type:'checkbox', attributes: att}),
		Span({className: 'slider round'})
	])
}

function Input(props = {}, content = '') {
	props.content = content;
	return HTMLElementCreator('input', props)
}

function openManager(index) {
	const param = (index !== undefined) ? '?i=' + index : '';
	chrome.tabs.getAllInWindow(null, (tabs) => {
		let isFound = false;
		for (var i = 0; i < tabs.length; i++) {
			const tab = tabs[i];
			if (tab?.title === 'Scripter||manager') {
				isFound = true;
				chrome.tabs.update(tab.id, { active: true })
				chrome.tabs.sendMessage(tab.id, { index })
			}
		}
		if(!isFound) {
			chrome.tabs.create({url: chrome.extension.getURL('/src/manager.html' + param)});
		}
	});
}
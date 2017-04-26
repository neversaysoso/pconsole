// change title in wechat and iOS devices
export const changeTitle = function (title) {
	document.title = title
	document.body.scrollTop = 0
	const iframe = document.createElement('iframe')
	iframe.style.visibility = 'hidden'

	//iframe.setAttribute('src', '/favicon.ico')
	const iframeCallback = function () {
		setTimeout(() => {
			iframe.removeEventListener('load', iframeCallback)
			document.body.removeChild(iframe)
		}, 0)
	}
	iframe.addEventListener('load', iframeCallback)
	document.body.appendChild(iframe)
}
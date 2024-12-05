const descInput = document.getElementById('descInput')
const numberInput = document.getElementById('numberInput')
const btnAdd = document.getElementById('btnAdd')

const listRecording = document.getElementById('listRecording')
const emptyRecording = document.getElementById('emptyRecording')

const totalSum = document.getElementById('totalSum')

const recording = []

btnAdd.addEventListener('click', () => {
	const desc = descInput.value.trim()
	const sumNum = Number(numberInput.value)

	if (!desc || isNaN(sumNum) || sumNum === 0) {
		alert('Пожалуйста, введите корректные данные.')
		return
	}

	const newRecord = { desc, sumNum }
	recording.push(newRecord)

	renderRecording()
	updateTotalSum()
	toggleEmptyState()

	descInput.value = ''
	numberInput.value = ''
})

function renderRecording() {
	listRecording.innerHTML = ''

	for (const item of recording) {
		const createdListItem = createListItem(item)
		listRecording.appendChild(createdListItem)
	}
}

function createListItem(addedRecording) {
	const listItem = document.createElement('li')
	listItem.classList.add('item')

	const listItemTitle = document.createElement('h5')
	listItemTitle.classList.add('item__title')
	listItemTitle.textContent = addedRecording.desc

	const listItemNumber = document.createElement('p')
	listItemNumber.classList.add('item__number')
	listItemNumber.textContent = `${addedRecording.sumNum} c`

	listItem.appendChild(listItemTitle)
	listItem.appendChild(listItemNumber)

	return listItem
}

function updateTotalSum() {
	const total = recording.reduce((sum, item) => sum + item.sumNum, 0)
	totalSum.textContent = `Итого: ${total} с`
}

function toggleEmptyState() {
	if (recording.length === 0) {
		emptyRecording.classList.remove('none')
	} else {
		emptyRecording.classList.add('none')
	}
}

toggleEmptyState()

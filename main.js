const descInput = document.getElementById('descInput')
const numberInput = document.getElementById('numberInput')

/*  */
const modal = document.getElementById('modalAddCat')
const modalInput = document.getElementById('modalAddInput')
const modalCloseBtn = document.getElementById('modalAddClose')
const modalAddBtn = document.getElementById('modalAddBtn')

const modalDelCat = document.getElementById('modalDelCat')
const modalDelClose = document.getElementById('modalDelClose')
const modalDelInput = document.getElementById('modalDelInput')
const modalDelBtn = document.getElementById('modalDelBtn')
const modalList = document.getElementById('modalList')

const selectElement = document.getElementById('categories')
const btnAddCate = document.getElementById('btnAddCate')
const btnDelCate = document.getElementById('btnDelCate')

const startDateInput = document.getElementById('startDate')
const endDateInput = document.getElementById('endDate')
const bntSort = document.getElementById('bntSort')
const resetSort = document.getElementById('resetSort')

const filterCategories = document.getElementById('filterCategories')

const btnAdd = document.getElementById('btnAdd')
const btnClear = document.getElementById('btnClear')

const listRecording = document.getElementById('listRecording')
const emptyRecording = document.getElementById('emptyRecording')

const totalSum = document.getElementById('totalSum')

const categories = [
	{
		title: 'Прочее',
		id: 1,
	},
	{
		title: 'Еда',
		id: 2,
	},
	{
		title: 'Транспорт',
		id: 3,
	},
	{
		title: 'Покупки',
		id: 4,
	},
]

function getFromStorage(key) {
	return JSON.parse(localStorage.getItem(key)) || []
}

function setToStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

function updateUI() {
	const recordings = getFromStorage('recordings')
	renderRecording(recordings)
	updateTotalSum(recordings)
	toggleEmptyState(recordings)
	updateSelect()
	updateFilterCategories()
}

/* Кнопка добавление записи */
btnAdd.addEventListener('click', () => {
	const categories = getFromStorage('categories')
	if (categories.length === 0) {
		alert(
			'Нет доступных категорий. Добавьте категорию перед добавлением записи.'
		)
		return
	}

	createRecording()
	const recordings = getFromStorage('recordings')

	renderRecording(recordings)
	updateTotalSum(recordings)

	descInput.value = ''
	numberInput.value = ''
})

/* Создания записи */
function createRecording() {
	const desc = descInput.value.trim()
	const sumNum = Number(numberInput.value)
	const select = selectElement.value

	if (!desc || isNaN(sumNum) || sumNum <= 0 || !select) {
		alert('Пожалуйста, заполните описания и сумму.')
		return
	}

	const existingData = getFromStorage('recordings')
	const newRecord = {
		id: Date.now(),
		desc,
		sumNum,
		select: Number(select),
		date: new Date().toISOString(),
	}
	existingData.push(newRecord)

	setToStorage('recordings', existingData)
}

/* Прорисовка */
function renderRecording(obj) {
	listRecording.innerHTML = ''
	toggleEmptyState(obj)

	const sortedObj = obj
		.slice()
		.sort((a, b) => new Date(b.date) - new Date(a.date))

	sortedObj.forEach(item => {
		const createdListItem = createListItem(item)
		listRecording.appendChild(createdListItem)
	})
}

/* Создания записи в HTML */
function createListItem(addedRecording) {
	const listItem = document.createElement('li')
	listItem.classList.add('item')

	const listItemDate = document.createElement('p')
	listItemDate.classList.add('item__date')
	const formattedDate = new Date(addedRecording.date).toLocaleDateString(
		'ru-RU',
		{
			day: '2-digit',
			month: '2-digit',
			year: '2-digit',
		}
	)
	listItemDate.textContent = `${formattedDate}`

	const listItemTitle = document.createElement('h5')
	listItemTitle.classList.add('item__title')
	listItemTitle.textContent = addedRecording.desc

	const listItemNumber = document.createElement('p')
	listItemNumber.classList.add('item__number')
	listItemNumber.textContent = `${addedRecording.sumNum} c`

	const deleteItemBtn = document.createElement('button')
	deleteItemBtn.classList.add('item__delete-btn')
	deleteItemBtn.innerHTML =
		'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-backspace"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" /><path d="M12 10l4 4m0 -4l-4 4" /></svg>'
	deleteItemBtn.addEventListener('click', () => {
		deleteRecording(addedRecording.id)
	})

	listItem.appendChild(listItemDate)
	listItem.appendChild(listItemTitle)
	listItem.appendChild(listItemNumber)
	listItem.appendChild(deleteItemBtn)

	return listItem
}

/* Вычитывания итоговой суммы */
function updateTotalSum(totalNumSum) {
	const total = totalNumSum.reduce((sum, item) => sum + item.sumNum, 0)
	totalSum.textContent = `Итого: ${total} с`
}

/* Проверка на пустоту */
function toggleEmptyState(recordings, isFiltered = false) {
	if (recordings.length === 0) {
		emptyRecording.textContent = isFiltered
			? 'Нет записей по текущему фильтру.'
			: 'Записи отсутствуют.'
		emptyRecording.classList.remove('none')
	} else {
		emptyRecording.classList.add('none')
	}
}

/* Кнопка очистки */
btnClear.addEventListener('click', () => {
	localStorage.removeItem('recordings')
	setToStorage('categories', categories)

	const recordings = []
	renderRecording(recordings)
	updateTotalSum(recordings)
	toggleEmptyState(recordings)
	updateSelect()
	updateFilterCategories()
	filterCategories.value = 'all'
})

/* Удаление одного записи */
function deleteRecording(id) {
	const recordings = getFromStorage('recordings')
	const updatedRecordings = recordings.filter(record => record.id !== id)
	setToStorage('recordings', updatedRecordings)

	renderRecording(updatedRecordings)
	updateTotalSum(updatedRecordings)
	toggleEmptyState(updatedRecordings)
}

/* Категория */
function updateSelect() {
	const categories = getFromStorage('categories')

	selectElement.innerHTML = ''
	categories.forEach(category => {
		const option = document.createElement('option')
		option.value = category.id
		option.textContent = category.title

		selectElement.appendChild(option)
	})
}

/* Модальное окно для добавление записи */
btnAddCate.addEventListener('click', () => {
	modal.style.display = 'flex'
})

modalAddBtn.addEventListener('click', () => {
	const newTitle = modalInput.value.trim()

	if (!newTitle) {
		alert('Введите название категории!')
		return
	}

	const existingCategories = getFromStorage('categories')

	const duplicate = existingCategories.some(
		category => category.title.toLowerCase() === newTitle.toLowerCase()
	)
	if (duplicate) {
		alert('Такая категория уже существует.')
		return
	}

	const newId =
		existingCategories.length > 0
			? existingCategories[existingCategories.length - 1].id + 1
			: 1

	const newCategories = { id: newId, title: newTitle }

	existingCategories.push(newCategories)

	setToStorage('categories', existingCategories)

	updateSelect()
	updateFilterCategories()
	modalInput.value = ''
	modal.style.display = 'none'

	alert(`Категория "${newCategories.title}" успешно добавлена.`)
})

modalCloseBtn.addEventListener('click', () => {
	modal.style.display = 'none'
})

modal.addEventListener('click', event => {
	if (event.target === modal) {
		modal.style.display = 'none'
	}
})

/* Модальное окно для удаление записи */
btnDelCate.addEventListener('click', () => {
	const categories = getFromStorage('categories')

	modalList.innerHTML = ''
	categories.forEach(category => {
		const listItem = document.createElement('li')
		listItem.classList.add('modal__item')
		listItem.textContent = `- ${category.title}`
		modalList.appendChild(listItem)
	})

	modalDelCat.style.display = 'flex'
})

modalDelBtn.addEventListener('click', () => {
	const delTitle = modalDelInput.value.trim()

	if (!delTitle) {
		alert('Введите название категории!')
		return
	}
	const existingCategories = getFromStorage('categories')
	const categoryIndex = existingCategories.findIndex(
		category => category.title.toLowerCase() === delTitle.toLowerCase()
	)

	if (categoryIndex === -1) {
		alert('Категория не найдена!')
		return
	}

	const [removedCategory] = existingCategories.splice(categoryIndex, 1)
	setToStorage('categories', existingCategories)

	const recordings = getFromStorage('recordings')
	const associatedRecords = recordings.filter(
		record => record.select === removedCategory.id
	)

	if (associatedRecords.length > 0) {
		if (
			confirm(
				`С категорией "${removedCategory.title}" связаны записи. Удалить их тоже?`
			)
		) {
			const updatedRecordings = recordings.filter(
				record => record.select !== removedCategory.id
			)
			setToStorage('recordings', updatedRecordings)
		}
	}

	updateSelect()
	updateFilterCategories()
	updateUI()
	modalDelInput.value = ''
	modalDelCat.style.display = 'none'

	alert(`Категория "${removedCategory.title}" успешно удалена.`)
})

modalDelClose.addEventListener('click', () => {
	modalDelCat.style.display = 'none'
})

modalDelCat.addEventListener('click', event => {
	if (event.target === modalDelCat) {
		modalDelCat.style.display = 'none'
	}
})

/* Фильтрация */
bntSort.addEventListener('click', () => {
	const startDate = startDateInput.value
	const endDate = endDateInput.value

	if (!startDate || !endDate) {
		alert('Пожалуйста, выберите обе даты для фильтрации.')
		return
	}

	filterByDateRange(startDate, endDate)
})

function filterByDateRange(startDate, endDate) {
	const recordings = getFromStorage('recordings')

	if (endDate < startDate) {
		alert('Дата окончания не может быть раньше даты начала.')
		return []
	}

	const start = new Date(startDate)
	const end = new Date(endDate)

	start.setHours(0, 0, 0, 0)
	end.setHours(23, 59, 59, 999)

	const filtered = recordings.filter(record => {
		const recordDate = new Date(record.date)
		return recordDate >= start && recordDate <= end
	})

	renderRecording(filtered)
	updateTotalSum(filtered)
	toggleEmptyState(filtered, true)
}

resetSort.addEventListener('click', () => {
	const selectedCategoryId = filterCategories.value
	const recordings = getFromStorage('recordings')

	let filteredRecordings = recordings
	if (selectedCategoryId !== 'all') {
		filteredRecordings = recordings.filter(
			record => record.select === Number(selectedCategoryId)
		)
	}

	renderRecording(recordings)
	updateTotalSum(recordings)
	toggleEmptyState(filteredRecordings, selectedCategoryId !== 'all')

	startDateInput.value = ''
	endDateInput.value = ''
})

function updateFilterCategories() {
	const categories = getFromStorage('categories')
	const filterCategories = document.getElementById('filterCategories')

	filterCategories.innerHTML = '<option value="all">Все категории</option>'

	categories.forEach(category => {
		const option = document.createElement('option')
		option.value = category.id
		option.textContent = category.title
		filterCategories.appendChild(option)
	})
}

filterCategories.addEventListener('change', () => {
	const selectedCategoryId = filterCategories.value
	const recordings = getFromStorage('recordings')

	if (selectedCategoryId === 'all') {
		renderRecording(recordings)
		updateTotalSum(recordings)
		toggleEmptyState(recordings)
		return
	}

	const filteredRecordings = recordings.filter(
		record => record.select === Number(selectedCategoryId)
	)

	renderRecording(filteredRecordings)
	updateTotalSum(filteredRecordings)
	toggleEmptyState(filteredRecordings, true)
})

document.addEventListener('DOMContentLoaded', () => {
	const storedCategories = getFromStorage('categories')
	if (storedCategories.length === 0) {
		setToStorage('categories', categories)
	}

	updateUI()
})

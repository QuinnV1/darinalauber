const roleImages = {
	Мастер: 'images/Мастер.png',
	Тантрика: 'images/Тантрика.png',
	Исследователь: 'images/Исследователь.png',
	Оптимист: 'images/Оптимист.png',
	ПринцПринцесса: 'images/ПринцПринцесса.png',
	Звезда: 'images/Звезда.png',
	Герой: 'images/Герой.png',
	БогБогиня: 'images/БогБогиня.png',
	Джокер: 'images/Джокер.png',
	Лидер: 'images/Лидер.png',
	Мудрец: 'images/Мудрец.png',
	Гуру: 'images/Гуру.png',
	Меценат: 'images/Меценат.png',
	Преподаватель: 'images/Преподаватель.png',
	ЛайфстайлБлогер: 'images/ЛайфстайлБлогер.png',
	Инстамодель: 'images/Инстамодель.png',
	Скряга: 'images/Скряга.png',
	Невротик: 'images/Невротик.png',
	Разоблачитель: 'images/Разоблачитель.png',
	Рэпер: 'images/Рэпер.png',
	Критик: 'images/Критик.png',
	Циник: 'images/Циник.png',
	Жертва: 'images/Жертва.png',
	Зависимый: 'images/Зависимый.png',
	Эксгибиционист: 'images/Эксгибиционист.png',
	Меркантильный: 'images/Меркантильный.png',
	Скандалист: 'images/Скандалист.png',
	Иллюзионист: 'images/Иллюзионист.png',
}

function saveResult(testIdx, resultObj) {
	localStorage.setItem(`quizresult${testIdx}`, JSON.stringify(resultObj))
}
function loadResult(testIdx) {
	let item = localStorage.getItem(`quizresult${testIdx}`)
	return item ? JSON.parse(item) : null
}
function clearResult(testIdx) {
	localStorage.removeItem(`quizresult${testIdx}`)
}

function renderResult() {
	const quizData = testBanks[currentTest].quizData
	let stats = {},
		total = 0
	quizData.forEach((q, qi) => {
		if (!answers[qi]) return
		answers[qi].forEach((idx) => {
			const role = q.options[idx].role
			stats[role] = (stats[role] || 0) + 1
			total += 1
		})
	})
	let topRoles = Object.entries(stats)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)
	let resultData = {
		roles: topRoles,
		total,
		timestamp: Date.now(),
	}
	saveResult(currentTest, resultData)

	renderSwiperResult(resultData)
}

function renderSwiperResult(resultData) {
	slideRender(`
    <div style="text-align:center;">
      <div style="font-weight:700; color:#fa7e0a; font-size:1.16rem; margin-bottom:17px;">
        Ваши три ведущие роли (листайте веером):
      </div>
      <div class="swiper mySwiper">
        <div class="swiper-wrapper">
          ${resultData.roles
						.map(([role, score], idx) => {
							let percent = resultData.total
								? Math.round((score / resultData.total) * 100)
								: 0
							let info = rolesInfo[role] || {
								name: role,
								desc: 'Описание отсутствует',
							}
							let img = roleImages[role] || 'images/fallback.jpg'
							return `
              <div class="swiper-slide" style="
                background-image: url('${img}');
                background-size: cover;
                background-position: center;
                border-radius: 22px;
                box-shadow: 0 6px 26px #0003;
                min-height: 340px;
                display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
              ">
                <div class="role-title" style="background:rgba(0,0,0,0.29);margin:0 0 10px 0;display:inline-block;border-radius:10px 10px 0 0;padding:13px 16px 8px 17px;font-size:1.19rem;font-weight:700;color:#fff;box-shadow:0 1px 8px #0004;">${info.name}<span style="opacity:.65;font-size:.93em;"> — ${percent}%</span></div>
                <div class="role-desc" style="background:rgba(0,0,0,0.30);border-radius:0 0 17px 17px;padding:13px 14px 13px 14px;font-size:15.8px;line-height:1.37;color:#fff;width:100%;text-align:left;min-height:39px;">${info.desc}</div>
              </div>
            `
						})
						.join('')}
        </div>
      </div>
      <div style="margin:28px 0 9px 0;">
        <button class="btn btn-main" onclick="restartQuiz()" style="font-size:1.13rem;margin-bottom:12px;width:92%;">Начать тест сначала</button>
      </div>
      <div style="font-size:1.02rem; color:#161616; margin:13px 0 9px 0; font-weight:600;">
        <span style="color:#fa7e0a; font-weight:700;">Скопируйте отчёт и пишите мне в ЛС 👇</span>
      </div>
      
      <a href="https://t.me/DarinaLauber" target="_blank" rel="noopener"
         style="display:inline-block; text-decoration:none;">
        <button class="btn btn-main" style="font-size:1.13rem;letter-spacing:0.03em;margin-top:8px;">Написать в Telegram</button>
      </a>
    </div>
  `)
	// <button class="btn" onclick="copyResults()" id="copyBtn" style="margin-bottom:11px;">Скопировать ваши результаты</button><br></br>
	setTimeout(() => {
		// Подбор параметров по ширине экрана
		let offset =
			window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 15 : 15	
		let rotate = window.innerWidth < 600 ? 3 : window.innerWidth < 900 ? 15 : 15
		new Swiper('.mySwiper', {
			effect: 'cards',
			grabCursor: true,
			initialSlide: 0,
			cardsEffect: {
				perSlideOffset: offset,
				perSlideRotate: rotate,
			},
			observer: true,
			observeParents: true,
		})
	}, 28)
}

window.restartQuiz = function () {
	clearResult(currentTest)
	step = 0
	answers = testBanks[currentTest].quizData.map(() => [])
	renderQuestions(true)
}
window.switchTest = function (idx) {
	document
		.querySelectorAll('.tab-btn')
		.forEach((btn, i) => btn.classList.toggle('active', i === idx))
	currentTest = idx
	step = 0
	answers = testBanks[idx].quizData.map(() => [])
	let loaded = loadResult(idx)
	if (loaded) renderSwiperResult(loaded)
	else renderQuestions(true)
}
if (typeof window.switchTest === 'function') window.switchTest(0)

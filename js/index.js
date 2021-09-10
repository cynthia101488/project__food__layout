const elemMode = document.querySelector('#Mode');
const elemPage = document.querySelector('#Page');
const elemCityList = document.querySelector('#City');
const elemTownList = document.querySelector('#Town');
const elemLoad = document.querySelector('#Load');
let pageArr = [];
let cityArr = [];
let placeList = [];
let currentObj = {
  currentIndex: 0,
  currentCity: -1,
  currentTown: ''
};
let renderObj = {
  mode: 0,
  renderList: false,
  renderTable: false,
  renderCard: false
};
const dataSize = 10;

getData();
setEvent();

function getData() {
  const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      pageSplit(data);
      dataFilter(data);
      cityArr = dataSplit(data);
      setTemplate(currentObj.currentIndex, renderObj.mode);
    })
    .catch(err => {
      if (err) {
        alert('資料來源有誤！')
      }
    })
    .finally(() => {
      elemLoad.style = 'display: none';
    });
}

function pageSplit(data) {
  pageArr = [];
  for (let i = 0, len = data.length; i < len; i += dataSize) {
    pageArr.push(data.slice(i, i + dataSize));
  }
  setPage(pageArr.length);
}

function setPage(len) {
  currentObj.currentIndex = 0;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += `<button class="page__btn" type="button" data-id="${i}">${i + 1}</button>`;
  }
  elemPage.innerHTML = str;
  elemPage.children[currentObj.currentIndex].classList.add('js-page__btn');
}

function dataFilter(data) {
  const allPlace = getZone(data)
  placeList = allPlace.filter((item, index) => allPlace.indexOf(item) === index);
  setSelectList(placeList);
}

function getZone(data) {
  const arr = data.map(item => {
    if (currentObj.currentCity < 0) {
      return item.City;
    } else {
      return item.Town;
    }
  });
  return arr;
}

function setSelectList(arr) {
  let str = '';
  arr.forEach((item, index) => {
    str += `<option class="nav__item" value="${item}" data-id="${index}">${item}</option>`
  });
  if (currentObj.currentCity < 0) {
    elemCityList.innerHTML += str;
  } else {
    elemTownList.innerHTML = `<option class="nav__item" value="allTown" selected disabled>請選擇鄉鎮區...</option>` + str;
  }
}

function dataSplit(data) {
  placeList.forEach(item => {
    let arr = [];
    data.forEach(elem => {
      if (elem.City === item) {
        arr.push(elem);
      }
    });
    cityArr.push(arr);
  });
  return cityArr;
}

function setTemplate(index, type) {
  const elemList = document.querySelector('#List');
  const elemTable = document.querySelector('#Table');
  const elemTableIn = document.querySelector('#TableIn');
  const elemCard = document.querySelector('#Card');
  const elemCardIn = document.querySelector('#CardIn');
  const elemPageNum = document.querySelector('#PageNum');
  let str = '';
  switch (type) {
    case 0:
      elemList.style = 'display: block';
      elemTable.style = 'display: none';
      elemCard.style = 'display: none';
      if (!renderObj.renderList) {
        pageArr[index].forEach(item => {
          str += `<div class="list__sec">
                  ${item.Url ? `<a class="list__link" href="${item.Url}" target="_blank">` : ''}
                    <div class="list__content">
                      <div class="img__inner">
                        <img class="image" src="${item.PicURL}" alt="${item.Name}" loading="lazy">
                      </div>
                      <div class="list__info">
                        <div class="list__head">
                          <h2 class="list__tit">${item.Name}</h2>
                        </div>
                        <div class="list__footer">
                          <h3 class="list__tag">${item.City}</h3>
                          <h4 class="list__name">${item.Town}</h4>
                        </div>
                        <div class="list__body">
                          <p class="list__desc">${textLimit(item.HostWords)}</p>
                        </div>
                      </div>
                    </div>
                  ${item.Url ? `</a>` : ''}
                </div>`
        });
        elemList.innerHTML = str;
        renderObj.renderList = true;
      }
      break;
    case 1:
      elemTable.style = 'display: block';
      elemList.style = 'display: none';
      elemCard.style = 'display: none';
      if (!renderObj.renderTable) {
        const rowStartIndex = index * dataSize + 1;
        pageArr[index].forEach((item, i) => {
          str += `<tr class="table__ls ${changeBgColor(i)}">
                  <td class="table__item text-right text-gray">${rowStartIndex + i}</td>
                  <td class="table__item text-gray">${item.City}</td>
                  <td class="table__item text-gray">${item.Town}</td>
                  <td class="table__item">${item.Url ? `<a href="${item.Url}" target="_blank">${item.Name}</a>` : `${item.Name}`}</td>
                  <td class="table__item">
                    <div class="table__desc">
                      <p class="table__info text-overflow">${item.Address}</p>
                      <p class="table__hidden">${item.Address}</p>
                    </div>
                  </td>
                </tr>`;
        });
        elemTableIn.innerHTML = str;
        renderObj.renderTable = true;
      }
      break;
    default:
      elemCard.style = 'display: block';
      elemList.style = 'display: none';
      elemTable.style = 'display: none';
      if (!renderObj.renderCard) {
        pageArr[index].forEach(item => {
          str += `<div class="card__sec">
              ${item.Url ? `<a class="card__link" href="${item.Url}" target="_blank">` : ''}
                <div class="card__content">
                  <div class="img__inner">
                    <img class="image" src="${item.PicURL}" alt="${item.Name}" loading="lazy">
                  </div>
                  <div class="card__info">
                    <div class="card__head">
                      <h3 class="card__tag">${item.City}</h3>
                      <h4 class="card__name">${item.Town}</h4>
                    </div>
                    <div class="card__body">
                      <h2 class="card__tit">${item.Name}</h2>
                    </div>
                    <div class="card__footer">
                      <p class="card__desc">${item.HostWords}</p>
                    </div>
                  </div>
                </div>
              ${item.Url ? `</a>` : ''}
            </div>`
        });
        elemCardIn.innerHTML = str;
        renderObj.renderCard = true;
      }
      break;
  }
  elemPageNum.textContent = `美食頁次 ${index + 1}/${pageArr.length}`;
}

function textLimit(text) {
  let len = text.length;
  if (screen.width <= 414) {
    return len > 40 ? text.substring(0, 40) + '...' : text;
  } else {
    return len > 100 ? text.substring(0, 100) + '...' : text;
  }
}

function changeBgColor(index) {
  return index % 2 === 0 ? '' : 'js-table__ls';
}

function setEvent() {
  elemMode.addEventListener('click', changeMode);
  elemPage.addEventListener('click', changePage);
  elemCityList.addEventListener('change', changeCity);
  elemTownList.addEventListener('change', changeTown);
}

function changeMode(e) {
  const self = e.target;
  if (self.nodeName === 'I') {
    const prevMode = renderObj.mode;
    renderObj.mode = parseInt(self.dataset.id);
    setTemplate(currentObj.currentIndex, renderObj.mode);
    setModeBtn(prevMode);
  }
}

function changePage(e) {
  const self = e.target;
  if (self.nodeName === 'BUTTON') {
    const prevIndex = currentObj.currentIndex;
    currentObj.currentIndex = parseInt(self.dataset.id);
    renderStateChange();
    setTemplate(currentObj.currentIndex, renderObj.mode);
    setPageBtn(prevIndex);
  }
}

function changeCity() {
  currentObj.currentCity = elemCityList.selectedIndex - 1;
  pageSplit(cityArr[currentObj.currentCity]);
  renderStateChange();
  setTemplate(currentObj.currentIndex, renderObj.mode);
  dataFilter(cityArr[currentObj.currentCity]);
}

function changeTown() {
  currentObj.currentTown = elemTownList.value;
  let arr = [];
  cityArr[currentObj.currentCity].forEach(item => {
    if (item.Town === currentObj.currentTown) {
      arr.push(item);
    }
  });
  pageSplit(arr);
  renderStateChange();
  setTemplate(currentObj.currentIndex, renderObj.mode);
}

function setModeBtn(index) {
  elemMode.children[renderObj.mode].classList.add('js-nav__btn');
  elemMode.children[index].classList.remove('js-nav__btn');
}

function setPageBtn(index) {
  elemPage.children[currentObj.currentIndex].classList.add('js-page__btn');
  elemPage.children[index].classList.remove('js-page__btn');
}

function renderStateChange() {
  renderObj.renderList = false;
  renderObj.renderTable = false;
  renderObj.renderCard = false;
}
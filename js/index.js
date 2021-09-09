const elemMode = document.querySelector('#Mode');
const elemPage = document.querySelector('#Page');
let pageArr = [];
let currentIndex = 0;
const dataSize = 10;
let mode = 0;

getData();
setEvent();

function getData() {
  const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      pageArr = pageSplit(data);
      setPage(pageArr);
      setTemplate(currentIndex, mode);
    })
}

function pageSplit(data) {
  for (let i = 0, len = data.length; i < len; i += dataSize) {
    pageArr.push(data.slice(i, i + dataSize));
  }
  return pageArr;
}

function setPage(arr) {
  let str = '';
  arr.forEach((item, index) => {
    str += `<button class="page__btn" type="button" data-id="${index}">${index + 1}</button>`;
  });
  elemPage.innerHTML = str;
  elemPage.children[currentIndex].classList.add('js-page__btn');
}

function setTemplate(index, type) {
  const elemList = document.querySelector('#List');
  const elemTable = document.querySelector('#Table');
  const elemTableBox = document.querySelector('#TableBox');
  const elemCard = document.querySelector('#Card');
  const elemCardBox = document.querySelector('#CardBox');
  const elemPageNum = document.querySelector('#PageNum');
  let str = '';
  switch (type) {
    case 0:
      elemList.style = 'display: block';
      elemTableBox.style = 'display: none';
      elemCardBox.style = 'display: none';
      pageArr[index].forEach(item => {
        str += `<div class="article__sec">
                  ${item.Url ? `<a class="article__link" href="${item.Url}" target="_blank">` : ''}
                    <div class="article__content">
                      <div class="img__inner">
                        <img class="image" src="${item.PicURL}" alt="${item.Name}">
                      </div>
                      <div class="article__info">
                        <div class="article__head">
                          <h2 class="article__tit">${item.Name}</h2>
                        </div>
                        <div class="article__body">
                          <p class="article__desc">${textLimit(item.HostWords)}</p>
                        </div>
                      </div>
                      <div class="article__footer">
                        <h3 class="article__tag">${item.City}</h3>
                        <h4 class="article__name">${item.Town}</h4>
                      </div>
                    </div>
                  ${item.Url ? `</a>` : ''}
                </div>`
      });
      elemList.innerHTML = str;
      break;
    case 1:
      elemTableBox.style = 'display: block';
      elemList.style = 'display: none';
      elemCardBox.style = 'display: none';
      const rowStartIndex = index * dataSize + 1;
      pageArr[index].forEach((item, i) => {
        str += `<tr class="table__ls ${changeBgColor(i)}">
                  <td class="table__item text-right text-gray">${rowStartIndex + i}</td>
                  <td class="table__item text-gray">${item.City}</td>
                  <td class="table__item text-gray">${item.Town}</td>
                  <td class="table__item">${item.Url ? `<a href="${item.Url}" target="_blank">${item.Name}</a>` : `${item.Name}`}</td>
                  <td class="table__item text-overflow" title="${item.Address}">${item.Address}</td>
                </tr>`;
      });
      elemTable.innerHTML = str;
      break;
    default:
      elemCardBox.style = 'display: block';
      elemList.style = 'display: none';
      elemTableBox.style = 'display: none';
      pageArr[index].forEach(item => {
        str += `<div class="card__sec">
              ${item.Url ? `<a class="card__link" href="${item.Url}" target="_blank">` : ''}
                <div class="card__content">
                  <div class="img__inner">
                    <img class="image" src="${item.PicURL}" alt="${item.Name}">
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
                      <p class="card__desc">${textLimit(item.HostWords)}</p>
                    </div>
                  </div>
                </div>
              ${item.Url ? `</a>` : ''}
            </div>`
      });
      elemCard.innerHTML = str;
      break;
  }
  elemPageNum.textContent = `美食頁次 ${index + 1}/14`;
}

function textLimit(text) {
  let len = text.length;
  return len > 100 ? text.substring(0, 100) + '...' : text;
}

function changeBgColor(index) {
  return index % 2 === 0 ? '' : 'js-table__ls';
}

function setEvent() {
  elemMode.addEventListener('click', changeMode, true)
  elemPage.addEventListener('click', changePage);
}

function changeMode(e) {
  const self = e.target;
  console.log(e);
  if (self.nodeName === 'I') {
    const prevMode = mode;
    mode = parseInt(self.dataset.id);
    setTemplate(currentIndex, mode);
    setModeBtn(prevMode)
  }
}

function setModeBtn(index) {
  elemMode.children[mode].classList.add('js-nav__btn');
  elemMode.children[index].classList.remove('js-nav__btn');
}

function changePage(e) {
  const self = e.target;
  if (self.nodeName === 'BUTTON') {
    const prevIndex = currentIndex;
    currentIndex = parseInt(self.dataset.id);
    setTemplate(currentIndex, mode);
    setPageBtn(prevIndex);
  }
}

function setPageBtn(index) {
  elemPage.children[currentIndex].classList.add('js-page__btn');
  elemPage.children[index].classList.remove('js-page__btn');
}

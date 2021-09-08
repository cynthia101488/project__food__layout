const elemPage = document.querySelector('#Page');
let pageArr = [];
let currentIndex = 0;
const dataSize = 10;

getData();
setEvent();

function getData() {
  const api = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
  fetch(api)
    .then(res => res.json())
    .then(data => {
      pageArr = pageSplit(data);
      setPage(pageArr);
      setTemplate(currentIndex);
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
    str += `<button class="btn" type="button" data-id="${index}">${index + 1}</button>`;  
  });
  elemPage.innerHTML = str;
  elemPage.children[currentIndex].classList.add('js-btn');
}

function setTemplate(index) {
  const elemListBox = document.querySelector('#List');
  const elemPageNum = document.querySelector('#PageNum');
  let str = '';
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
  elemListBox.innerHTML = str;
  elemPageNum.textContent = `美食頁次 ${index + 1}/14`;
}

function textLimit(text) {
  let len = text.length;
  return len > 100 ? text.substring(0, 100) + '...' : text;
}

function setEvent() {
  elemPage.addEventListener('click', doClick);
}

function doClick(e) {
  const self = e.target;
  if (self.nodeName === 'BUTTON') {
    const prevIndex = currentIndex;
    currentIndex = parseInt(self.dataset.id);
    setTemplate(currentIndex);
    setBtn(prevIndex);
  }
}

function setBtn(index) {
  elemPage.children[currentIndex].classList.add('js-btn');
  elemPage.children[index].classList.remove('js-btn');
}

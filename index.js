(function () {
  // write your code here
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  const dataPanel = document.getElementById('data-panel')

  axios.get(INDEX_URL)
    .then((response) => {
      //解法一：迭代器//
      //for (let item of response.data.results) {
      //  data.push(item) 
      //}
      //解法二:展開運算子//
      data.push(...response.data.results)
      console.log(response)
      displayDataList(data) //渲染所有電影資料
      getTotalPages(data)   //顯示所有頁數
      getPageData(1, data)  //取出特定頁面資料
    })
    .catch((err) => {
      console.log(err)
    })

  //listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    }
    else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })


  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
      <div class="col-sm-3 cardItem">
        <div class="card mb-2">
          <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
          <div class="card-body movie-item-body">
            <h6 class="card-title">${item.title}</h6>
          </div>  
          
          <div class="card-footer">
          <!=="More" button-->
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>

          <!=="Favorite" button-->
            <button class="btn btn-primary btn-add-favorite" data-id="${item.id}"> + </button> 
          </div>

        </div>
      </div>       
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //發送Request
  function showMovie(id) {
    //get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    //set request url
    const url = INDEX_URL + id
    console.log(url)

    //send request to show api
    axios.get(url)
      .then(response => {
        const data = response.data.results
        console.log(data)
        //insert data into modal ui
        modalTitle.textContent = data.title
        modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at : ${data.release_date}`
        modalDescription.textContent = `${data.description}`
      })
  }

  //search Bar
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  // searchForm.addEventListener('submit', event => {
  //   event.preventDefault() //終止button的預設行為
  //   console.log('success')
  //   let input = searchInput.value.toLowerCase()
  //   let results = data.filter(
  //     movie => movie.title.toLowerCase().includes(input)
  //   )
  //   console.log(results)
  //   displayDataList(results)
  // })

  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // getTotalPages(results)     //顯示所有頁數
    // getPageData(1, results)    //取出特定頁面資料

    if (dataPanel.children[1].classList[1] === 'cardItem') {
      getTotalPages(results)
      getPageData(1, results)
    }
    else {
      getTotalPages(results)
      getPageData_Bar(1, results)
    }
  })


  //將使用者想收藏的電影送進 local storage 儲存起來
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    }
    else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  // 計算總頁數並演算 li.page - item
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  // 新增 Pagination 標籤的事件監聽器
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      if (dataPanel.children[1].classList[1] === 'cardItem') { //A30
        getPageData(event.target.dataset.page)
      }
      else {
        getPageData_Bar(event.target.dataset.page) //A30
      }
    }
  })

  let paginationData = []

  function getPageData(pageNum, data) {
    currentPage = pageNum || currentPage //A30新增
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  // -----------------------------------------------------------------------------------------------------
  // A30
  let currentPage = 1

  const displayMode = document.getElementById('display-Mode')

  displayMode.addEventListener('click', (event) => {
    if (event.target.matches('.fa-bars')) {
      getPageData_Bar(currentPage)
    }
    else if (event.target.matches('.fa-th')) {
      getPageData(currentPage)
    }
  })

  function getPageData_Bar(pageNum, data) {
    currentPage = pageNum || currentPage
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList_Bar(pageData)
  }


  function displayDataList_Bar(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
         <div class="col-sm-6 title">
          <img class="img" width=8% style="border:2px #E8E8E8 solid" src="${POSTER_URL}${item.image}" alt="Card image cap">${item.title}
        </div>  
        <div class="col-sm-6 text-right mb-2">
          <!=="More" button-->
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
          <!=="Favorite" button-->
            <button class="btn btn-primary btn-add-favorite" data-id="${item.id}"> + </button> 
        </div>       
      `
    })
    dataPanel.innerHTML = htmlContent
  }

})()

$(document).ready(function () {
  $(".hamburger").click(function () {
    $(".menus").toggleClass("headermenus-show");
    $(".menus").toggleClass("headermenus");
    $(this).toggleClass("cross");
  });

  let api_key = "8d6f976a3d568729504eb85502e74226";
  $(".slider").html("");

  // function calls to display movies according to categories 
  if ($(".movie-category").length > 0) {
    displayMovies("top_rated", "top-rated-movies");
    displayMovies("popular", "most-popular-movies");
    displayMovies("now_playing", "now-playing-movies");
    displayMovies("upcoming", "upcoming-movies");
  }

  // function calls to display tv shows according to categories 
  if ($(".tvshow-category").length > 0) {
    displayTvshows("on_the_air", "on-air");
    displayTvshows("airing_today", "airing-today");
  }

  // initialising variables for login form 
  let loginform = $('.loginform'),
    username = $('.username'),
    password = $('.password'),
    usererror = $('.usernameerror'),
    passerror = $('.passworderror');
  localStorage.setItem('username1', 'saurabh96');
  localStorage.setItem('password1', '123456');
  console.log(username);

  //blur validation
  username.focusout(() => {
    usererror.html("");
    passerror.html("");
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    if (username.val().length === 0) {
      usererror.html("please enter username");
      $('.username').addClass("errorbox");
    }
  });

  password.focusout(() => {
    usererror.html("");
    passerror.html("");
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    if (password.val().length === 0) {
      passerror.html("please enter password");
      $('.password').addClass("errorbox");
    }
  })

  //login validation
  loginform.submit((event) => {
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    event.preventDefault();

    usererror.html("");
    passerror.html("");
    let user1 = localStorage.getItem('username1'),
      pass1 = localStorage.getItem('password1');
    event.preventDefault();

    if (username.val().length === 0) {
      usererror.html("please enter username");
      $('.username').addClass("errorbox");
    } else if (password.val().length === 0) {
      passerror.html("please enter password")
      $('.password').addClass("errorbox");
    } else if (username.val() === user1 && password.val() === pass1) {
      localStorage.setItem('validuser', 'true');
      window.open('homepage.html');
    } else {
      passerror.html("invalid username or password");
    }
  })

  // slick slider code 
  if ($(".movie-category").length > 0 || $(".tvshow-category").length > 0) {

    $('.slider').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [{
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  }

  // code for paginated list page 

  if ($(".paginated-list").length > 0) {
    let prev = $(".prev"),
      current = $(".curent"),
      next = $(".next"),
      total_pages = 100,

      url = new URL(window.location.href),
      urlstring = url.search.slice(1),
      searchurlparam = new URLSearchParams(urlstring),
      content_type = searchurlparam.get('type'),
      category = searchurlparam.get('cat'),
      page_no = parseInt(searchurlparam.get('page'));
    api_key = "8d6f976a3d568729504eb85502e74226";
    $.ajax({
      url: "https://api.themoviedb.org/3/" + content_type + "/" + category + "?api_key=" + api_key + "&language=en-US&page=1",
      type: "GET",
      success: (data) => {
        let result = data.results,
          total_pages = data.total_pages;
        console.log(total_pages);
        $(".prev").addClass("disabled");

        // functions for accessing next and previous pages in pagination list 

        next.click(() => {
          $(".prev").removeClass("disabled");
          page_no = parseInt(page_no + 1);
          console.log(page_no);
          console.log(total_pages);
          if (page_no < total_pages) {
            gotoPage(page_no, content_type, category);
          } else {
            $(".next").addClass("disabled");
          }
          $(".current").html(page_no);
        })

        prev.click(() => {
          if (page_no !== 1) {
            page_no = parseInt(page_no - 1);
            console.log(page_no);
            gotoPage(page_no, content_type, category);
          } else {
            $(".prev").addClass("disabled");
          }
          $(".current").html(page_no);
        });

        if (content_type === "movie") {
          result.forEach(i => {
            $(".paginated-contents").append(`
        <div class="page-item ">
        <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
            <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
        </a>
         <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.title}</a>
        <div class="user-actions-pagination">
            <span class="rate-us">rate us</span>
            <button class="addto-watchlist">
                add to Watchlist
            </button>
        </div>
    </div>
        `);
          })
        } else if (content_type === "tv") {
          result.forEach(i => {
            $(".paginated-contents").append(`
        <div class="page-item ">
        <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
            <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
        </a>
         <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.name}</a>
        <div class="user-actions-pagination">
            <span class="rate-us">rate us</span>
            <button class="addto-watchlist">
                add to Watchlist
            </button>
        </div>
    </div>
        `);
          })
        }
      },
      error: (error) => {
        alert("something went wrong");
        console.log(error);
      }

    });
  }

  // js code for details page 

  if ($(".details").length > 0) {
    $(".details .wrapper").html("");
    url = new URL(window.location.href),
      urlstring = url.search.slice(1),
      searchurlparam = new URLSearchParams(urlstring),
      content_id = searchurlparam.get('id'),
      content_type = searchurlparam.get('type'),
      api_key = "8d6f976a3d568729504eb85502e74226";
    $.ajax({
      url: "https://api.themoviedb.org/3/" + content_type + "/" + content_id + "?api_key=" + api_key + "&language=en-US",
      type: "GET",
      success: (data) => {
        if(content_type === "movie") {
          console.log(data.production_countries);
          $(".details .wrapper").append(`
            <h2>${data.title}</h2>
            <figure>
            <img src="https://image.tmdb.org/t/p/w500/${data.backdrop_path}" alt="Movie Poster">
            </figure>
            <p>${data.overview}</p>
            <div class="more-details">
            <span class="status">Status:${data.status}</span>
            <span class="release-date">Release date: ${data.release_date}</span>
            <span class="production-company">Production company: ${data.production_companies[0].name}</span>
            <span class="production-country">Production country: ${data.production_countries[0].name}</span>
            </div>
          `);
        }
      }
    });
  }
})

// function to display movies according to categories
function displayMovies(category, classname) {
  let api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: "https://api.themoviedb.org/3/movie/" + category + "?api_key=" + api_key + "&language=en-US&page=1",
    type: "GET",
    success: (data) => {
      let result = data.results;
      result.forEach(i => {
        $("." + classname + " .slider").slick('slickAdd', `
          <div class="movie-content ">
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          <a href="details.html?id=${i.id}&type=movie" title="Get Details" target="_self" class="title">${i.title}</a>
          <div class="user-actions">
              <span class="rate-movie">rate us</span>
              <button class="addto-watchlist">
                  add to Watchlist
              </button>
          </div>
      </div>
          `);
      })

      $(".slider").slick();
    },
    error: (error) => {
      alert("something went wrong");
      console.log(error);
    }

  });

}

// function to tv shows according to categories
function displayTvshows(category, classname) {
  let api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: " https://api.themoviedb.org/3/tv/" + category + "?api_key=" + api_key + "&language=en-US&page=1",
    type: "GET",
    success: (data) => {
      let result = data.results;
      result.forEach(i => {
        $("." + classname + " .slider").slick('slickAdd', `
          <div class="movie-content ">
          <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
          <a href="details.html?id=${i.id}&type=tv" title="Get Details" target="_self" class="title">${i.name}</a>
          <div class="user-actions">
              <span class="rate-movie">rate us</span>
              <button class="addto-watchlist">
                  add to Watchlist
              </button>
          </div>
      </div>
          `);
      })

      $(".slider").slick();
    },
    error: (error) => {
      alert("something went wrong");
      console.log(error);
    }

  });

}

// function for accessing next or previous page 

const gotoPage = (page, content_type, category) => {
  $(".paginated-contents").html("");
  let api_key = "8d6f976a3d568729504eb85502e74226";
  $.ajax({
    url: "https://api.themoviedb.org/3/" + content_type + "/" + category + "?api_key=" + api_key + "&language=en-US&page=" + page,
    type: "GET",
    success: (data) => {
      let result = data.results;
      if (content_type === "movie") {
        result.forEach(i => {
          $(".paginated-contents").append(`
          <div class="page-item ">
          <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
           <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.title}</a>
          <div class="user-actions-pagination">
              <span class="rate-us">rate us</span>
              <button class="addto-watchlist">
                  add to Watchlist
              </button>
          </div>
      </div>
          `);
        })
      } else if (content_type === "tv") {
        result.forEach(i => {
          $(".paginated-contents").append(`
          <div class="page-item ">
          <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="page-item-image">
              <img src="https://image.tmdb.org/t/p/w500/${i.backdrop_path}" alt="Movie">
          </a>
           <a href="details.html?id=${i.id}&type=${content_type}" title="Get Details" target="_self" class="pagination-title">${i.name}</a>
          <div class="user-actions-pagination">
              <span class="rate-us">rate us</span>
              <button class="addto-watchlist">
                  add to Watchlist
              </button>
          </div>
      </div>
          `);
        })
      }
    },
    error: (error) => {
      alert("something went wrong");
      console.log(error);
    }

  });
}
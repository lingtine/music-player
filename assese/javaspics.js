



const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playList = $('.playlist')
const cdThumb = $('.cd-thumb')
const cd = $('.cd')
const nameCurrentSong = $('header h2')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const seek = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')



/**
 * 1. Render songs -> ok
 * 2. Scroll Top -> ok
 * 3. Play/pause/seek -> ok
 * 4. CD rotate -> ok
 * 5. Next / prev  -> ok
 * 6. Random -> ok
 * 7. Next / Repeat When ended ->ok
 * 8. Active Song ->
 * 9. Scroll active song
 * 10. Play song when Click
 */

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Ai No",
            author: "Khoi Vu",
            path: "./assese/musics/aiNoi.mp3",
            image: "./assese/img/aiNo.jpg"
        },
        {
            name: "Con Trai Cung",
            author: "Bray",
            path: "./assese/musics/ConTraiCung.mp3",
            image: "./assese/img/ConTraiCung.jpg"
        },
        {
            name: "Cuoi Thoi",
            author: "masew",
            path: "./assese/musics/cuoiThoi.mp3",
            image: "./assese/img/cuoiThoi.jpg"
        },
        {
            name: "De Vuong",
            author: "Eric",
            path: "./assese/musics/DeVuong.mp3",
            image: "./assese/img/deVuong.jpg"
        },
        {
            name: "Do Toc 2",
            author: "Do Mixi",
            path: "./assese/musics/DoToc2.mp3",
            image: "./assese/img/doToc2.jpg"
        },
        {
            name: "Ex's Hate Me",
            author: "Bray",
            path: "./assese/musics/ExsHateMe.mp3",
            image: "./assese/img/exHateMe.jpg"
        },
        {
            name: "Ai No",
            author: "Khoi Vu",
            path: "./assese/musics/aiNoi.mp3",
            image: "./assese/img/aiNo.jpg"
        },
        {
            name: "Gieo Que",
            author: "Hoang Thuy Linh",
            path: "./assese/musics/GieoQue.mp3",
            image: "./assese/img/gieoQue.jpg"
        },
        {
            name: "Hai Trieu Nam",
            author: "Den Vau",
            path: "./assese/musics/HaiTrieuNam.mp3",
            image: "./assese/img/haiTrieuNam.jpg"
        },
        {
            name: "Muon Roi Ma Sao Con",
            author: "MTP",
            path: "./assese/musics/muonRoiMaSaoCon.mp3",
            image: "./assese/img/muonRoiMaSaoCon.jpg"
        },
        {
            name: "Nam Quoc Son Ha",
            author: "Den Vau",
            path: "./assese/musics/NamQuocSonHa.mp3",
            image: "./assese/img/namQuocSonHa.jpg"
        },
        {
            name: "Truyen Thai Y",
            author: "Ngo Kien Huy",
            path: "./assese/musics/TruyenThaiY.mp3",
            image: "./assese/img/truyenThaiY.jpg"
        },

    ],
    

    defineProperties: function() {
        Object.defineProperty(this,"currentSong",{
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    loadCurrentSong: function () {
        audio.src = this.currentSong.path
        cdThumb.style.background = `url('${this.currentSong.image}')`
        nameCurrentSong.innerHTML = this.currentSong.name




    },
    
    handleEvents: function(){
        const imgCurrHeight = cd.offsetWidth
        const _this = this
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            

            var newWidth = imgCurrHeight - scrollTop

            var cdNewWidth = newWidth < 0 ? 0 : newWidth + 'px'

            cd.style.width = cdNewWidth

            cd.style.opacity = newWidth / imgCurrHeight
        }

        const cdThumbAnimation = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimation.pause()

        playBtn.onclick = function() {
            
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
                
            }
        }
        

        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimation.play()
            
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimation.pause()

        }

        audio.ontimeupdate = function() {
            if(audio.duration) {
                var timeSeekPresent = Math.floor(
                    (audio.currentTime / audio.duration)*100)
                seek.value = timeSeekPresent
            }

            if(audio.ended === true && _this.isRepeat === true)
            {
                audio.play()
            }
            else
            {
                if(audio.ended === true && _this.isRandom === true) {
                    _this.randomSong()
                    audio.play()

                }
                else if(audio.ended === true && _this.isRandom === false){
                    _this.nextSong()
                    audio.play()
                }
            }


        }
        seek.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
          };
        
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()

            }
            else{
                _this.nextSong()
            }
            audio.play()
            _this.scrollToActiveSong()
            

        }
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()

            }
            else{
                _this.prevSong()
            }
            audio.play()
            _this.scrollToActiveSong()
            
        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active")
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active")

        }


        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)") 
            if(songNode || e.target.closest(".option")) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
        


        
    },

    scrollToActiveSong: function() {
        setTimeout(function(){
            const songActive = $('.song.active')
            songActive.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        },500)
    },

    render: function() {
        _this = this
        var htmls = this.songs.map(function(song,index){
            return `
            <div class="song ${index === _this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.author}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })

        playList.innerHTML = htmls.join('')
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex > this.songs.length - 1 ){
            this.currentIndex = 0
        }  
        this.render()
        this.loadCurrentSong()
    },
    prevSong: function (){
        this.currentIndex--

        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.render()

        this.loadCurrentSong()
    },
    randomSong: function() {
        const randomIndex = Math.floor(Math.random() * (this.songs.length - 1))
        this.currentIndex = randomIndex
        this.render()
        this.loadCurrentSong()  
    },




    start: function() {

        this.defineProperties()
        this.render()

        this.loadCurrentSong()
        
        
        
        
        this.handleEvents()
        
    }

}


app.start()

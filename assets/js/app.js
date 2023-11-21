const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
let songListed = []

const app = {
    currentIndex: 0,
    isplaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Cái Tết Giàu',
            singer: 'Đông Nhi & bé Winnie x Lương Bích Hữu x Bùi Công Nam',
            path: './assets/music/cai-tet-giau.mp3',
            image: './assets/images/cai-tet-giau.jpg'
        },
        {
            name: 'MIN x VINCOM - HOÀ NHỊP GIÁNG SINH',
            singer: 'Min',
            path: './assets/music/min.mp3',
            image: './assets/images/min.jpg'
        },
        {
            name: '24/7 365',
            singer: 'elijah woods',
            path: './assets/music/24-7-365.mp3',
            image: './assets/images/24-7-365.jpg'
        },
        // {
        //     name: 'MIN x VINCOM - HOÀ NHỊP GIÁNG SINH',
        //     singer: 'Min',
        //     path: './assets/music/min.mp3',
        //     image: './assets/images/min.jpg'
        // },
        {
            name: 'Ariana Grande - Last Christmas',
            singer: 'Ariana Grande',
            path: './assets/music/last.mp3',
            image: './assets/images/last.jpg'
        },
    ],

    render: function () {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>  
            `
        })

        $('.playlist').innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function () {
        _this = this
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        playBtn.onclick = function () {
            if (_this.isplaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function () {
            _this.isplaying = true
            cdThumb.classList.add('rotate')
            cdThumb.style.animationPlayState = 'running'
            player.classList.add('playing')
        }

        audio.onpause = function () {
            _this.isplaying = false
            cdThumb.style.animationPlayState = 'paused'
            player.classList.remove('playing')
        }

        audio.ontimeupdate = function () {
            //audio.duration là tổng thời gian bài hát
            // audio.currentTime là thời gian hiện tại của bài hát

            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100
                progress.value = progressPercent
            }
        }

        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value
            audio.currentTime = seekTime
        }

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.preSong()
            }
            audio.play()
        }

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        audio.onended = function () {
            if (_this.isRepeat) {
                _this.repeatSong()
            } else {
                console.log(songListed)
                songListed.push(_this.currentIndex)
                if (songListed.length === _this.songs.length + 1) {
                    songListed = []
                }

                // if (songListed.includes(_this.currentIndex)) {
                //     _this.randomSong()
                // } else {
                //     songListed.push(_this.currentIndex)
                //     nextBtn.click()
                // }
                nextBtn.click()
            }
        }
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    preSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    repeatSong: function () {
        audio.currentTime = 0
        audio.play()
    },

    loadCurrentSong: function () {
        const titleSong = $('header h2')

        titleSong.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    start: function () {
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();

        this.render();
    }
}

app.start()


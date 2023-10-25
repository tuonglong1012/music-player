const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd') 
const audio = $('#audio')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const PLAYER_STORAGE_KEY = 'PON_PLAYER'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, // parse để lấy ra trở về Array object
    songs: [
        {
            id: 0,
            title: 'Nến và Hoa',
            artist: 'Rhymastic',
            src: './assets/songs/song11.mp3',
            img: './assets/img/song11.jpg',

        },
        {
            id: 1,
            title: 'Nơi Này Có Anh',
            artist: 'Sơn Tùng MTP',
            src: './assets/songs/song12.mp3',
            img: './assets/img/song12.jpg',

        },
        {
            id: 2,
            title: 'Mưa Tháng Sáu',
            artist: 'Văn Mai Hương ft Trung Quân Idol',
            src: './assets/songs/song3.mp3',
            img: './assets/img/song3.png',

        },
        {
            id: 3,
            title: 'Ngày Mai Người Ta Lấy Chồng',
            artist: 'Thành Đạt x Đồng Thiên Đức',
            src: './assets/songs/song4.mp3',
            img: './assets/img/song4.png',

        },
        {
            id: 4,
            title: 'Chơi Như Tụi Mỹ',
            artist: 'Andree',
            src: './assets/songs/song5.mp3',
            img: './assets/img/song5.jpg',
        },
        {
            id: 5,
            title: 'Nàng Thơ',
            artist: 'Hoàng Dũng',
            src: './assets/songs/song6.mp3',
            img: './assets/img/song6.jpg',
        },
        {
            id: 7,
            title: 'Nửa thập kỷ',
            artist: 'Hoàng Dũng',
            src: './assets/songs/song7.mp3',
            img: './assets/img/song7.jpg',
        },
        {
            id: 8,
            title: 'Có Ai Hẹn Hò Em Chưa',
            artist: 'Quân AP',
            src: './assets/songs/song2.mp3',
            img: './assets/img/song2.png',

        },
        {
            id: 9,
            title: 'Tháng Mấy Em Nhớ Anh ?',
            artist: 'Hà ANh Tuấn',
            src: './assets/songs/song9.mp3',
            img: './assets/img/song9.jpg',
        },
        {
            id: 10,
            title: 'Tháng Tư Là Lời Nói Dối Của Anh',
            artist: 'Hà ANh Tuấn',
            src: './assets/songs/song10.mp3',
            img: './assets/img/song10.jpg',
        },
        {
            id: 11,
            title: 'À Lôi',
            artist: 'Masew',
            src: './assets/songs/song1.mp3',
            img: './assets/img/song1.png',

        },
    ],

    // cài đặt cấu hình
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    // định nghĩa các thuộc tính
    defineProperties: function() {
        return Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.title
        audio.src = this.currentSong.src
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`
    },
    
    // render song playlist
    render: function() {
        const htmls = this.songs.map((song, index) => {
            // console.log(index)
            return`
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-id="${index}">

                    <div class="thumb">
                        <img class="song-img-background" src="${song.img}">
                        <style>
                            .song-img-background {
                                height: 55px;
                                width: 55px;
                                border-radius: 200px;
                            }
                        </style>
                    </div>

                    <div class="body">
                        <h3 class="title"> ${song.title} </h3>
                        <p class="author"> ${song.artist} </p>
                    </div>

                    <div class="option"> 
                        <i class="fas fa-ellipsis-h"> </i>
                    </div>
                </div>
            `
        })

        playlist.innerHTML = htmls.join('')
    },
    // tải cấu hình ban đầu
    loadConfig: function() { 
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    // Xử lí các sự kiện (DOM Events)
    handleSong: function() {
        const _this = this

        // Xử lí khi cuộn bài hát
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdWidth - scrollTop 

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0     
            cd.style.opacity = newcdWidth / cdWidth
        }

        // Xử lí đĩa CD xoay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 secs
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //  Xử lí khi play / pause bài hát
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else{
                audio.play()
            }
        }
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Xử lí khi tua bài hát
        audio.ontimeupdate = function() {
        if(audio.duration) {
            const progressPercent = audio.currentTime * 100 / audio.duration
            progress.value = progressPercent
        }
        }
        progress.onchange = function(e) {
            const seekTime = audio.duration * e.target.value / 100 
            audio.currentTime = seekTime
        }

        // Xử lí khi chuyển bài tiếp theo
        nextBtn.onclick = function() {
            if(_this.isRandom) { 
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            
            audio.play()
            _this.render()
        }

        // Xử lí khi chuyển bài trước
        prevBtn.onclick = function() {
            if(_this.isRandom) { 
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Xử lí khi phát random bài hát
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }

        // Xử lí khi lặp lại bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
            _this.setConfig('isRepeat', _this.isRepeat)
        }

        // Xử lí khi bài hát kết thúc
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else{
                _this.nextSong()
                audio.play()
                // viet cach khac: nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
               // Element: closest() method => Trả về chính nó hoặc elements cha của nó, nếu ko có gì trả về null

                // Xử lí khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-id')) // cách viết khác: songNode.getAttribute('data-id')
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lí khi click vào option
                if(e.target.closest('.option')) {

                }
            }
        }
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.scrollIntoViewSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        this.scrollIntoViewSong()
    },
    scrollIntoViewSong: function() {
        // scrollIntoView Methods
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    randomSong: function() {
        let newIndex
        do 
            newIndex = Math.floor(Math.random() * this.songs.length)
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {

        // gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // định nghĩa các thuộc tính
        this.defineProperties()

        // Tải bài hát hiện tại
        this.loadCurrentSong()

        // xử lí sự kiện (DOM Events)
        this.handleSong()

        // render bài hát
        this.render()

        // hiển thị trang thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }
} 

app.start()
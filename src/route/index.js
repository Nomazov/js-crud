// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
    static #list = []

    constructor(name, author, image) {
        this.id = Math.floor(1000 + Math.random() * 9000)
        this.name = name
        this.author = author
        this.image = image
    }

    static create(name, author, image) {
        const newTrack = new Track(name, author, image)
        this.#list.push(newTrack)
        return newTrack
    }

    static getList() {
        return this.#list.reverse()
    }

    static getById(id) {
        return Track.#list.find((track) => track.id === id)
    }
}

Track.create(
    'Інь Ян',
    'MONATIK і ROXOLANA',
    'https://picsum.photos/100/100'
)

Track.create(
    'Baila Conmigo (Remix)',
    'Selena Gomez і Rauw Alejandro',
    'https://picsum.photos/100/100'
)

Track.create(
    'Shameless ',
    'Camila Cabello ',
    'https://picsum.photos/100/100'
)

Track.create(
    'DÁKITI',
    'BAD BUNNY і JHAY',
    'https://picsum.photos/100/100'
)

Track.create(
    '11 PM',
    'Maluma',
    'https://picsum.photos/100/100'
)

console.log(Track.getList())

class PlayList {
    static #list = []

    constructor(name) {
        this.id = Math.floor(1000 + Math.random() * 9000)
        this.name = name
        this.tracks = []
        this.image = `https://picsum.photos/100/100`
        this.trackCount = 0
    }

    static create(name) {
        const newPlayList = new PlayList(name)
        this.#list.push(newPlayList)
        return newPlayList
    }

    static getList() {
        return this.#list.reverse()
    }

    static makeMix(playList) {
        const allTracks = Track.getList()

        let randomTracks = allTracks
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)

        playList.tracks.push(...randomTracks)

        playList.trackCount = playList.tracks.length
    }

    static getById(id) {
        return (
            PlayList.#list.find((playList) => playList.id === id) || null
        )
    }

    deleteTrackById(trackId) {
        this.tracks = this.tracks.filter((track) => track.id !== trackId)
        this.trackCount = this.tracks.length
    }

    addTrack(track) {
        this.tracks.unshift(track)
        this.trackCount = this.tracks.length
    }

    trackSumm() {
        return this.trackCount
    }

    static findListByValue(name) {
        return this.#list.filter((playList) =>
            playList.name.toLowerCase().includes(name.toLowerCase())
        )
    }
}

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {

    const playList = PlayList.getList()

    res.render('spotify-playlist-list', {

        style: 'spotify-playlist-list',

        data: {
            playList: playList,
            isEmpty: playList.length === 0
        }
    })
    // ↑↑ сюди вводимо JSON дані
})

router.get('/spotify-choose', function (req, res) {
    // res.render генерує нам HTML сторінку

    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('spotify-choose', {
        // вказуємо назву папки контейнера, в якій знаходяться наші стилі
        style: 'spotify-choose',

        data: {

        }
    })
    // ↑↑ сюди вводимо JSON дані
})


router.get('/spotify-create', function (req, res) {
    const isMix = !!req.query.isMix

    console.log(isMix)

    res.render('spotify-create', {
        // вказуємо назву папки контейнера, в якій знаходяться наші стилі
        style: 'spotify-create',

        data: {
            isMix,
        }
    })
})

router.post('/spotify-create', function (req, res) {
    const isMix = !!req.query.isMix
    const name = req.body.name

    if (!name) {
        return res.render('spotify-alert', {
            style: 'spotify-alert',

            data: {
                message: 'Помилка',
                info: 'Введіть назву плейліста',
                link: isMix ? `/spotify-create?isMix=true` : '/spotify-create',
            }
        })
    }

    const playList = PlayList.create(name)

    if (isMix) {
        PlayList.makeMix(playList)
    }

    console.log(playList)

    res.render('spotify-playlist', {
        style: 'spotify-playlist',

        data: {
            playListId: playList.id,
            tracks: playList.tracks,
            name: playList.name
        }
    })
})


router.get('/spotify-playlist', function (req, res) {
    const id = Number(req.query.id)

    const playList = PlayList.getById(id)

    if (!playList) {
        return res.render('spotify-alert', {
            style: 'spotify-alert',

            data: {
                message: 'Помилка',
                info: 'Плейліста не знайдено',
                link: `/`,
            }
        })
    }

    res.render('spotify-playlist', {
        style: 'spotify-playlist',

        data: {
            playListId: playList.id,
            tracks: playList.tracks,
            name: playList.name
        }
    })
})


router.get('/spotify-track-delete', function (req, res) {
    const playListId = Number(req.query.playListId)
    const trackId = Number(req.query.trackId)

    const playList = PlayList.getById(playListId)

    if (!playList) {
        return res.render('spotify-alert', {
            style: 'spotify-alert',

            data: {
                message: 'Помилка',
                info: 'Плейліста не знайдено',
                link: `/spotify-playlist?id=${playListId}`,
            }
        })
    }

    playList.deleteTrackById(trackId)

    res.render('spotify-playlist', {
        style: 'spotify-playlist',

        data: {
            playListId: playList.id,
            tracks: playList.tracks,
            name: playList.name
        }
    })
})


router.get('/spotify-search', function (req, res) {
    const value = ''

    const list = PlayList.findListByValue(value)

    res.render('spotify-search', {
        style: 'spotify-search',

        data: {
            list: list.map(({ tracks, ...rest }) => ({
                ...rest,
                amount: tracks.length
            })),
            value,
        }
    })
})


router.post('/spotify-search', function (req, res) {
    const value = req.body.value || ''
    const list = PlayList.findListByValue(value)

    console.log(value)

    res.render('spotify-search', {
        style: 'spotify-search',

        data: {
            list: list.map(({ tracks, ...rest }) => ({
                ...rest,
                amount: tracks.length
            })),
            value,
        }
    })
})


router.get('/spotify-playlist-add', function (req, res) {
    const playListId = Number(req.query.playListId)
    const tracks = Track.getList()


    if (!playListId) {
        return res.render('spotify-alert', {
            style: 'spotify-alert',

            data: {
                message: 'Помилка',
                info: 'Плейліста таким ID не знайдено',
                link: `/`,
            }
        })
    }

    res.render('spotify-playlist-add', {
        style: 'spotify-playlist-add',

        data: {
            playListId: playListId,
            tracks: tracks,
        }
    })
})

router.get('/spotify-track-add', function (req, res) {
    const playListId = Number(req.query.playListId)
    const trackId = Number(req.query.trackId)

    const playList = PlayList.getById(playListId)

    if (!playList) {
        return res.render('spotify-alert', {
            style: 'spotify-alert',

            data: {
                message: 'Помилка',
                info: 'Плейліста не знайдено',
                link: `/spotify-playlist?id=${playListId}`,
            }
        })
    }

    const trackAdd = Track.getById(trackId);

    if (!trackAdd) {
        return res.render('spotify-alert', {
            style: 'spotify-alert',
            data: {
                message: 'Помилка',
                info: 'Трека не знайдено',
                link: `/spotify-playlist?id=${playListId}`,
            }
        });
    }

    const trackDuplicate = playList.tracks.some(track => track.id === trackAdd.id);

    if (trackDuplicate) {
        return res.render('spotify-alert', {
            style: 'spotify-alert',
            data: {
                message: 'Помилка',
                info: 'Трек вже у плейлисті',
                link: `/spotify-playlist?id=${playListId}`,
            }
        });
    }


    playList.addTrack(trackAdd)

    res.render('spotify-playlist', {
        style: 'spotify-playlist',

        data: {
            playListId: playList.id,
            tracks: playList.tracks,
            name: playList.name
        }
    })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router

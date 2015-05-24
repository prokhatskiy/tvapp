module.exports = {
    DB : 'mongodb://localhost:27017/tvapp',

    USER: {
        name: 'admin',
        password: 'admin'
    },

    SERVICES: {
        ROOT: 'services',
        GET_SLIDE: 'slide',
        POST_SLIDE: 'slide',
        DELETE_SLIDE: 'slide',
        GET_TIMELINE: 'timeline',
        POST_TIMELINE: 'timeline',
        GET_SLIDES: 'slides',
        POST_SLIDES: 'slides',
        LOGIN: 'login',
        LOGOUT: 'logout',
        CHECK_ACCESS: 'access',
        IMAGE: 'image',
        SLIDESHOW: 'slideshow'
    },

    SCHEMAS: {
        ITEM: {
            isActive: {type: Boolean, default: false},
            timelineOrder: {type: Number, default: 0},
            generalOrder: {type: Number, default: 0},
            title: String,
            description: String,
            slideType: String,
            name: String,
            position: String,
            department: String,
            startDate: Date,
            imageSrc: String,
            dateRangeStart: Date,
            dateRangeEnd: Date,
            videoURL: String,
            duration: {type: Number, default: 10},
            employees: [{
                name: String,
                date: Date
            }]
        },

        TOKEN: {
            token: String
        }
    }
};

const config = {
    development: {
        apiUrl: "http://localhost:8080"
    },

    production: {
        apiUrl: "https://zprefix-api.herokuapp.com/" // change this
    },
    test: {
        apiUrl: ''
    }
}

export default config;
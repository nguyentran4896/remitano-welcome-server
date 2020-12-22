require('../../test/sinon-mongoose')
const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect

const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const mockDB = require('../../test/mockDB')
before(async () => await mockDB.connect())

after(async () => {
    await mockDB.disconnect();
});

const Movie = require('../models/Movie')
const moviesService = require('./movies')

describe("Get all movies", function () {
    // Test will pass if we get all movies
    it("should return all movies", function (done) {
        var MovieMock = sinon.mock(moviesService)
        var expectedResult = { status: true, movie: [] }
        MovieMock.expects('getMovies').yields(null, expectedResult)
        moviesService.getMovies(function (err, result) {
            MovieMock.verify()
            MovieMock.restore()
            expect(result.status).to.be.true
            done()
        })
    })
})

// Test will pass if the movie is saved
describe("Post a new movie", function () {
    it("should create new post", function (done) {
        let newMovie = new Movie({ title: 'Save new movie from mock', description: 'test description' })

        var MovieMock = sinon.mock(moviesService)
        var expectedResult = { status: true }
        MovieMock.expects('addMovie').yields(null, expectedResult)
        moviesService.addMovie(newMovie, function (err, result) {
            MovieMock.verify()
            MovieMock.restore()
            expect(result.status).to.be.true
            done()
        })
    })
    // Test will pass if the movie is not saved
    it("should return error, if post not saved", function (done) {
        var MovieMock = sinon.mock(new Movie({ title: 'Save new movie from mock', description: 'test description' }))
        var movie = MovieMock.object
        var expectedResult = { status: false }
        MovieMock.expects('save').yields(expectedResult, null)
        movie.save(function (err, result) {
            MovieMock.verify()
            MovieMock.restore()
            expect(err.status).to.not.be.true
            done()
        })
    })
})


// Test will pass if the movie is deleted based on an ID
describe("Delete a movie by id", function () {
    it("should delete a movie by id", function (done) {
        var MovieMock = sinon.mock(Movie);
        var expectedResult = { status: true };
        MovieMock.expects('remove').withArgs({ _id: 12345 }).yields(null, expectedResult);
        Movie.remove({ _id: 12345 }, function (err, result) {
            MovieMock.verify();
            MovieMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the movie is not deleted based on an ID
    it("should return error if delete action is failed", function (done) {
        var MovieMock = sinon.mock(Movie);
        var expectedResult = { status: false };
        MovieMock.expects('remove').withArgs({ _id: 12345 }).yields(expectedResult, null);
        Movie.remove({ _id: 12345 }, function (err, result) {
            MovieMock.verify();
            MovieMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});

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

const User = require('../models/User')
const usersService = require('./users')

describe("Get all users", function () {
    // Test will pass if we get all users
    it("should return all users", function (done) {
        var UserMock = sinon.mock(usersService)
        var expectedResult = { status: true, user: [] }
        UserMock.expects('getUsers').yields(null, expectedResult)
        usersService.getUsers(function (err, result) {
            UserMock.verify()
            UserMock.restore()
            expect(result.status).to.be.true
            done()
        })
    })
})

// Test will pass if the user is saved
describe("Post a new user", function () {
    it("should create new post", function (done) {
        let newUser = new User({ title: 'Save new user from mock', description: 'test description' })

        var UserMock = sinon.mock(usersService)
        var expectedResult = { status: true }
        UserMock.expects('addUser').yields(null, expectedResult)
        usersService.addUser(newUser, function (err, result) {
            UserMock.verify()
            UserMock.restore()
            expect(result.status).to.be.true
            done()
        })
    })
    // Test will pass if the user is not saved
    it("should return error, if post not saved", function (done) {
        var UserMock = sinon.mock(new User({ title: 'Save new user from mock', description: 'test description' }))
        var user = UserMock.object
        var expectedResult = { status: false }
        UserMock.expects('save').yields(expectedResult, null)
        user.save(function (err, result) {
            UserMock.verify()
            UserMock.restore()
            expect(err.status).to.not.be.true
            done()
        })
    })
})


// Test will pass if the user is deleted based on an ID
describe("Delete a user by id", function () {
    it("should delete a user by id", function (done) {
        var UserMock = sinon.mock(User);
        var expectedResult = { status: true };
        UserMock.expects('remove').withArgs({ _id: 12345 }).yields(null, expectedResult);
        User.remove({ _id: 12345 }, function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(result.status).to.be.true;
            done();
        });
    });
    // Test will pass if the user is not deleted based on an ID
    it("should return error if delete action is failed", function (done) {
        var UserMock = sinon.mock(User);
        var expectedResult = { status: false };
        UserMock.expects('remove').withArgs({ _id: 12345 }).yields(expectedResult, null);
        User.remove({ _id: 12345 }, function (err, result) {
            UserMock.verify();
            UserMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});

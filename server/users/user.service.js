const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    refreshToken,
    revokeToken,
    getAll,
    getById,
    getRefreshTokens,
    create,
    update,
    delete : _delete
};

async function authenticate({ username, password, ipAddress }) {
    const user = await db.User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'Username or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(user);

    // return basic details and tokens
    return { 
        ...basicDetails(user),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function getAll() {
    const users = await db.User.find();
    return users.map(x => basicDetails(x));
}

async function getById(id) {
    const user = await getUser(id);
    return basicDetails(user);
}

async function getRefreshTokens(userId) {
    // check that user exists
    await getUser(userId);

    // return refresh tokens for user
    const refreshTokens = await db.RefreshToken.find({ user: userId });
    return refreshTokens;
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.passwordHash = bcrypt.hashSync(userParam.password, 10);
    }

    // check the role
    //console.log(userParam.role);
    if(userParam.role && userParam.role.toLowerCase() == 'user'){
        user.managerId = userParam.managerId;
       // console.log("------------mana-----");
       // console.log(user);
    }else{
      //  console.log(user);
        user.managerId = null;
    }

    // save user
    const user1 = await user.save();    
    return basicDetails(user1);
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    console.log(id);
    await User.findByIdAndRemove(id);
}

// helper functions

async function getUser(id) {
    if (!db.isValidId(id)) throw 'User not found';
    const user = await db.User.findById(id);
    if (!user) throw 'User not found';
    return user;
}

async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign({ sub: user.id, id: user.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
    const { id, firstName, lastName, username, role, managerId, userhierarchy } = user;
    return { id, firstName, lastName, username, role, managerId, userhierarchy };
}

const fs = require("fs/promises");
const path = require("path");
const shortid = require("shortid");
const dbLocation = path.resolve("src", "db.json");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns the random user
 */
module.exports.getRandomUser = async (req, res) => {
  const data = await fs.readFile(dbLocation);
  const users = JSON.parse(data);

  // get the random user index:
  const randomUserIndex = Math.floor(Math.random() * users.length);

  // get the random user data:
  const user = users[randomUserIndex];

  if (user) {
    return res.status(200).json({
      message: "Successfully find the random user",
      user,
    });
  } else return res.status(404).json({ message: "user not found!" });
};

module.exports.updateUserById = async (req, res) => {
  const { id } = req.params;

  const data = await fs.readFile(dbLocation);
  const users = JSON.parse(data);

  const user = users.find((user) => user.id == id);

  user.gender = req.body?.gender || user?.gender;
  user.name = req.body?.name || user?.name;
  user.address = req.body?.address || user?.address;
  user.contact = req.body?.contact || user?.contact;
  user.photoUrl = req.body?.photoUrl || user?.photoUrl;

  // then after updating the user write the database to the update user:
  await fs.writeFile(dbLocation, JSON.stringify(users));

  if (user) {
    return res.status(200).json({
      message: "Successfully update the user",
      user,
    });
  } else return res.status(404).json({ message: "user not found!" });
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const data = await fs.readFile(dbLocation);
  const users = JSON.parse(data);

  // which user i remove from the database:
  const user = users.find((user) => user.id == id);

  // if user passes wrong id into their url params:
  if (!user) {
    return res.status(400).json({ message: `user id ${id} does not exist` });
  }

  const afterDeletedUser = users.filter((user) => user.id !== id);
  await fs.writeFile(dbLocation, JSON.stringify(afterDeletedUser));
  // no response return and no content status code : 203;
  return res.status(203).send();
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @returns the all users information
 */

module.exports.getAllUsers = async (req, res) => {
  const data = await fs.readFile(dbLocation);

  //   parsing the json data because we know that in database all documents are the JSON:
  const users = JSON.parse(data);

  const { limit } = req.query;

  if (limit) {
    return res.status(200).json(users.slice(0, limit));
  }
  res.status(200).json(users);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @return save the user in the database
 */
module.exports.postUser = async (req, res) => {
  // post the single user into the users array:

  const user = {
    id: shortid.generate(),
    ...req.body,
  };
  const { gender, name, contact, photoUrl, address } = req.body;
  //   get the users from src/db.json file and it returns the buffer then i convert the buffer into the json object:
  const data = await fs.readFile(dbLocation);
  const users = JSON.parse(data);

  //   push the single user into the users array:
  if (gender && name && contact && photoUrl && address) {
    users.push(user);
  }

  //   then write the all users into the src/db.json file:
  fs.writeFile(dbLocation, JSON.stringify(users));

  if (gender && name && contact && photoUrl && address) {
    return res.status(201).json({
      message: "Successfully added user",
      users,
    });
  }

  return res.status(400).json({ message: "Could not add this user", user });
};

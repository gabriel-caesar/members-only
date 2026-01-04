const pool = require('./pool');
const bcrypt = require('bcryptjs');

exports.signUpUser = async (firstname, lastname, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      `
        INSERT INTO users (firstname, lastname, email, password, member, admin)
        VALUES
          ($1, $2, $3, $4, false, false);
      `,
      [firstname, lastname, email, hashedPassword]
    );
  } catch (error) {
    throw new Error(`Couldn't insert user into db. ${error}`);
  }
};

exports.createMessage = async (title, content, user_id) => {
  try {
    await pool.query(
      `
      INSERT INTO messages (title, content, user_id)
      VALUES
        ($1, $2, $3);
    `,
      [title, content, user_id]
    );
  } catch (error) {
    throw new Error(`Couldn't insert message into the database. ${error}`);
  }
};

exports.getAllMessages = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT
        messages.*,
        users.firstname, 
        users.lastname
      FROM messages
      JOIN users ON messages.user_id = users.id;
    `);
    return rows;
  } catch (error) {
    throw new Error(`Couldn't get all messages. ${error}`);
  }
};

exports.getMessage = async (id) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM messages WHERE id = $1`, [
      id,
    ]);
    return rows[0];
  } catch (error) {
    throw new Error(`Couldn't get message with id ${id} from db. ${error}`);
  }
};

exports.editMessage = async (title, content, user_id, id) => {
  const date = new Date(); // generates the most recent edit date
  try {
    await pool.query(
      `
      UPDATE messages
      SET 
        title = $1,
        content = $2,
        date = $3,
        user_id = $4
      WHERE id = $5;
    `,
      [title, content, date, user_id, id]
    );
  } catch (error) {
    throw new Error(`Couldn't insert message into the database. ${error}`);
  }
};

exports.turnUserMember = async (id) => {
  try {
    await pool.query(`UPDATE users SET member = true WHERE id = $1`, [id]);
  } catch (error) {
    throw new Error(`Couldn't turn user with id ${id} a member. ${error}`);
  }
};

exports.turnUserAdmin = async (id) => {
  try {
    await pool.query(`UPDATE users SET admin = true WHERE id = $1`, [id]);
  } catch (error) {
    throw new Error(`Couldn't turn user with id ${id} a admin. ${error}`);
  }
};

exports.resignUserAdmin = async (id) => {
  try {
    await pool.query(`UPDATE users SET admin = false WHERE id = $1`, [id]);
  } catch (error) {
    throw new Error(
      `Couldn't resign admin for the user with id ${id}. ${error}`
    );
  }
};

exports.deleteMessage = async (id) => {
  try {
    await pool.query(`DELETE FROM messages WHERE id = $1`, [id]);
  } catch (error) {
    throw new Error(`Couldn't delete message with id ${id}. ${error}`);
  }
};

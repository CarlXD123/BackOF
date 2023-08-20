import {getPool} from "../database/database"
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const getUsers= async (req, res)=>{
    try {
        const connection= await getPool();
        const result=await connection.query("SELECT id, username FROM `users`");
        res.json(result); 
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateUser= async (req, res)=>{
    try {
        const {id} = req.params;
        const {username, password} = req.body;

        if(id == undefined || username == undefined || password == undefined){
            res.status(400).json({message:"Bad request. Please fill all field."})
        }

        const usuario = {username, password};
        const connection= await getPool();
        const result=await connection.query("UPDATE `users` SET ? where id = ?", [usuario, id]);
        res.json(result); 
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getUser= async (req, res)=>{
    try {
        const {id} = req.params;
        const connection= await getPool();
        const result=await connection.query("SELECT id, username FROM `users` WHERE id = ?", id);
        res.json(result); 
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteUser= async (req, res)=>{
    try {
        const {id} = req.params;
        const connection= await getPool();
        const result=await connection.query("DELETE FROM `users` WHERE id = ?", id);
        res.json(result); 
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


const addUsers= async (req, res) => {
    let connection;
    try {
        const {username, password, email} = req.body;
        if(username === undefined || password === undefined || email === undefined){
            res.status(400).json({message:"Bad request. Please fill all field."});
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const usuario = {username, password: hashedPassword, email};
        connection = await getPool();
        const result = await connection.query("INSERT INTO users SET ?", usuario);

        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    } finally {
        if (connection) connection.release(); // release the connection back to the pool
    }
};


const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Primero, obtén el usuario de la base de datos usando el nombre de usuario proporcionado
      const connection = await getPool();
      const users = await connection.query("SELECT * FROM `users` WHERE email = ?", email);
  
      // Verifica si el usuario existe
      if (users.length > 0) {
        const user = users[0];
  
        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const match = await bcrypt.compare(password, user.password);
  
        // Si la contraseña coincide, genera un token para el usuario
        if (match) {
          const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });
  
          res.json({ message: 'Login successful', token: token });
        } else {
          res.status(400).json({ message: 'Invalid password' });
        }
      } else {
        res.status(400).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
};

const getProfile = async (req, res) => {
    try {
        const {id} = req.params;
        const connection= await getPool();
        const result=await connection.query("SELECT id, username FROM `users` WHERE id = ?", id);
        if (result && result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "User not found" });
        }
        
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};


const sendMessage = async (req, res) => {
    try {
        const { userId, message, recipient_id } = req.body; // asumiendo que el front-end envía el ID del usuario y el mensaje
        const connection = await getPool();
        await connection.query("INSERT INTO mensajes (user_id, message, recipient_id) VALUES (?, ?, ?)", [userId, message, recipient_id]);
        res.json({ message: "Message sent successfully." });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getMessagesBetweenUsers = async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;
        const connection = await getPool();
        const messages = await connection.query("SELECT u.username, m.message, m.timestamp FROM mensajes m JOIN users u ON m.user_id = u.id WHERE (m.user_id = ? AND m.recipient_id = ?) OR (m.user_id = ? AND m.recipient_id = ?) ORDER BY m.timestamp ASC", [user1Id, user2Id, user2Id, user1Id]);
        res.json(messages);
    } catch (error) {
        res.status(500).send(error.message);
    }
};



export const methods = {
    getUsers,
    addUsers,
    getUser,
    deleteUser,
    updateUser,
    loginUser,
    getProfile,
    sendMessage,  // la función modificada
    getMessagesBetweenUsers

};

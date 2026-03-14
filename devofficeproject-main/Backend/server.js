const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken module
const salt = 10;
const multer = require('multer');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
// Add this line after initializing your Express app
app.use(express.static('public'));

// This assumes that your avatar images are stored in a folder named "images" within your server's public directory.


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Corrected the callback function call
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Corrected the callback function call and added 'path' module
    }
});

const upload = multer({
    storage: storage
})



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'devoffice'
});

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"]
    if (!token) {
        return res.status(401).json({ error: "Missing access token" })
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Not Authenticated" })
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}


app.post('/upload', upload.single('image'), verifyJwt, (req, res) => {
    const userId = req.userId; // Extract the user ID from the JWT payload
    const image = req.file.filename;
    const sql = "UPDATE users SET avatar = ? WHERE id = ?"; // Update avatar for the specific user
    db.query(sql, [image, userId], (err, result) => {
      if (err) {
        console.error("Error updating avatar:", err);
        return res.json({ Message: "Error updating avatar" });
      }
      return res.json({ Status: "Success" });
    });
  });
  
  




app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/seats', (req, res) => {
    const { date } = req.query; // Extract the selected date from the query parameters
    const sql = `
        SELECT
            seats.*,
            users.avatar AS booked_avatar,
            users.username AS booked_username
        FROM seats
        LEFT JOIN users ON seats.booked_by_user_id = users.id
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);

        // If date is not provided or invalid, return all seats with their status
        if (!date || !isValidDate(date)) {
            return res.json(data);
        }

        // Filter out the booked seats for the specified date
        const bookedSeats = data.filter(seat => {
            // Check if the seat is booked on the specified date
            return seat.last_booked && seat.last_booked.toISOString().slice(0, 10) === date;
        });

        // Update the status of seats based on booking status for the specified date
        const updatedSeats = data.map(seat => {
            if (bookedSeats.some(bookedSeat => bookedSeat.id === seat.id)) {
                return { ...seat, status: 'occupied' };
            } else {
                return { ...seat, status: 'available' }; // Set status to available for non-booked seats
            }
        });

        return res.json(updatedSeats);
    });
});




// Function to check if a date is valid
function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    const d = new Date(dateString);
    if (!d.getTime()) return false; // Invalid date (or this could be epoch)
    return d.toISOString().slice(0, 10) === dateString;
}






app.get('/checkauth', verifyJwt, (req, res) => {
    const sql = "SELECT firstname, lastname, username, email, avatar, specialization, role FROM users WHERE id = ?";
    db.query(sql, [req.userId], (err, result) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: "Error fetching user data" });
        }
        if (result.length > 0) {
            const { firstname, lastname, username, email, avatar, specialization, role } = result[0];
            return res.json({ message: "Authenticated", firstname, lastname, username, email, avatar, specialization, role });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
});




app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (firstname, lastname, email, username, password, role, specialization) VALUES (?, ?, ?, ?, ?, ?, ?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "hashing failed" });
        const values = [
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.username,
            hash,
            req.body.role,
            req.body.specialization
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.log('Error inserting user:', err);
                return res.status(500).json({ error: "Error inserting user" });
            }
            console.log('User inserted successfully');
            return res.status(200).json({ message: "User inserted successfully", data: result });
        });
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE `username` = ?";
    db.query(sql, [req.body.username], (err, data) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.json("Error");
        }
        // console.log("Retrieved user data:", data); Query for data(if the db communicates with program)
        if (data.length > 0) {
            const hashedPassword = data[0].password;
            bcrypt.compare(req.body.password, hashedPassword, (err, result) => {
                if (err) {
                    console.error("Error comparing passwords:", err);
                    return res.json("Error comparing passwords");
                }
                console.log("bcrypt comparison result:", result);
                if (result) {
                    const id = data[0].id;
                    const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: "1d" });
                    return res.json({ Login: true, token, data });
                } else {
                    return res.json("Failure");
                }
            });
        } else {
            return res.json("No record existed");
        }
    });
});

// Update the /updateseat/:id endpoint to include the selected date and booking owner
app.put('/updateseat/:id', verifyJwt, (req, res) => {
    const { id } = req.params;
    const { selectedDate } = req.body;
    const sql = "UPDATE seats SET status = 'occupied', last_booked = ?, booked_by_user_id = ? WHERE id = ?";

    db.query(sql, [selectedDate, req.userId, id], (err, result) => {
        if (err) {
            console.error('Error updating seat status:', err);
            return res.status(500).json({ error: "Error updating seat status" });
        }

        console.log('Seat status updated successfully');
        return res.status(200).json({ message: "Seat status updated successfully", data: result });
    });
});


app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) return res.json(err);
        return res.json("user deleted");
    });
});



app.delete('/deleteSeat/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM seats WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting seat:', err);
            return res.status(500).json({ error: "Error deleting seat" });
        }
        
        console.log('Seat deleted successfully');
        return res.status(200).json({ message: "Seat deleted successfully", data: result });
    });
});


app.post('/addSeat', (req, res) => {
    const { seatNumber } = req.body; // Extract the seatNumber parameter from the request body
    const sql = "INSERT INTO seats (seatnumber, status, last_booked) VALUES (?, 'available', NULL)"; //i have set it to year 2000 as the phpmyadmin dosent allow NULL variables in timestamp attributes

    db.query(sql, [seatNumber], (err, result) => {
        if (err) {
            console.error('Error adding seat:', err);
            return res.status(500).json({ error: "Error adding seat" });
        }
        console.log('Seat added successfully');
        return res.status(200).json({ message: "Seat added successfully", data: result });
    });
});





app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    })
});

app.listen(8081, () => {
    console.log("listening");
});
